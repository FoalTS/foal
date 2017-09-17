import { Decorator } from '../interfaces';

export function combineDecorators(decorators: Decorator[]): Decorator {
    return function combinedDecorators(target: any, methodName?: string): void {
        decorators.reverse().forEach(decorator => decorator(target, methodName));
    };
}
