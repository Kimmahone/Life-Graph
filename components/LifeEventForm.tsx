
import React, { useState } from 'react';

interface LifeEventFormProps {
  onAddEvent: (event: { age: number; happiness: number; description: string; imageUrl?: string }) => void;
}

const LifeEventForm: React.FC<LifeEventFormProps> = ({ onAddEvent }) => {
  const [age, setAge] = useState<string>('');
  const [happiness, setHappiness] = useState<number>(5);
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('유효한 나이를 입력해주세요 (1-120).');
      return;
    }
    if (description.trim() === '') {
      setError('어떤 일이 있었는지 설명해주세요.');
      return;
    }
    setError('');
    onAddEvent({ age: ageNum, happiness, description, imageUrl });
    setAge('');
    setHappiness(5);
    setDescription('');
    setImageUrl(undefined);
    setImagePreview(undefined);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">인생 기록하기</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-600">나이</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="예: 10"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="happiness" className="block text-sm font-medium text-slate-600">
            행복 점수: <span className="font-bold text-orange-600">{happiness}</span>
          </label>
          <input
            type="range"
            id="happiness"
            min="1"
            max="10"
            value={happiness}
            onChange={(e) => setHappiness(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
           <div className="flex justify-between text-xs text-slate-500">
            <span>조금 속상해</span>
            <span>그럭저럭</span>
            <span>최고로 행복해!</span>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600">어떤 일이 있었나요?</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 처음으로 햄스터를 키웠어요"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-slate-600">사진 첨부 (선택)</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100"
          />
          {imagePreview && <img src={imagePreview} alt="미리보기" className="mt-2 rounded-lg w-24 h-24 object-cover"/>}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          기록 추가하기
        </button>
      </form>
    </div>
  );
};

export default LifeEventForm;
