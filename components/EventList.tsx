
import React from 'react';
import type { LifeEvent } from '../types';

interface EventListProps {
  events: LifeEvent[];
  onDeleteEvent: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onDeleteEvent }) => {
  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-xl text-center text-slate-500">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">나의 기록</h2>
        <p>아직 추가된 기록이 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">나의 기록</h2>
      <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-start gap-3">
            <div className="flex items-start gap-3">
                {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.description} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                )}
                <div>
                    <p className="font-bold text-orange-600">{event.age}세</p>
                    <p className="text-sm text-slate-600">{event.description}</p>
                </div>
            </div>
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label={`${event.description} 이벤트 삭제`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
