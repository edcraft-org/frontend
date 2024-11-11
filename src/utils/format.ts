// Formats a string by capitalizing the first letter of each word and replacing underscores with spaces.
export const formatText = (text: string): string => {
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

export const formatVariableType = (type: string): string => {
    if (type.startsWith("<class '")) {
      return type.slice(8, -2);
    } else if (type.startsWith("typing.")) {
      return type.slice(7);
    }
    return type;
  };
