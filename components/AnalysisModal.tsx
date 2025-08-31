
import React, { useState } from 'react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  isPdfLoading: boolean;
  analysis: string;
  error: string;
  onExport: (name: string) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    <p className="text-slate-600 text-lg">AI가 당신의 인생을 분석하고 있어요...</p>
    <p className="text-slate-500 text-sm">잠시만 기다려주세요.</p>
  </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown to HTML conversion
    const htmlContent = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-700 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-red-600 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-orange-700 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      .replace(/\n/g, '<br />');
  
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, isLoading, isPdfLoading, analysis, error, onExport }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleExportClick = () => {
    if (name.trim()) {
      onExport(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">AI 인생 분석 결과</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-grow">
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && (
            <div className="text-center text-red-500">
              <h3 className="text-xl font-bold mb-2">오류 발생</h3>
              <p>{error}</p>
            </div>
          )}
          {analysis && !isLoading && !error && (
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <MarkdownRenderer content={analysis} />
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full sm:w-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              disabled={!analysis || isLoading || isPdfLoading}
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
             <button
              onClick={handleExportClick}
              disabled={!analysis || isLoading || isPdfLoading || !name.trim()}
              className="flex-grow sm:flex-grow-0 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPdfLoading ? '생성 중...' : 'PDF로 내보내기'}
            </button>
            <button
              onClick={onClose}
              className="flex-grow sm:flex-grow-0 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalysisModal;
