import { v4 as uuidv4 } from "uuid";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const uuidGenerate = () => {
  return uuidv4();
};
