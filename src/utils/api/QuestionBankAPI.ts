import { basePath } from "./Constants";
import { Question } from "./QuestionAPI";

export interface NewQuestionBank {
  questions: string[];
  title: string;
  user_id: string;
  project_id: string;
}

export interface QuestionBank {
  _id: string;
  questions: Question[];
  title: string;
  user_id: string;
  project_id: string;
}

export interface QuestionBankList {
    _id: string;
    questions: string[];
    title: string;
    user_id: string;
    project_id: string;
}

export const createQuestionBank = async (newQuestionBank: NewQuestionBank): Promise<QuestionBank> => {
  const url = `${basePath}/question_banks`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestionBank),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const questionBank: QuestionBank = await response.json();
  return questionBank;
};

export const getUserQuestionBanks = async (userId: string): Promise<QuestionBankList[]> => {
  const url = `${basePath}/question_banks?user_id=${userId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBankList[] = await response.json();
  return data;
};

export const getUserProjectQuestionBanks = async (userId: string, projectId: string): Promise<QuestionBankList[]> => {
  const url = `${basePath}/question_banks?user_id=${userId}&project_id=${projectId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBankList[] = await response.json();
  return data;
};

export const getQuestionBankById = async (questionBankId: string): Promise<QuestionBank> => {
  const url = `${basePath}/question_banks/${questionBankId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBank = await response.json();
  return data;
};

export const addExistingQuestionToQuestionBank = async (questionBankId: string, questionId: string): Promise<string> => {
  const url = `${basePath}/question_banks/${questionBankId}/questions`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question_id: questionId }),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const addedQuestionId: string = await response.json();
  return addedQuestionId;
};