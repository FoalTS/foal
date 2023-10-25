export type IConfigSchema = {
  [key: string]:
    IConfigSchema |
    {
      type: 'string' | 'number' | 'boolean' | 'boolean|string' | 'number|string',
      required?: boolean
    }
}

export type IConfig<T extends IConfigSchema> = {
  [K in keyof T]:
    T[K] extends { type: 'string', required?: boolean } ? T[K] extends { required: true } ? string : string | undefined :
    T[K] extends { type: 'number', required?: boolean } ? T[K] extends { required: true } ? number : number | undefined :
    T[K] extends { type: 'boolean', required?: boolean } ? T[K] extends { required: true } ? boolean : boolean | undefined :
    T[K] extends { type: 'boolean|string', required?: boolean } ? T[K] extends { required: true } ? boolean | string : boolean | string | undefined :
    T[K] extends { type: 'number|string', required?: boolean } ? T[K] extends { required: true } ? number | string : number | string | undefined :
    T[K] extends IConfigSchema ? IConfig<T[K]> :
    never
}
