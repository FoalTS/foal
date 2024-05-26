// The compilation of the packages fails because of the error "../../node_modules/@types/react/ts5.0/index.d.ts(9,53): error TS2307: Cannot find module 'scheduler/tracing' or its corresponding type declarations."
// This file is a workaround to fix the issue.
declare module 'scheduler/tracing' {
  export type Interaction = any;
}