import { basePath } from "./Constants";

export interface NewProject {
  title: string;
  user_id: string;
}

export interface Project {
  _id: string;
  title: string;
  user_id: string;
}

export interface ProjectTitleUpdate {
  title: string;
}

export const createProject = async (newProject: NewProject): Promise<Project> => {
  const url = `${basePath}/projects`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProject),
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const project: Project = await response.json();
  return project;
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const url = `${basePath}/projects?user_id=${userId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Project[] = await response.json();
  return data;
};

export const getProjectById = async (projectId: string): Promise<Project> => {
  const url = `${basePath}/projects/${projectId}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  const data: Project = await response.json();
  return data;
};

export const deleteProject = async (projectId: string): Promise<string> => {
  const url = `${basePath}/projects/${projectId}`;
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

export const renameProjectTitle = async (projectId: string, titleUpdate: ProjectTitleUpdate): Promise<Project> => {
  const url = `${basePath}/projects/${projectId}/title`;
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

  const updatedProject: Project = await response.json();
  return updatedProject;
};