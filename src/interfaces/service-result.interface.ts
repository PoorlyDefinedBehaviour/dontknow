export default interface IServiceResult<T> {
  readonly ok: boolean;
  readonly data?: T;
  readonly message?: string;
}
