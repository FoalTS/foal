import { Context, ServiceManager } from '../core';

export type FetchUser = (id: string|number, services: ServiceManager) => Promise<Context['user']>;