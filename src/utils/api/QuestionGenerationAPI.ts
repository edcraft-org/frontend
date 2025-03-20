import { basePath } from "./Constants";
import { GenerateQuestionResponse } from "./QuestionAPI";

export type Topic = string;
export type Subtopic = string;
export type Queryable = string;
export type VariableItem = {
  name: string;
  type: string;
  subclasses?: {
    name: string;
    arguments: { name: string; type: string }[];
  }[];
  arguments?: { name: string; type: string }[];
};
export type Variable = {
  name: string;
  type: string;
  subclasses?: {
    name: string;
    arguments: { name: string; type: string }[];
  }[];
  arguments?: { name: string; type: string }[];
}[];

export type Quantifiable = string;

export type ContextRequest = {
  selectedTopic: string;
  selectedSubtopic: string;
  inputPath: { [key: string]: unknown };
  selectedSubclasses: { [key: string]: string };
  selectedQuantifiables: { [key: string]: string };
  arguments: { [key: string]: unknown };
  inputArguments: { [key: string]: unknown };
  argumentsInit?: { [key: string]: { [arg: string]: unknown } };
  inputInit?: { [key: string]: { [arg: string]: unknown } };
  userAlgoCode?: string;
  userEnvCode?: string[];

}

export type QuestionDetails = {
  marks: number;
  number_of_options: number;
  // question_type: string;
}

export interface SubQuestion {
  description: string;
  queryable: string;
  context: ContextRequest;
  questionDetails: QuestionDetails;
  userQueryableCode?: string;
}

export interface GenerateQuestionRequest {
  description: string;
  context: ContextRequest;
  sub_questions?: SubQuestion[];
}

export interface GenerateVariableRequest {
  topic: string;
  subtopic: string;
  element_type: { [key: string]: string };
  subclasses: { [key: string]: string };
  arguments: { [key: string]: unknown };
  arguments_init?: { [key: string]: { [arg: string]: unknown } };
  question_description: string;
  userAlgoCode?: string;
  userEnvCode?: string[];
}

export interface UserQueryableRequest {
  userAlgoCode: string;
}

export interface InputRequest {
  input_path: { [key: string]: unknown };
}

export interface GenerateInputRequest {
  input_path: { [key: string]: unknown };
  variable_options: { [key: string]: { [arg: string]: unknown } };
  input_init?: { [key: string]: { [arg: string]: unknown } };
  user_env_code?: string;
  element_type: { [key: string]: string };
}

export interface VariableResponse {
  context: { [key: string]: unknown };
  context_init: { [key: string]: { [arg: string]: unknown } };
  cls_name?: string;
}

export interface OutputResponse {
  output_init: { [key: string]: { [arg: string]: unknown } };
  output_path: { [key: string]: unknown };
  context: { [key: string]: unknown };
  user_env_code?: string;
}
export type ClassKeyData = { [key: string]: string | ClassKeyData };

export const listAlgos = async (): Promise<ClassKeyData> => {
  const url = `${basePath}/question_generation/algos`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: ClassKeyData = await response.json();
  return data;
};

export const listInputs = async (): Promise<ClassKeyData> => {
  const url = `${basePath}/question_generation/input`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: ClassKeyData = await response.json();
  return data;
};

export const listInputVariable = async (request: InputRequest): Promise<Variable> => {
  const url = `${basePath}/question_generation/input`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getQueryables = async (topic: string, subtopic: string): Promise<Queryable[]> => {
  const url = `${basePath}/question_generation/topics/${topic}/subtopics/${subtopic}/queryables`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Queryable[] = await response.json();
  return data;
};

export const getUserQueryables = async (userAlgoCode: string, userEnvCode?: string[]): Promise<Queryable[]> => {
  const url = `${basePath}/question_generation/user/queryables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAlgoCode, userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Queryable[] = await response.json();
  return data;
};

export const getInputQueryables = async (request: InputRequest): Promise<string[]> => {
  const url = `${basePath}/question_generation/input/queryables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: string[] = await response.json();
  return data;
};

export const getUserInputQueryables = async (userEnvCode: string): Promise<Queryable[]> => {
  const url = `${basePath}/question_generation/user/input/queryables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Queryable[] = await response.json();
  return data;
};

export const getAllQueryables = async (): Promise<Queryable[]> => {
  const url = `${basePath}/question_generation/queryable_classes`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Queryable[] = await response.json();
  return data;
};


export const getAlgoVariables = async (topic: string, subtopic: string): Promise<Variable> => {
  const url = `${basePath}/question_generation/topics/${topic}/subtopics/${subtopic}/variables`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getUserAlgoVariables = async (userAlgoCode: string, userEnvCode?: string[]): Promise<Variable> => {
  const url = `${basePath}/question_generation/user/algoVariables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAlgoCode, userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getUserInputVariables = async (userEnvCode: string): Promise<Variable> => {
  const url = `${basePath}/question_generation/user/inputVariables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getQueryableVariables = async (topic: string, subtopic: string, queryable: string): Promise<Variable> => {
  const url = `${basePath}/question_generation/topics/${topic}/subtopics/${subtopic}/queryables/${queryable}/variables`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getUserQueryableVariables = async (
  queryable: string,
  userAlgoCode: string,
  userEnvCode?: string[]
): Promise<Variable> => {
  const url = `${basePath}/question_generation/user/queryables/${queryable}/variables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAlgoCode, userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getInputQueryableVariables = async (inputPath: { [key: string]: unknown }, queryable: string): Promise<Variable> => {
  const url = `${basePath}/question_generation/input/queryables/${queryable}/variables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input_path: inputPath }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getUserInputQueryableVariables = async (
  queryable: string,
  userEnvCode: string
): Promise<Variable> => {
  const url = `${basePath}/question_generation/user/input/queryables/${queryable}/variables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEnvCode }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Variable = await response.json();
  return data;
};

export const getQuantifiables = async (): Promise<Quantifiable[]> => {
  const url = `${basePath}/question_generation/quantifiables`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Quantifiable[] = await response.json();
  return data.sort();
};

export const generateQuestion = async (request: GenerateQuestionRequest): Promise<GenerateQuestionResponse> => {
  const url = `${basePath}/question_generation/generate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: GenerateQuestionResponse = await response.json();
  return data;
};

export const generateVariable = async (request: GenerateVariableRequest): Promise<VariableResponse> => {
  const url = `${basePath}/question_generation/generate_variable`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
};

export const generateInput = async (request: GenerateInputRequest): Promise<VariableResponse> => {
  const url = `${basePath}/question_generation/generate_input`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data;
};

export const generateOutput = async (request: GenerateVariableRequest): Promise<OutputResponse> => {
  const url = `${basePath}/question_generation/generate_output`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: OutputResponse = await response.json();
  return data;
};
