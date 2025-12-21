import React from 'react';
import NoteEntity from '../../../domain/note/noteEntity';

type TimeData = number[];

type Config = {
  numColumns: number,
  maxHeight: number,
  tailWindsHeightSteps: number[],
  tailwindOpacitySteps: number[]
}

const CONFIG: Config = {
  numColumns: 12,
  maxHeight: 100,
  // Các bước chiều cao hợp lệ trong Tailwind (ví dụ: 5, 10, 15... 100)
  tailWindsHeightSteps: Array.from({ length: 20 }, (_, i) => (i + 1) * 5),
  // Các bước opacity hợp lệ (ví dụ: 10, 20, 30... 90)
  tailwindOpacitySteps: Array.from({ length: 9 }, (_, i) => (i + 1) * 10),
};

/**
 * Tìm giá trị gần nhất trong một mảng bước (step array).
 */
const findNearestStep = (value: number, steps: number[]): number => {
  return steps.reduce((prev, curr) =>
    (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
  );
};


/**
 * Tạo chuỗi HTML cho visualization bar từ dữ liệu chỉ có thời gian.
 * Chiều cao cột được xác định dựa trên Mật độ sự kiện (Tần suất) trong mỗi slice.
 * * @param eventTimes Mảng các thời điểm xảy ra sự kiện (ví dụ: thời gian nhấn nốt)
 * @returns Chuỗi HTML visualization bar
 */
function createVisualizationBarFromTimeOnly(eventTimes: TimeData, config: Config): React.ReactElement {
  if (eventTimes.length === 0) {
    return <></>;
  }

  // --- I. Chuẩn bị Dữ liệu ---

  // 1. Tính tổng thời lượng
  const minTime = Math.min(...eventTimes);
  const maxTime = Math.max(...eventTimes);
  const totalDuration = maxTime - minTime;

  if (totalDuration <= 0) {
    // Trường hợp chỉ có 1 sự kiện hoặc thời gian không hợp lệ.
    // Có thể gán đều 1 giá trị cơ bản cho tất cả các cột nếu cần.
    const defaultHeight = findNearestStep(30, config.tailWindsHeightSteps);
    const defaultOpacity = findNearestStep(defaultHeight, config.tailwindOpacitySteps);
    return <div className='w-full h-full flex items-end gap-[2px] opacity-60 group-hover:opacity-100 transition-opacity' data-alt='Default visualization'>
      {Array.from({length: config.numColumns}).map((num, index) => (<div key={index} className={`w-1/12 bg-indigo-500/${defaultOpacity} h-[${defaultHeight}%] rounded-t-sm`}></div>))}
    </div>;
  }

  // Chia tổng thời lượng thành các khoảng (slice) bằng nhau
  const sliceDuration = totalDuration / config.numColumns;

  // Khởi tạo mảng số lần xuất hiện (Count) cho mỗi cột
  const sliceCounts: number[] = new Array(config.numColumns).fill(0);

  // 2. Tính Tần suất (Count) cho mỗi Khoảng
  for (const time of eventTimes) {
    // Tìm index của slice mà sự kiện này thuộc về
    let sliceIndex = Math.floor((time - minTime) / sliceDuration);

    // Đảm bảo index nằm trong phạm vi [0, numColumns - 1]
    sliceIndex = Math.min(sliceIndex, config.numColumns - 1);

    sliceCounts[sliceIndex] += 1; // Tăng đếm số sự kiện trong slice này
  }

  // --- II. Xử lý và Chuẩn hóa Dữ liệu ---

  const maxCount = Math.max(...sliceCounts);

  if (maxCount === 0) {
    return <></>;
  }

  let finalHtmlContent: React.ReactElement[] = [];

  // 3. Chuẩn hóa Chiều cao và Độ sáng
  for (let i = 0; i < config.numColumns; i++) {
    const rawCount = sliceCounts[i];

    // Chuẩn hóa thành tỉ lệ phần trăm (0 - 100)
    // Chiều cao tỉ lệ với mật độ sự kiện
    const heightPercentage = (rawCount / maxCount) * config.maxHeight;

    // Làm tròn chiều cao về bước Tailwind gần nhất (ví dụ: 20, 25, 30...)
    const finalHeight = findNearestStep(heightPercentage, config.tailWindsHeightSteps);

    // Opacity tỉ lệ với chiều cao
    const rawOpacity = finalHeight;
    const finalOpacity = findNearestStep(rawOpacity, config.tailwindOpacitySteps);

    // Đảm bảo Opacity tối thiểu là 10 để cột hiển thị được
    const displayOpacity = Math.max(finalOpacity, 10);

    // Tạo HTML cho cột
    finalHtmlContent.push(<div className={`w-1/12 bg-indigo-500/${displayOpacity} h-[${finalHeight}%] rounded-t-sm`}></div>);
  }

  // --- III. Tạo Chuỗi HTML Cuối cùng ---

  const finalHtml = <div className='w-full h-full flex items-end gap-[2px] opacity-60 group-hover:opacity-100 transition-opacity'>
    {finalHtmlContent.map((html, index) => <React.Fragment key={index}>{html}</React.Fragment>)}
  </div>;

  return finalHtml;
}

const VisualizationBar = ({ notes }: { notes: NoteEntity[] }) => {
  const times = notes.map(note => note.time);
  const htmlString = createVisualizationBarFromTimeOnly(times, CONFIG);
  return <>{htmlString}</>
}

export default VisualizationBar