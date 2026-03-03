import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiFetch } from "@/lib/api-client";

export function useAIChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await apiFetch(api.ai.chat.path, {
        method: api.ai.chat.method,
        body: JSON.stringify({ message }),
      });
      
      if (!res.ok) throw new Error("AI failed to respond");
      return api.ai.chat.responses[200].parse(await res.json());
    },
  });
}
