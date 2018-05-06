export interface IView {
  render(locals: object): Promise<string>|string;
}
