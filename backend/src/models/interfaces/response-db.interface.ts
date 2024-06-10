export interface IResponseDb<T> {
    isError: boolean;
    data: T;
    httpStatus?: number;
}