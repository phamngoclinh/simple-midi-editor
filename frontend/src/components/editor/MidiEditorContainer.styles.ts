import { PRIMARY_GRID_COLOR } from "./constants";

export const RULER_WIDTH_PX = 40;
export const HEADER_HEIGHT_PX = 50;


export const containerStyle: React.CSSProperties = {
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  height: '80vh',
};

export const headerRulerWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexShrink: 0,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: '#fff',
};

export const cornerBlockStyle: React.CSSProperties = {
  width: RULER_WIDTH_PX,
  height: HEADER_HEIGHT_PX,
  backgroundColor: '#e9ecef',
  borderBottom: `1px solid ${PRIMARY_GRID_COLOR}`,
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  flexShrink: 0,
};

export const editorWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  position: 'relative',
};

export const scrollAreaContentStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100%',
  minWidth: '100%',
};