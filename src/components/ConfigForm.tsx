import { useState } from "react";
import type { SheetsConfig } from "@/lib/sheets";

interface ConfigFormProps {
  onSubmit: (config: SheetsConfig) => void;
}

export const ConfigForm = ({ onSubmit }: ConfigFormProps) => {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // URL에서 Spreadsheet ID 추출
  const extractSpreadsheetId = (input: string): string => {
    // 이미 ID만 입력된 경우
    if (!input.includes("/")) {
      return input;
    }
    // URL에서 ID 추출: /d/{ID}/ 패턴
    const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extractedId = extractSpreadsheetId(spreadsheetId);
    if (clientId && extractedId && sheetName) {
      onSubmit({ clientId, spreadsheetId: extractedId, sheetName });
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Knowledge Whitelisting
        </h1>
        <p className="text-gray-600 mb-6">
          검토할 Google Sheets 정보를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spreadsheet URL 또는 ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="https://docs.google.com/spreadsheets/d/xxx/edit 또는 ID만"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              전체 URL을 붙여넣어도 자동으로 ID를 추출합니다
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시트 이름
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Sheet1"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
};
