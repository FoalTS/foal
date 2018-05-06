export interface IMultipleViews {
  render(name: string, locals: object): Promise<string>|string;
}
