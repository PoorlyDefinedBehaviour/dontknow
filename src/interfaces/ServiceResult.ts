export default interface IServiceResult<T> {
    ok: boolean,
    data?: T;
}