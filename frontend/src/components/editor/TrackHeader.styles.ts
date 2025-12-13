import { PRIMARY_GRID_COLOR } from "./constants";

export const HEADER_HEIGHT_PX = 50;

export const labelWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  padding: '0 5px',
};

export const labelStyle: React.CSSProperties = {
  maxWidth: '90%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const inputStyle: React.CSSProperties = {
  width: '90%',
  padding: '3px 5px',
  fontSize: '0.9em',
  textAlign: 'center',
  border: '1px solid #007bff',
  borderRadius: '3px',
  boxSizing: 'border-box',
  color: 'black',
  height: '80%',
};

export const headerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexShrink: 0,
  height: HEADER_HEIGHT_PX,
  backgroundColor: '#f1f3f5',
  borderBottom: `1px solid ${PRIMARY_GRID_COLOR}`,
  position: 'relative',
};

export const trackHeaderItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 0',
  boxSizing: 'border-box',
  borderRight: `1px solid ${PRIMARY_GRID_COLOR}`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const orderStyle: React.CSSProperties = {
  fontSize: '0.7em',
  color: '#666',
  marginTop: '2px',
};