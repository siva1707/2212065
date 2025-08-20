const LS_KEYS = {
  LINKS: "aff_short_links",
  LOGS: "aff_logs",
};

export const getAllLinks = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.LINKS) || "[]");
  } catch {
    return [];
  }
};

export const saveAllLinks = (arr) => {
  localStorage.setItem(LS_KEYS.LINKS, JSON.stringify(arr));
};

export const getLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.LOGS) || "[]");
  } catch {
    return [];
  }
};

export const saveLogs = (arr) => {
  localStorage.setItem(LS_KEYS.LOGS, JSON.stringify(arr));
};
