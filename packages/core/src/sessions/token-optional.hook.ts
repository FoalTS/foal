// FoalTS
import { HookDecorator } from '../core';
import { UseSessionOptions, UseSessions } from './use-sessions.hook';

export function TokenOptional(options: UseSessionOptions = {}): HookDecorator {
  return UseSessions(false, options);
}
