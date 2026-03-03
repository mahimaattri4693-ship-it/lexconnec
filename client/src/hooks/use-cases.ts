import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertCase } from "@shared/schema";
import { apiFetch } from "@/lib/api-client";
import { z } from "zod";

export function useCases() {
  return useQuery({
    queryKey: [api.cases.list.path],
    queryFn: async () => {
      const res = await apiFetch(api.cases.list.path);
      if (!res.ok) throw new Error("Failed to fetch cases");
      // The backend returns an array of joined case data, we parse it as any for now per schema
      return api.cases.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertCase) => {
      const res = await apiFetch(api.cases.create.path, {
        method: api.cases.create.method,
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.cases.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create case");
      }
      
      return api.cases.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cases.list.path] });
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const url = buildUrl(api.cases.update.path, { id });
      const res = await apiFetch(url, {
        method: api.cases.update.method,
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error("Failed to update case");
      return api.cases.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cases.list.path] });
    },
  });
}
