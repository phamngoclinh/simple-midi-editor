export const gridStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%', // Kéo dài hết chiều rộng
  pointerEvents: 'none', // Cho phép click xuyên qua để tương tác với Notes
  backgroundColor: '#f8f8f8',
};

export const horizontalLineStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  borderBottomStyle: 'solid',
  borderBottomWidth: 1,
  transform: 'translateY(-0.5px)', // Căn giữa đường kẻ
};

export const verticalLineStyle: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
  borderLeftStyle: 'solid',
  borderLeftWidth: 1,
  transform: 'translateX(-1px)',
};