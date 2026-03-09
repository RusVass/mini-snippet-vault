export const formatDate = (value: string): string => {
  const date = new Date(value);

  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const parseTagsInput = (value: string): string[] => {
  return value
    .split(',')
    .map((tag) => {
      return tag.trim();
    })
    .filter(Boolean);
};
