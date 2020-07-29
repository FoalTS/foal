/**
 * Describes the session state to be saved by the store.
 *
 * @export
 * @interface SessionState
 */
export interface SessionState {
  id: string;
  // userId: string|number|null;
  userId?: number|string;
  content: { [key: string]: any };
  flash: { [key: string]: any };
  // updatedAt: number;
  createdAt: number;
}
