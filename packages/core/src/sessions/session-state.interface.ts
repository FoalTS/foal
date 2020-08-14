/**
 * Describes the session state to be saved by the store.
 *
 * @export
 * @interface SessionState
 */
export interface SessionState {
  // 44-characters long
  id: string;
  userId: string|number|null;
  content: { [key: string]: any };
  flash: { [key: string]: any };
  // 4-bytes long (min: 0, max: 2147483647)
  updatedAt: number;
  // 4-bytes long (min: 0, max: 2147483647)
  createdAt: number;
  // TODO: rememberme. Update also the documentation.
}
