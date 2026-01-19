import { Check, X, ExternalLink } from "lucide-react";
import type { KnowledgeItem } from "@/types/knowledge";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onApprove: () => void;
  onReject: () => void;
  onClick: () => void;
  isUpdating: boolean;
}

export const KnowledgeCard = ({
  item,
  onApprove,
  onReject,
  onClick,
  isUpdating,
}: KnowledgeCardProps) => {
  const statusColor = item.is_available
    ? "border-l-green-500 bg-green-50/50"
    : "border-l-red-500 bg-red-50/50";

  return (
    <div
      className={`border border-l-4 rounded-lg ${statusColor} hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{item.topic_title}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
              {item.category}
            </span>
            <span>
              {new Date(item.topic_created_at).toLocaleDateString("ko-KR")}
            </span>
            <span>조회 {item.topic_views}</span>
          </div>
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={`p-2 rounded-lg transition-colors ${
              item.is_available === true
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
            } disabled:opacity-50`}
            onClick={onApprove}
            disabled={isUpdating}
            title="사용가능"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${
              item.is_available === false
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
            } disabled:opacity-50`}
            onClick={onReject}
            disabled={isUpdating}
            title="사용불가"
          >
            <X className="w-5 h-5" />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="원본 보기"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* 질문 내용 */}
      <div className="p-4 border-b border-gray-100">
        <div className="text-xs font-medium text-gray-500 mb-2">질문</div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
          {item.post_content}
        </div>
      </div>

      {/* 답변 내용 */}
      {item.reply_content && (
        <div className="p-4 bg-gray-50/50">
          <div className="text-xs font-medium text-gray-500 mb-2">답변</div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
            {item.reply_content}
          </div>
        </div>
      )}
    </div>
  );
};
