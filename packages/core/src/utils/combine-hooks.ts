import { Hook } from '../interfaces';

export function combineHooks(hooks: Hook[]): Hook {
    return (target: any, methodName?: string): void => {
        hooks.reverse().forEach(hook => hook(target, methodName));
    };
}
