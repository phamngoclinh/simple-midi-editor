import { PRIMARY_GRID_COLOR } from "./constants";

export const RULER_WIDTH_PX = 40; // Chiều rộng cố định của TimeRuler (cần định nghĩa lại nếu dùng hằng số)
export const HEADER_HEIGHT_PX = 50; // Chiều cao cố định của TrackHeader

// --- Styles ---

export const containerStyle: React.CSSProperties = {
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  height: '80vh', // Chiều cao cố định
};

// Wrapper chứa Header và Ruler (ngăn không cho cuộn dọc)
export const headerRulerWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexShrink: 0,
  position: 'sticky', // Cố định Header ở trên cùng khi cuộn dọc
  top: 0,
  zIndex: 100,
  backgroundColor: '#fff',
};

export const cornerBlockStyle: React.CSSProperties = {
  width: RULER_WIDTH_PX, // Chiều rộng bằng Ruler
  height: HEADER_HEIGHT_PX, // Chiều cao bằng Header
  backgroundColor: '#e9ecef',
  borderBottom: `1px solid ${PRIMARY_GRID_COLOR}`,
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  flexShrink: 0,
};

export const editorWrapperStyle: React.CSSProperties = {
  display: 'flex', // Kích hoạt Flexbox
  flexGrow: 1,
  position: 'relative',
};

export const scrollAreaContentStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100%',
  minWidth: '100%', // Quan trọng để đảm bảo cuộn ngang khi Tracks vượt quá
};