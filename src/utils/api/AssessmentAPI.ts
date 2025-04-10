import { basePath } from "./Constants";
import { Question } from "./QuestionAPI";

export interface NewAssessment {
  title: string;
  questions: string[];
  user_id: string;
  project_id: string;
}

export interface Assessment {
  _id: string;
  questions: Question[];
  title: string;
  user_id: string;
  project_id: string;
}

export interface AssessmentList {
  _id: string;
  questions: string[];
  title: string;
  user_id: string;
  project_id: string;
}

export interface AssessmentTitleUpdate {
  title: string;
}

export const createAssessment = async (newAssessment: NewAssessment): Promise<Assessment> => {
  const url = `${basePath}/assessments`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAssessment),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const assessment: Assessment = await response.json();
  return assessment;
};

export const getUserAssessments = async (userId: string): Promise<AssessmentList[]> => {
  const url = `${basePath}/assessments?user_id=${userId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: AssessmentList[] = await response.json();
  return data;
};

export const getUserProjectAssessments = async (userId: string, projectId: string): Promise<AssessmentList[]> => {
  const url = `${basePath}/assessments?user_id=${userId}&project_id=${projectId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: AssessmentList[] = await response.json();
  return data;
};

export const getAssessmentById = async (assessmentId: string): Promise<Assessment> => {
  const url = `${basePath}/assessments/${assessmentId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Assessment = await response.json();
  return data;
};

export const addExistingQuestionToAssessment = async (assessmentId: string, questionId: string): Promise<string> => {
  const url = `${basePath}/assessments/${assessmentId}/questions`;
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

export const removeQuestionFromAssessment = async (assessmentId: string, questionId: string): Promise<string> => {
  const url = `${basePath}/assessments/${assessmentId}/questions/${questionId}`;
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

export const deleteAssessment = async (assessmentId: string): Promise<string> => {
  const url = `${basePath}/assessments/${assessmentId}`;
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

export const renameAssessmentTitle = async (assessmentId: string, titleUpdate: AssessmentTitleUpdate): Promise<Assessment> => {
  const url = `${basePath}/assessments/${assessmentId}/title`;
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

  const updatedAssessment: Assessment = await response.json();
  return updatedAssessment;
};
