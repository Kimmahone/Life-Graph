
import { GoogleGenAI } from "@google/genai";
import type { LifeEvent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function formatEventsForPrompt(events: LifeEvent[]): string {
  return events
    .map(e => `나이: ${e.age}, 행복 점수: ${e.happiness}/10, 사건: ${e.description}`)
    .join('\n');
}

export async function analyzeLifeGraph(events: LifeEvent[]): Promise<string> {
  const model = 'gemini-2.5-flash';
  
  const formattedEvents = formatEventsForPrompt(events);

  const prompt = `
    당신은 따뜻하고 통찰력 있는 라이프 코치입니다. 다음은 한 사람의 인생 여정을 나타내는 데이터입니다. 각 항목은 특정 나이의 행복 점수(1점은 매우 불행, 10점은 매우 행복)와 관련 사건을 포함합니다.

    [인생 데이터]
    ${formattedEvents}

    [요청]
    위 데이터를 바탕으로, 이 사람의 인생 여정에 대한 긍정적이고 격려가 되는 종합 분석을 한국어로 작성해주세요. 다음 지침을 따라주세요:
    1.  전체적인 삶의 궤적을 부드럽게 요약하며 시작하세요.
    2.  행복 점수가 높았던 시기를 '성장의 순간' 또는 '행복의 절정'으로 묘사하며 그 의미를 조명해주세요.
    3.  행복 점수가 낮았던 시기는 '도전과 배움의 시기'로 표현하며, 어려움을 극복하며 얻었을 내면의 힘과 회복탄력성을 칭찬해주세요.
    4.  인생의 변곡점이나 중요한 변화가 있었던 지점을 짚어주세요.
    5.  따뜻하고 희망적인 메시지로 마무리하며, 앞으로의 삶에 대한 격려를 담아주세요.
    6.  분석은 마크다운 형식을 사용하여 가독성을 높여주세요. (예: 제목, 목록)
    `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API 호출 중 오류 발생:", error);
    throw new Error("AI 분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
}
