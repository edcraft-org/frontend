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

export const convertArgumentValue = (type: string, value: unknown): unknown => {
  switch (type) {
    case 'int':
      return parseInt(value as string, 10);
    case 'float':
      return parseFloat(value as string);
    case 'bool':
      return value === 'true';
    default:
      try {
        return JSON.parse(value as string);
      } catch (e) {
        console.error('Error parsing value:', e);
        return value;
      }
  }
};

export const numberToAlphabet = (num: number): string => {
  return String.fromCharCode(65 + num); // 65 is the ASCII code for 'A'
};

export const formatValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  return String(value);
};

export const convertArguments = (
  variableArguments: { [key: string]: { [arg: string]: unknown } },
  algoVariables: Variable,
  selectedSubclasses: { [key: string]: string }
): { [key: string]: { [arg: string]: unknown } } => {
  return Object.keys(variableArguments).reduce((acc, variableName) => {
    const variable = algoVariables.find(v => v.name === variableName);
    if (variable) {
      acc[variableName] = Object.keys(variableArguments[variableName]).reduce((argAcc, argName) => {
        const arg = variable.arguments?.find(a => a.name === argName) || variable.subclasses?.find(s => s.name === selectedSubclasses[variableName])?.arguments.find(a => a.name === argName);
        if (arg) {
          argAcc[argName] = convertArgumentValue(arg.type, variableArguments[variableName][argName]);
        }
        return argAcc;
      }, {} as { [key: string]: unknown });
    }
    return acc;
  }, {} as { [key: string]: { [arg: string]: unknown } });
};

export const convertInputArguments = (
  inputVariableArguments: { [key: string]: { [arg: string]: unknown } },
  inputVariables: Variable
): { [key: string]: { [arg: string]: unknown } } => {
  return Object.keys(inputVariableArguments).reduce((acc, variableName) => {
    acc[variableName] = Object.keys(inputVariableArguments[variableName]).reduce((argAcc, argName) => {
      const argType = inputVariables.find(v => v.name === variableName)?.arguments?.find(a => a.name === argName)?.type;
      if (argType) {
        argAcc[argName] = convertArgumentValue(argType, inputVariableArguments[variableName][argName]);
      }
      return argAcc;
    }, {} as { [key: string]: unknown });
    return acc;
  }, {} as { [key: string]: { [arg: string]: unknown } });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatIdToNestedObject = (id: string):  { [key: string]: any } => {
  const parts = id.split('__');
  const lastPart = parts.pop();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parts.reduceRight((acc, part) => ({ [part]: acc }), lastPart as any);
};
