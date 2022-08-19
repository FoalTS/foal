import { generateToken } from '../../common';
import { Session } from './session';
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

export async function createSession(store: SessionStore): Promise<Session> {
  const date = Math.floor(Date.now() / 1000);

  const state: SessionState = {
    content: {
      csrfToken: await generateToken(),
    },
    createdAt: date,
    // The below line cannot be tested because of the encapsulation of Session.
    flash: {},
    id: await generateToken(),
    // Any value here is fine. updatedAt is set by Session.commit().
    updatedAt: date,
    userId: null,
  };

  return new Session(store, state, { exists: false });
}
