import { basePath } from "./Constants";

export interface NewUserAlgorithm {
  user_id: string;
  topic: string;
  subtopic: string;
  processor_class_code: string;
}

export interface UserAlgorithm {
  _id: string;
  user_id: string;
  topic: string;
  subtopic: string;
  processor_class_code: string;
}

export interface UserAlgorithmUpdate {
  topic?: string;
  subtopic?: string;
  processor_class_code?: string;
}

export const createUserAlgorithm = async (newAlgorithm: NewUserAlgorithm): Promise<UserAlgorithm> => {
  const url = `${basePath}/user_algorithms`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAlgorithm),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const algorithm: UserAlgorithm = await response.json();
  return algorithm;
};

export const getUserAlgorithms = async (userId: string): Promise<UserAlgorithm[]> => {
  const url = `${basePath}/user_algorithms/user/${userId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: UserAlgorithm[] = await response.json();
  return data;
};

export const getUserAlgorithmById = async (algorithmId: string): Promise<UserAlgorithm> => {
  const url = `${basePath}/user_algorithms/${algorithmId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: UserAlgorithm = await response.json();
  return data;
};

export const deleteUserAlgorithm = async (algorithmId: string): Promise<string> => {
  const url = `${basePath}/user_algorithms/${algorithmId}`;
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

export const updateUserAlgorithm = async (algorithmId: string, updateData: UserAlgorithmUpdate): Promise<UserAlgorithm> => {
  const url = `${basePath}/user_algorithms/${algorithmId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const updatedAlgorithm: UserAlgorithm = await response.json();
  return updatedAlgorithm;
};
