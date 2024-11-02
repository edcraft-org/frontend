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
  questions: string[];
  title: string;
  user_id: string;
  project_id: string;
}

export interface QuestionBankWithQuestions {
  _id: string;
  questions: string[];
  title: string;
  user_id: string;
  project_id: string;
  full_questions: Question[];
}

export interface QuestionBankTitleUpdate {
  title: string;
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

export const getUserQuestionBanks = async (userId: string): Promise<QuestionBank[]> => {
  const url = `${basePath}/question_banks?user_id=${userId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBank[] = await response.json();
  return data;
};

export const getUserProjectQuestionBanks = async (userId: string, projectId: string): Promise<QuestionBank[]> => {
  const url = `${basePath}/question_banks?user_id=${userId}&project_id=${projectId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBank[] = await response.json();
  return data;
};

export const getQuestionBankById = async (questionBankId: string): Promise<QuestionBankWithQuestions> => {
  const url = `${basePath}/question_banks/${questionBankId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: QuestionBankWithQuestions = await response.json();
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

export const removeQuestionFromQuestionBank = async (questionBankId: string, questionId: string): Promise<string> => {
  const url = `${basePath}/question_banks/${questionBankId}/questions/${questionId}`;
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

export const deleteQuestionBank = async (questionBankId: string): Promise<string> => {
  const url = `${basePath}/question_banks/${questionBankId}`;
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

export const renameQuestionBankTitle = async (questionBankId: string, titleUpdate: QuestionBankTitleUpdate): Promise<QuestionBank> => {
  const url = `${basePath}/question_banks/${questionBankId}/title`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(titleUpdate),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const updatedQuestionBank: QuestionBank = await response.json();
  return updatedQuestionBank;
};