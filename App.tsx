
import React, { useState, useCallback, useRef } from 'react';
import type { LifeEvent } from './types';
import Header from './components/Header';
import LifeEventForm from './components/LifeEventForm';
import HappinessChart from './components/HappinessChart';
import EventList from './components/EventList';
import AnalysisModal from './components/AnalysisModal';
import { analyzeLifeGraph } from './services/geminiService';
import { generatePdf } from './services/pdfService';

const App: React.FC = () => {
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([
    { id: 1, age: 7, happiness: 8, description: '초등학교 입학, 새로운 친구들을 만났다!' },
    { id: 2, age: 9, happiness: 9, description: '처음으로 자전거 두 발로 타기 성공!' },
    { id: 3, age: 10, happiness: 5, description: '키우던 햄스터가 무지개 다리를 건넜다' },
    { id: 4, age: 12, happiness: 10, description: '가족들과 함께 떠난 신나는 캠핑 여행!' },
  ]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const eventsListRef = useRef<HTMLDivElement>(null);


  const addLifeEvent = useCallback((event: Omit<LifeEvent, 'id'>) => {
    setLifeEvents(prevEvents => {
      const newEvent = { ...event, id: Date.now() };
      const sortedEvents = [...prevEvents, newEvent].sort((a, b) => a.age - b.age);
      return sortedEvents;
    });
  }, []);
  
  const deleteLifeEvent = useCallback((id: number) => {
    setLifeEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  }, []);

  const handleAnalysis = async () => {
    if (lifeEvents.length < 3) {
      setError('분석을 위해 최소 3개 이상의 인생 이벤트를 입력해주세요.');
      return;
    }
    setError('');
    setIsLoading(true);
    setIsModalOpen(true);
    try {
      const result = await analyzeLifeGraph(lifeEvents);
      setAnalysis(result);
    // FIX: Corrected `catch` syntax from `catch (err) => {` to `catch (err) {`.
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setAnalysis('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = async (name: string) => {
    if (!chartContainerRef.current || !analysis) return;
    setIsPdfLoading(true);
    try {
      await generatePdf(name, analysis, lifeEvents, chartContainerRef.current);
    } catch (err) {
      console.error("PDF 생성 실패:", err);
      // You could set an error state here to show in the modal
    } finally {
      setIsPdfLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysis('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-pink-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <LifeEventForm onAddEvent={addLifeEvent} />
            <div ref={eventsListRef}>
              <EventList events={lifeEvents} onDeleteEvent={deleteLifeEvent} />
            </div>
          </div>
          <div ref={chartContainerRef} className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 text-center">나의 인생 행복 그래프</h2>
            <HappinessChart data={lifeEvents} />
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'AI 분석 중...' : 'AI로 내 인생 분석하기'}
              </button>
              {error && !isModalOpen && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </main>
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isLoading={isLoading}
        isPdfLoading={isPdfLoading}
        analysis={analysis}
        error={error}
        onExport={handleExportPdf}
      />
    </div>
  );
};

export default App;
