import { basePath } from "./Constants";

export interface Question {
  _id: string;
  text: string;
  options: string[];
  answer: string;
  user_id: string;
}

interface NewQuestion {
  text: string;
  options: string[];
  answer: string;
  user_id: string;
}

export const createQuestion = async (newQuestion: NewQuestion): Promise<string> => {
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

  const questionId: string = await response.text();
  return questionId;
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
