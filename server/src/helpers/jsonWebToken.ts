import { Request } from "express";

export const getAuthToken = (req: Request) => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");

  if (parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
};
