
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LifeEvent } from '../types';

// Helper to render markdown-like text to HTML for the PDF with inline styles
const renderMarkdownForPdf = (content: string): string => {
  return content
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: #334155;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.6em; color: #ef4444;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 2em; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.8em; color: #f97316;">$1</h1>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li style="margin-left: 1.5em; list-style-type: disc;">$1</li>')
    .replace(/\n/g, '<br />');
};

const renderEventsForPdf = (events: LifeEvent[]): string => {
    let eventsHtml = '<div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 40px;">';
    eventsHtml += '<h2 style="font-size: 1.8em; font-weight: 700; color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-bottom: 20px;">나의 인생 기록</h2>';
    eventsHtml += '<div>';

    events.forEach(event => {
        eventsHtml += `
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 16px;">
                ${event.imageUrl ? `<img src="${event.imageUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px;" />` : ''}
                <div style="flex: 1;">
                    <p style="font-size: 1.2em; font-weight: 700; color: #f97316;">${event.age}세</p>
                    <p style="font-size: 1em; color: #334155; margin-top: 4px;">${event.description}</p>
                    <p style="font-size: 0.9em; color: #64748b; margin-top: 2px;">행복 점수: ${event.happiness}/10</p>
                </div>
            </div>
        `;
    });

    eventsHtml += '</div></div>';
    return eventsHtml;
}

export const generatePdf = async (
  name: string,
  analysis: string,
  events: LifeEvent[],
  chartContainerElement: HTMLElement | null
) => {
  if (!chartContainerElement) {
    console.error("PDF 생성을 위한 차트 컨테이너 요소를 찾을 수 없습니다.");
    alert("PDF 생성 중 오류가 발생했습니다: 차트 요소를 찾을 수 없습니다.");
    return;
  }

  // 1. Create a temporary container for rendering PDF content
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.top = '0';
  pdfContainer.style.width = '800px';
  pdfContainer.style.padding = '40px';
  pdfContainer.style.backgroundColor = 'white';
  pdfContainer.style.fontFamily = 'sans-serif';
  pdfContainer.style.color = '#334155';
  
  document.body.appendChild(pdfContainer);

  // 2. Prepare content to be rendered in the container
  const title = `<h1 style="font-size: 2.5em; font-weight: 800; text-align: center; color: #f97316;">${name}의 인생 행복 그래프</h1>`;
  const date = `<p style="font-size: 1em; text-align: center; color: #64748b; margin-top: 8px;">분석일: ${new Date().toLocaleDateString('ko-KR')}</p>`;
  
  const chartCanvas = await html2canvas(chartContainerElement, { 
    scale: 2,
    backgroundColor: '#ffffff'
  });
  const chartImgDataUrl = chartCanvas.toDataURL('image/png');
  
  const eventsHtml = renderEventsForPdf(events);

  const analysisHtml = `
      <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 40px; page-break-before: auto;">
          <h2 style="font-size: 1.8em; font-weight: 700; color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-bottom: 20px;">AI 인생 분석 결과</h2>
          <div style="line-height: 1.7; font-size: 1em; text-align: justify;">${renderMarkdownForPdf(analysis)}</div>
      </div>
  `;

  pdfContainer.innerHTML = `
      <div style="margin-bottom: 40px;">${title}${date}</div>
      <img src="${chartImgDataUrl}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
      ${eventsHtml}
      ${analysisHtml}
  `;
  
  // 3. Generate PDF from the populated container
  const pdfCanvas = await html2canvas(pdfContainer, { scale: 2 });
  const imgData = pdfCanvas.toDataURL('image/png');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = pdfCanvas.width;
  const canvasHeight = pdfCanvas.height;
  const ratio = canvasWidth / canvasHeight;
  const imgHeight = pdfWidth / ratio;
  
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${name}_인생_행복_그래프.pdf`);

  // 4. Cleanup
  document.body.removeChild(pdfContainer);
};
