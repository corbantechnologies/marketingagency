/** Shape of an Axios-style error as used by the pages' catch blocks. */
export type ApiErrorLike = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      detail?: string;
      error?: string;
      message?: string;
      [key: string]: unknown;
    };
  };
};
