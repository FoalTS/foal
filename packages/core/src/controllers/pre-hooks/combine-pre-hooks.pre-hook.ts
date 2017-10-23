import { Decorator } from '../interfaces';

export function combinePreHooks(decorators: Decorator[]): Decorator {
    return function combinePreHooks(target: any, methodName?: string): void {
        decorators.reverse().forEach(decorator => decorator(target, methodName));
    };
}
