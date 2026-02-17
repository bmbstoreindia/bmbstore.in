let setLoader: ((value: boolean) => void) | null = null;

export const registerLoader = (fn: (value: boolean) => void) => {
  setLoader = fn;
};

export const showApiLoader = () => {
  setLoader?.(true);
};

export const hideApiLoader = () => {
  setLoader?.(false);
};
