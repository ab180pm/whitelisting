interface ProgressBarProps {
  total: number;
  reviewed: number;
  approved: number;
}

export const ProgressBar = ({
  total,
  reviewed,
  approved,
}: ProgressBarProps) => {
  const percent = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-gray-900">
          Knowledge Whitelisting
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>전체: {total}</span>
          <span>검토: {reviewed}</span>
          <span className="text-green-600">사용가능: {approved}</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {percent}% 검토 완료
      </div>
    </div>
  );
};
