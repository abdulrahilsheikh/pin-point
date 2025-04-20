export function debounce<T extends (...args: any[]) => void>(
  cb: T,
  timeout = 120
) {
  let timeoutId: any;
  const cancel = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const dbFunc = (...args: Parameters<T>) => {
    cancel();
    timeoutId = setTimeout(() => {
      cb.apply({ cancel: cancel }, args);
    }, timeout);
  };
  dbFunc.cancel = cancel;
  return dbFunc;
}

const readableColors = [
  "#FF6347", // Tomato
  "#4682B4", // SteelBlue
  "#32CD32", // LimeGreen
  "#FFD700", // Gold
  "#FF4500", // OrangeRed
  "#6A5ACD", // SlateBlue
  "#00CED1", // DarkTurquoise
  "#FF1493", // DeepPink
  "#00FA9A", // MediumSpringGreen
  "#FF8C00", // DarkOrange
  "#8A2BE2", // BlueViolet
  "#FF69B4", // HotPink
  "#ADFF2F", // GreenYellow
  "#40E0D0", // Turquoise
  "#FF7F50", // Coral
];

export const getRandomReadableColors = () => {
  return readableColors[Math.ceil(readableColors.length * Math.random())];
};
