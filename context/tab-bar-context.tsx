import { createContext, PropsWithChildren, useContext, useState } from "react";

type ITabBarContext = { showHeader: boolean; toggleHeaderShown: () => void };
export const TabBarContext = createContext({} as ITabBarContext);
export const useTabBarContext = () => useContext(TabBarContext);
export const TabBarContextProvider = ({ children }: PropsWithChildren) => {
  const [showHeader, setShowHeader] = useState(true);
  const toggleHeaderShown = () => {
    setShowHeader(!showHeader);
  };
  return (
    <TabBarContext.Provider
      value={{
        showHeader,
        toggleHeaderShown,
      }}
    >
      {children}
    </TabBarContext.Provider>
  );
};
