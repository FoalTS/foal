import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

export class GraphiQL2Controller extends GraphiQLController {

  options: GraphiQLControllerOptions = {
    docExplorerOpen: true
  }

}
