import { basePath } from "./Constants";

interface SVGContent {
  graph?: string;
  table?: string;
}

export interface SubQuestion {
  description: string;
  options: string[];
  answer: string;
  marks: number;
  svg?: SVGContent;
}

export interface Question {
  _id: string;
  user_id: string;
  description: string;
  svg?: SVGContent;
  subquestions?: SubQuestion[];
}

export interface NewQuestion {
  user_id: string;
  description: string;
  svg?: SVGContent;
  subquestions?: SubQuestion[];
}

export interface QuestionCreationItem {
  question: string;
  answer: string;
  options: string[];
  marks: number;
  svg?: SVGContent;
}

export interface GenerateQuestionResponse {
  description: string;
  svg?: SVGContent;
  subquestions?: SubQuestion[];
}

export const createQuestion = async (newQuestion: NewQuestion): Promise<Question> => {
  const url = `${basePath}/questions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestion),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const question: Question = await response.json();
  return question;
};

export const getQuestionById = async (questionId: string): Promise<Question> => {
  const url = `${basePath}/questions/${questionId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Question = await response.json();
  return data;
};

export const deleteQuestion = async (questionId: string): Promise<string> => {
  const url = `${basePath}/questions/${questionId}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const result: string = await response.json();
  return result;
};