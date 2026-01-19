import { useState, useEffect, useMemo, useCallback } from "react";
import { ProgressBar } from "./components/ProgressBar";
import { FilterBar } from "./components/FilterBar";
import { KnowledgeList } from "./components/KnowledgeList";
import { DetailPanel } from "./components/DetailPanel";
import { useKnowledgeData } from "./hooks/useKnowledgeData";
import { useUpdateKnowledge } from "./hooks/useUpdateKnowledge";
import {
  initGapiClient,
  initGisClient,
  signIn,
  signOut,
  initWithHardcodedConfig,
} from "./lib/sheets";
import type { KnowledgeItem, FilterState } from "./types/knowledge";
import { LogIn, LogOut, RefreshCw } from "lucide-react";

type AppState = "loading" | "auth" | "ready";

function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    category: null,
    status: "all",
    searchQuery: "",
  });

  const { data: items = [], isLoading, refetch } = useKnowledgeData(isSignedIn);
  const updateMutation = useUpdateKnowledge();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // 앱 시작시 자동으로 Google API 초기화
  useEffect(() => {
    if (!clientId) return;

    initWithHardcodedConfig(clientId);

    gapi.load("client", async () => {
      await initGapiClient();
      initGisClient(clientId, (signedIn) => {
        setIsSignedIn(signedIn);
        if (signedIn) {
          setAppState("ready");
        }
      });
      setAppState("auth");
    });
  }, [clientId]);

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut();
    setIsSignedIn(false);
  };

  const handleApprove = useCallback(
    (item: KnowledgeItem) => {
      updateMutation.mutate({ rowIndex: item.rowIndex, isAvailable: true });
    },
    [updateMutation],
  );

  const handleReject = useCallback(
    (item: KnowledgeItem) => {
      updateMutation.mutate({ rowIndex: item.rowIndex, isAvailable: false });
    },
    [updateMutation],
  );

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === "Escape") {
          setSelectedItem(null);
        } else if (e.key === "a" || e.key === "A") {
          handleApprove(selectedItem);
        } else if (e.key === "r" || e.key === "R") {
          handleReject(selectedItem);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, handleApprove, handleReject]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = items.length;
    const reviewed = items.filter((item) => item.is_available !== null).length;
    const approved = items.filter((item) => item.is_available === true).length;
    return { total, reviewed, approved };
  }, [items]);

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return Array.from(cats).filter(Boolean).sort();
  }, [items]);

  // Client ID 미설정 오류
  if (!clientId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-700 mb-4">설정 오류</h1>
          <p className="text-red-600">
            VITE_GOOGLE_CLIENT_ID 환경 변수가 설정되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 화면
  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Google API 초기화 중...</p>
        </div>
      </div>
    );
  }

  // 인증 화면
  if (appState === "auth" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Google 로그인
          </h1>
          <p className="text-gray-600 mb-6">
            Google Sheets에 접근하려면 Google 계정으로 로그인해주세요.
          </p>
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Google로 로그인
          </button>
        </div>
      </div>
    );
  }

  // 메인 화면
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 헤더 */}
      <ProgressBar
        total={stats.total}
        reviewed={stats.reviewed}
        approved={stats.approved}
      />

      {/* 툴바 */}
      <div className="bg-white border-b px-6 py-2 flex items-center justify-end gap-2">
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 overflow-hidden">
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          categories={categories}
        />
        <KnowledgeList
          items={items}
          filter={filter}
          onItemClick={setSelectedItem}
          onApprove={handleApprove}
          onReject={handleReject}
          updatingRowIndex={
            updateMutation.isPending
              ? (updateMutation.variables?.rowIndex ?? null)
              : null
          }
        />
      </div>

      {/* 상세 패널 */}
      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onApprove={() => selectedItem && handleApprove(selectedItem)}
        onReject={() => selectedItem && handleReject(selectedItem)}
        isUpdating={updateMutation.isPending}
      />
    </div>
  );
}

export default App;
