import { binarySearchTreeTopic } from "./topics/BinarySearchTreeTopic";

export interface Topics {
    [key: string]: {
      [key: string]: {
        variables: string[];
        outputType: string;
      };
    };
  }
  
  export const topics: Topics = {
    ...binarySearchTreeTopic
    // Add more topics and their queryables and variables here
  };