import { Session } from './session';
import { SessionStore } from './session-store';

export async function readSession(store: SessionStore, id: string): Promise<Session | null> {
  const state = await store.read(id);
  if (state === null) {
    return null;
  }

  const session = new Session(store, state, { exists: true });
  if (session.isExpired) {
    await session.destroy();
    return null;
  }

  return session;
}
