---
title: Version 2.3 release notes
author: Loïc Poullain
author_title: Fullstack developper and creator of FoalTS
author_url: https://github.com/LoicPoullain
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/version-2.3-release-notes.png
tags: [release]
---

![Banner](./assets/version-2.3-is-here/banner.png)

Version 2.3 of Foal has been released! Here are the improvements that it brings.

<!--truncate-->

## Support of GraphiQL

From version 2.3, it is possible to generate a GraphiQL page in one line of code. This can be useful if you quickly need to test your API.

```bash
npm install @foal/graphiql
```

![GraphiQL](./assets/version-2.3-is-here/graphiql.png)

*app.controller.ts*
```typescript
import { GraphiQLController } from '@foal/graphiql';

import { GraphqlApiController } from './services';

export class AppController {

  subControllers = [
    // ...
    controller('/graphql', GraphqlApiController),
    controller('/graphiql', GraphiQLController)
  ];

}
```

The page is also customizable and you can provide additional options to change the UI or the API endpoint.

```typescript
export class GraphiQL2Controller extends GraphiQLController {

  cssThemeURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/solarized.css';

  apiEndpoint = '/api';

  options: GraphiQLControllerOptions = {
    docExplorerOpen: true,
    editorTheme: 'solarized light'
  }

}

```