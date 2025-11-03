// lib/console.js
export const setupConsole = () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    console.log = function () {};
    console.error = function () {};
    console.warn = function () {};
    console.info = function () {};
    console.debug = function () {};

    // Optional: Keep errors in production but remove other logs
    // console.log = function () {};
    // console.warn = function () {};
    // console.info = function () {};
    // console.debug = function () {};
  }
};
