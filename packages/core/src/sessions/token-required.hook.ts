// FoalTS
import { HookDecorator } from '../core';
import { UseSessionOptions, UseSessions } from './use-sessions.hook';

export function TokenRequired(options: UseSessionOptions = {}): HookDecorator {
  return UseSessions(true, options);
}
