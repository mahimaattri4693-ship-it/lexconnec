import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { LoginRequest, InsertUser } from "@shared/schema";
import { apiFetch } from "@/lib/api-client";
import { useLocation } from "wouter";
import { z } from "zod";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await apiFetch(api.auth.me.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiFetch(api.auth.login.path, {
        method: api.auth.login.method,
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      
      const payload = api.auth.login.responses[200].parse(await res.json());
      localStorage.setItem('lexconnect_token', payload.token);
      return payload;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data.user);
      setLocation("/dashboard");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiFetch(api.auth.register.path, {
        method: api.auth.register.method,
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.auth.register.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Registration failed");
      }
      
      const payload = api.auth.register.responses[201].parse(await res.json());
      localStorage.setItem('lexconnect_token', payload.token);
      return payload;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data.user);
      setLocation("/dashboard");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<InsertUser>) => {
      const res = await apiFetch(api.auth.updateProfile.path, {
        method: api.auth.updateProfile.method,
        body: JSON.stringify(updates),
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      return api.auth.updateProfile.responses[200].parse(await res.json());
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([api.auth.me.path], updatedUser);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return () => {
    localStorage.removeItem('lexconnect_token');
    queryClient.setQueryData([api.auth.me.path], null);
    queryClient.clear();
    setLocation("/login");
  };
}
