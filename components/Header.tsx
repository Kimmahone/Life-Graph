
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
          나의 인생 행복 그래프
        </h1>
        <p className="text-center text-slate-500 mt-1">당신의 반짝이는 순간들을 그려보세요 ✨</p>
      </div>
    </header>
  );
};

export default Header;
