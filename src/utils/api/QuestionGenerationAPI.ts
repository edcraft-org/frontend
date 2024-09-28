import { basePath } from "./Constants";

export type Topic = string;
export type Subtopic = string;

export interface Queryable {
  queryable: string;
  variables: string[];
  outputType: string;
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
