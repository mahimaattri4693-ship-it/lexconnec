import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiFetch } from "@/lib/api-client";

export function useLawyers(specialization?: string) {
  return useQuery({
    queryKey: [api.lawyers.list.path, specialization],
    queryFn: async () => {
      const url = new URL(api.lawyers.list.path, window.location.origin);
      if (specialization) {
        url.searchParams.append("specialization", specialization);
      }
      
      const res = await apiFetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch lawyers");
      return api.lawyers.list.responses[200].parse(await res.json());
    },
  });
}
