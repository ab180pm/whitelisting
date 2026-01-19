import { X } from "lucide-react";
import type { FilterState, ReviewStatus } from "@/types/knowledge";

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  categories: string[];
}

const statusOptions: { value: ReviewStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "미검토" },
  { value: "approved", label: "사용가능" },
  { value: "rejected", label: "사용불가" },
];

export const FilterBar = ({
  filter,
  onFilterChange,
  categories,
}: FilterBarProps) => {
  return (
    <div className="w-72 bg-gray-50 border-r p-4 flex flex-col gap-6 overflow-y-auto">
      {/* 검색 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">검색</h3>
        <input
          type="text"
          placeholder="제목 또는 내용 검색..."
          className="w-full px-3 py-2 border rounded-lg text-sm"
          value={filter.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filter, searchQuery: e.target.value })
          }
        />
      </div>

      {/* 검토 상태 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">검토 상태</h3>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filter, status: opt.value })}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter.status === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">카테고리</h3>
          {filter.category && (
            <button
              onClick={() => onFilterChange({ ...filter, category: null })}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              초기화
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  category: filter.category === cat ? null : cat,
                })
              }
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filter.category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
