const compareValues = (first, second, field) => {
  if (field === 'amount') return Number(first || 0) - Number(second || 0);
  if (field.endsWith('Date')) {
    return String(first || '').localeCompare(String(second || ''));
  }
  return String(first || '').localeCompare(String(second || ''), undefined, {
    sensitivity: 'base'
  });
};

export const sortRecords = (records, field, order = 'desc') => {
  if (!field) return records;

  return [...records].sort((first, second) => {
    const comparison = compareValues(first[field], second[field], field);
    return order === 'asc' ? comparison : -comparison;
  });
};