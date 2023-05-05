import { createContext, useContext, useState } from "react";

export interface UserContextType {
  user_id: string;
  setUser_id: (userId: string) => void;
}

export const UserContext = createContext<UserContextType>({
  user_id: "",
  setUser_id: () => {},
});