import { Variable } from "./api/QuestionGenerationAPI";

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

export const convertArgumentValue = (type: string, value: any) => {
  switch (type) {
    case 'int':
      return parseInt(value, 10);
    case 'float':
      return parseFloat(value);
    case 'bool':
      return value === 'true';
    default:
      return JSON.parse(value);
  }
};

export const numberToAlphabet = (num: number): string => {
  return String.fromCharCode(65 + num); // 65 is the ASCII code for 'A'
};

export const formatValue = (value: any) => {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  return value;
};

export const convertArguments = (
  variableArguments: { [key: string]: { [arg: string]: any } },
  algoVariables: Variable,
  selectedSubclasses: { [key: string]: string }
): { [key: string]: { [arg: string]: any } } => {
  return Object.keys(variableArguments).reduce((acc, variableName) => {
    const variable = algoVariables.find(v => v.name === variableName);
    if (variable) {
      acc[variableName] = Object.keys(variableArguments[variableName]).reduce((argAcc, argName) => {
        const arg = variable.arguments?.find(a => a.name === argName) || variable.subclasses?.find(s => s.name === selectedSubclasses[variableName])?.arguments.find(a => a.name === argName);
        if (arg) {
          argAcc[argName] = convertArgumentValue(arg.type, variableArguments[variableName][argName]);
        }
        return argAcc;
      }, {} as { [key: string]: any });
    }
    return acc;
  }, {} as { [key: string]: { [arg: string]: any } });
};
