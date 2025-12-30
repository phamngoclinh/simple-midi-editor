export const DEFAULT_COLORS = ['#135bec', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'];

export const mixColors = (colorArray: string[]) => {
  let r = 0,
    g = 0,
    b = 0;
  const len = colorArray.length;

  colorArray.forEach(hex => {
    // Chuyển Hex sang RGB
    const rgb = hexToRgb(hex);
    r += rgb.r;
    g += rgb.g;
    b += rgb.b;
  });

  // Tính trung bình cộng và chuyển ngược về Hex
  return rgbToHex(Math.round(r / len), Math.round(g / len), Math.round(b / len));
};

// Hàm hỗ trợ chuyển đổi Hex sang RGB
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Hàm hỗ trợ chuyển đổi RGB sang Hex
export const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};
