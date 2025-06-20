import { jsx } from 'react/jsx-runtime';
import { h as healthcheckQuery } from './ssr.mjs';
import { useSuspenseQuery } from '@tanstack/react-query';
import '@tanstack/react-router';
import '@tanstack/react-router-with-query';
import '@tanstack/react-query-devtools';
import '@tanstack/react-router-devtools';
import 'node:async_hooks';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';

const SplitComponent = function Home() {
  const {
    data
  } = useSuspenseQuery(healthcheckQuery);
  return /* @__PURE__ */ jsx("div", { children: JSON.stringify(data) });
};

export { SplitComponent as component };
//# sourceMappingURL=index-CmSQGRsT.mjs.map
