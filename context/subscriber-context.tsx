import { createContext, PropsWithChildren, useContext, useRef } from "react";

type Callback = (...params: any[]) => void;

export type SubscriberContextType = {
  addListener: (key: string, cb: Callback) => void;
  clearListener: (key: string) => void;
  broadcast: (key: string, ...params: any[]) => void;
  removeListener: (key: string, cb: Callback) => void;
};

const SubscriberContext = createContext({} as SubscriberContextType);

export const useSubscriberContext = () => useContext(SubscriberContext);
export const SubscriberContextProvider = ({ children }: PropsWithChildren) => {
  const callBackRefs = useRef<Record<string, Set<Function>>>({});
  const addListener = (key: string, cb: Function) => {
    if (callBackRefs.current[key]) {
      callBackRefs.current[key].add(cb);
    } else {
      callBackRefs.current[key] = new Set([cb]);
    }
  };
  const clearListener = (key: string) => {
    callBackRefs.current[key] = new Set();
  };
  const broadcast = (key: string, ...params: any) => {
    if (callBackRefs.current[key]) {
      callBackRefs.current[key].forEach((item) => item(...params));
    }
  };
  const removeListener: SubscriberContextType["removeListener"] = (key, cb) => {
    callBackRefs.current[key]?.delete(cb);
  };
  return (
    <SubscriberContext.Provider
      value={{
        addListener,
        clearListener,
        broadcast,
        removeListener,
      }}
    >
      {children}
    </SubscriberContext.Provider>
  );
};
