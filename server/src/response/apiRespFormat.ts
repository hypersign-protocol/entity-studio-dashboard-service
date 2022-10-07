export const apiResponse = (message, data: any, error: boolean) => {
  return error
    ? {
        message,
        data,
        error,
      }
    : {
        message,
        data,
        error,
      };
};
