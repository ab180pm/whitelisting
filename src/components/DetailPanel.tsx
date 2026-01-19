import { X, Check, ExternalLink } from "lucide-react";
import type { KnowledgeItem } from "@/types/knowledge";

interface DetailPanelProps {
  item: KnowledgeItem | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isUpdating: boolean;
}

export const DetailPanel = ({
  item,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}: DetailPanelProps) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {item.topic_title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="px-2 py-0.5 bg-gray-200 rounded">
                {item.category}
              </span>
              <span>
                {new Date(item.topic_created_at).toLocaleDateString("ko-KR")}
              </span>
              <span>조회 {item.topic_views}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                원본
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              질문 내용
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
              {item.post_content}
            </div>
          </div>

          {item.reply_content && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                답변 내용
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {item.reply_content}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            현재 상태:{" "}
            <span
              className={
                item.is_available === true
                  ? "text-green-600 font-medium"
                  : item.is_available === false
                    ? "text-red-600 font-medium"
                    : "text-gray-500"
              }
            >
              {item.is_available === true
                ? "사용가능"
                : item.is_available === false
                  ? "사용불가"
                  : "미검토"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                item.is_available === false
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              } disabled:opacity-50`}
              onClick={onReject}
              disabled={isUpdating}
            >
              <X className="w-4 h-4" />
              사용불가
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                item.is_available === true
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              } disabled:opacity-50`}
              onClick={onApprove}
              disabled={isUpdating}
            >
              <Check className="w-4 h-4" />
              사용가능
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
