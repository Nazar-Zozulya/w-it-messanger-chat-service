export interface Success<T> {
    status: "success";
    data: T;
}

export interface Error {
    status: "error";
    message?: string;
    code?: number;
}

export type Result<S> = Success<S> | Error;