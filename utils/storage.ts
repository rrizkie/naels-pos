// todo: Check Also Session Storage

// * localStorage is Encrypted and Decrypted

export const setLocalStorage = (key: string, value: any) => {
  const encrypted = btoa(value as string);
  localStorage.setItem(key, encrypted);
};

export const getLocalStorage = (key: string) => {
  let value;
  if (typeof window !== "undefined") {
    value = localStorage.getItem(key);
  }
  if (value) {
    const decrypt = atob(String(value));
    return decrypt;
  }
  return value;
};

// not used yet
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  window.localStorage.clear();
};
