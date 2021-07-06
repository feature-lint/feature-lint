export interface Success<DATA> {
  successful: true;
  data: DATA;
}

export const Success = <DATA>(data: DATA): Result<DATA, never> => {
  return {
    successful: true,
    data,
  };
};

export const Failure = <ERROR>(error: ERROR): Result<never, ERROR> => {
  return {
    successful: false,
    error,
  };
};

export interface Failure<ERROR> {
  successful: false;
  error: ERROR;
}

export type Result<DATA, ERROR> = Success<DATA> | Failure<ERROR>;
