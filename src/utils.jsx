// 热度单位转换
export const formatHot = (value) => {
  if (!value) return "N/A";
  if (value >= 1000000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value;
};
