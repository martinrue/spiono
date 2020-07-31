export const $ = (selector: string) => document.querySelector(selector) as HTMLElement;

export const onReady = (fn: any) => {
  document.addEventListener("DOMContentLoaded", fn);
};

export const debounce = (fn: Function, ms = 500) => {
  let timeout: number | undefined;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
};
