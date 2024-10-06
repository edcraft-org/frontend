import { basePath } from "./Constants";
import { QuestionCreationItem } from "./QuestionAPI";

export type Topic = string;
export type Subtopic = string;

export interface Queryable {
  queryable: string;
  variables: string[];
  outputType: string;
}

export interface GenerateQuestionRequest {
  topic: string;
  subtopic: string;
  queryable: string;
  question_description: string;
  question_type: string;
  marks: number
  number_of_options: number;
  number_of_questions: number;
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

export const generateQuestion = async (request: GenerateQuestionRequest): Promise<QuestionCreationItem[]> => {
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

  const data: QuestionCreationItem[] = await response.json();
  return data;
};