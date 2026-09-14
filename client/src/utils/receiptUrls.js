export const resolveReceiptUrl = (receiptUrl) => {
  if (!receiptUrl || receiptUrl.startsWith('http')) return receiptUrl;
  const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
  const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
  return `${apiOrigin}${receiptUrl}`;
};