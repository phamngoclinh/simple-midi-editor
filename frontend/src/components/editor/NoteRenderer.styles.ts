export const rendererStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

export const noteStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'auto',
  borderRadius: '100%',
  opacity: 0.9,
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

export const contentStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export const iconSymbolStyle: React.CSSProperties = {
  fontSize: '1em',
  lineHeight: 1,
  textShadow: '0 0 2px rgba(0,0,0,0.5)',
};

export const titleStyle: React.CSSProperties = {
  fontSize: '0.8em',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.2,
};