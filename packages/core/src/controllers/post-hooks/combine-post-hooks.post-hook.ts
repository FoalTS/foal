import { Decorator } from '../interfaces';

export function combinePostHooks(decorators: Decorator[]): Decorator {
    return function combinePostHooks(target: any, methodName?: string): void {
        decorators.reverse().forEach(decorator => decorator(target, methodName));
    };
}
