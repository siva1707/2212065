import React, { createContext, useContext, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { getLogs, saveLogs } from "../utils/storage";

const LogContext = createContext(null);

export const LogProvider = ({ children }) => {
  const bufferRef = useRef([]);

  const commit = () => {
    const existing = getLogs();
    const merged = [...existing, ...bufferRef.current].slice(-2000); // cap logs
    saveLogs(merged);
    bufferRef.current = [];
  };

  const logger = useMemo(
    () => ({
      log: ({ level = "info", action, message, meta }) => {
        bufferRef.current.push({
          ts: dayjs().toISOString(),
          level,
          action,
          message,
          meta,
        });
        if (bufferRef.current.length >= 10) commit();
      },
      flush: commit,
      getAll: () => getLogs(),
      clear: () => saveLogs([]),
    }),

    []
  );

 
  React.useEffect(() => () => logger.flush(), [logger]);

  return <LogContext.Provider value={logger}>{children}</LogContext.Provider>;
};

export const useLogger = () => useContext(LogContext);
