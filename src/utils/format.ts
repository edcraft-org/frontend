// Formats a string by capitalizing the first letter of each word and replacing underscores with spaces.
export const formatText = (text: string): string => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };