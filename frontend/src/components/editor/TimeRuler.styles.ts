import { PRIMARY_GRID_COLOR } from "./constants";

export const RULER_WIDTH_PX = 40;

export const rulerStyle: React.CSSProperties = {
  position: 'relative',
  left: 0,
  minHeight: '100%',
  backgroundColor: '#e9ecef',
  zIndex: 50,
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  boxSizing: 'content-box',
  flexShrink: 0
};

export const labelStyle: React.CSSProperties = {
  position: 'absolute',
  right: 5,
  transform: 'translateY(-50%)',
  fontSize: '12px',
  color: PRIMARY_GRID_COLOR,
  fontWeight: 'bold',
  paddingLeft: '5px',
  height: '20px',
  lineHeight: '20px',
  textAlign: 'right',
  width: RULER_WIDTH_PX - 5,
};