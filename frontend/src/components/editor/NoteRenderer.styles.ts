export const NOTE_SIZE_PX = 20; // Kích thước (đường kính) của chấm tròn Note

export const rendererStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

export const noteStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'auto', // Bắt sự kiện click trên Note
  borderRadius: '100%',
  width: NOTE_SIZE_PX,
  height: NOTE_SIZE_PX,
  opacity: 0.9,
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  // Giả định cần một border nhỏ hơn
  // border: '1px solid',
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
  fontSize: '1.5em', // Icon lớn hơn để dễ nhìn
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