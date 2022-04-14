import React, { createContext } from "react";
import matches from "../data/matches.json";

export const GlobalContext = createContext({ matches: {} }); // you can set a default value inside createContext if you want

export default function GlobalContextProvider({ children }) {
  return (
    <GlobalContext.Provider value={{ matches }}>
      {children}
    </GlobalContext.Provider>
  );
}
