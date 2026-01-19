import { useQuery } from "@tanstack/react-query";
import { fetchKnowledgeData } from "@/lib/sheets";

export const useKnowledgeData = (enabled: boolean) => {
  return useQuery({
    queryKey: ["knowledge-data"],
    queryFn: fetchKnowledgeData,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
