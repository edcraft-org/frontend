import { basePath } from "./Constants";
import { GenerateQuestionResponse } from "./QuestionAPI";

export type Topic = string;
export type Subtopic = string;
export type Queryable = string;
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
  selectedSubclasses: { [key: string]: string };
  selectedQuantifiables: { [key: string]: string };
  arguments: { [key: string]: any };
  argumentsInit?: { [key: string]: { [arg: string]: any } };
  userAlgoCode?: string;
  userEnvCode?: string;

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
  arguments: { [key: string]: any };
  question_description: string;
  userAlgoCode?: string;
}

export interface UserQueryableRequest {
  userAlgoCode: string;
}

export const getTopics = async (): Promise<Topic[]> => {
  const url = `${basePath}/question_generation/topics`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  const data: Topic[] = await response.json();
  return data;
};

export const getSubtopics = async (topic: string): Promise<Subtopic[]> => {
  const url = `${basePath}/question_generation/topics/${topic}/subtopics`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Subtopic[] = await response.json();
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

export const getUserQueryables = async (userAlgoCode: string): Promise<Queryable[]> => {
  const url = `${basePath}/question_generation/user/queryables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAlgoCode }),
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

// export const getQueryableVariables = async (topic: string, subtopic: string, queryable: string): Promise<VariablesResponse> => {
//   const url = `${basePath}/question_generation/topics/${topic}/subtopics/${subtopic}/queryables/${queryable}/variables`;
//   const response = await fetch(url);

//   if (!response.ok) {
//     const message = `An error has occurred: ${response.status}`;
//     throw new Error(message);
//   }

//   const data: VariablesResponse = await response.json();
//   return data;
// };

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

export const getUserAlgoVariables = async (userAlgoCode: string): Promise<Variable> => {
  const url = `${basePath}/question_generation/user/algoVariables`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAlgoCode }),
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

export const generateVariable = async (request: GenerateVariableRequest): Promise<any> => {
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
