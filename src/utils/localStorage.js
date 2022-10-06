export const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};