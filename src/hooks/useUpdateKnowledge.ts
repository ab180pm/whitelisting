import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKnowledgeAvailability } from "@/lib/sheets";
import type { KnowledgeItem } from "@/types/knowledge";

interface UpdateParams {
  rowIndex: number;
  isAvailable: boolean;
}

export const useUpdateKnowledge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rowIndex, isAvailable }: UpdateParams) => {
      console.log(
        `[Update] 시트 업데이트 시도: row=${rowIndex}, value=${isAvailable}`,
      );
      await updateKnowledgeAvailability(rowIndex, isAvailable);
      console.log(`[Update] 시트 업데이트 성공: row=${rowIndex}`);
    },
    onMutate: async ({ rowIndex, isAvailable }) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ["knowledge-data"] });

      const previousData = queryClient.getQueryData<KnowledgeItem[]>([
        "knowledge-data",
      ]);

      queryClient.setQueryData<KnowledgeItem[]>(["knowledge-data"], (old) => {
        if (!old) return old;
        return old.map((item) =>
          item.rowIndex === rowIndex
            ? { ...item, is_available: isAvailable }
            : item,
        );
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 롤백
      console.error(
        `[Update] 시트 업데이트 실패: row=${variables.rowIndex}`,
        err,
      );
      if (context?.previousData) {
        queryClient.setQueryData(["knowledge-data"], context.previousData);
      }
    },
    onSuccess: (_data, variables) => {
      console.log(
        `[Update] 완료: row=${variables.rowIndex}, value=${variables.isAvailable}`,
      );
    },
  });
};
