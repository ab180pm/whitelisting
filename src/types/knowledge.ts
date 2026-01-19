export interface KnowledgeItem {
  id: number;
  topic_title: string;
  category: string;
  post_content: string;
  reply_content: string;
  url: string;
  topic_created_at: string;
  topic_views: number;
  num_post: number;
  is_available: boolean | null; // null = 미검토, true = 사용가능, false = 사용불가
  rowIndex: number; // 시트 내 행 번호 (업데이트용)
}

export type ReviewStatus = "all" | "pending" | "approved" | "rejected";

export interface FilterState {
  category: string | null;
  status: ReviewStatus;
  searchQuery: string;
}
