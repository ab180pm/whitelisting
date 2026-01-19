import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KnowledgeCard } from "./KnowledgeCard";
import type { KnowledgeItem, FilterState } from "@/types/knowledge";

const ITEMS_PER_PAGE = 10;

interface KnowledgeListProps {
  items: KnowledgeItem[];
  filter: FilterState;
  onItemClick: (item: KnowledgeItem) => void;
  onApprove: (item: KnowledgeItem) => void;
  onReject: (item: KnowledgeItem) => void;
  updatingRowIndex: number | null;
}

export const KnowledgeList = ({
  items,
  filter,
  onItemClick,
  onApprove,
  onReject,
  updatingRowIndex,
}: KnowledgeListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 카테고리 필터
      if (filter.category && item.category !== filter.category) {
        return false;
      }

      // 상태 필터
      if (filter.status === "approved" && item.is_available !== true) {
        return false;
      }
      if (filter.status === "rejected" && item.is_available !== false) {
        return false;
      }

      // 검색 필터
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = item.topic_title.toLowerCase().includes(query);
        const matchesContent = item.post_content.toLowerCase().includes(query);
        const matchesReply = item.reply_content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesReply) {
          return false;
        }
      }

      return true;
    });
  }, [items, filter]);

  // 필터 변경시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (filteredItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        검토할 항목이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 페이지네이션 상단 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="text-sm text-gray-500">
          총 {filteredItems.length}개 중 {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-700 min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {paginatedItems.map((item) => (
          <KnowledgeCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
            onApprove={() => onApprove(item)}
            onReject={() => onReject(item)}
            isUpdating={updatingRowIndex === item.rowIndex}
          />
        ))}
      </div>

      {/* 페이지네이션 하단 */}
      <div className="flex items-center justify-center gap-1 px-4 py-3 bg-white border-t">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-30"
        >
          처음
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-30"
        >
          이전
        </button>
        {/* 페이지 번호 버튼들 */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 text-sm rounded-lg ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-30"
        >
          다음
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-30"
        >
          마지막
        </button>
      </div>
    </div>
  );
};
