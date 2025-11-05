import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

export class GraphiQL2Controller extends GraphiQLController {

  cssThemeURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/solarized.css';

  options: GraphiQLControllerOptions = {
    docExplorerOpen: true,
    editorTheme: 'solarized light'
  }

}
