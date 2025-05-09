export const formatDateTime = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  const d = new Date(date);
  
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
