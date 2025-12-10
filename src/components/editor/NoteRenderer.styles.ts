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
  width: NOTE_SIZE_PX,
  height: NOTE_SIZE_PX,
  borderRadius: '50%', // Hình tròn
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'transform 0.1s',
};