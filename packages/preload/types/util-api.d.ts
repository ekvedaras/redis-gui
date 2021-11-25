export interface UtilApi {
  promisify(fn: () => unknown): () => unknown,
}
