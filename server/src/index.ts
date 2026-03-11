import { ApolloServer } from '@apollo/server';
import { HeaderMap } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { createServer } from 'node:http';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/resolvers.js';

const PORT = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Apollo Server instance (v5 standalone HTTP handling)
const apolloServer = new ApolloServer({ schema });
await apolloServer.start();

// Node HTTP server (used by both Apollo and WebSocket)
const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  // CORS
  const origin = req.headers.origin ?? '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'GraphQL BookShelf API is running',
      graphql: `http://localhost:${PORT}/graphql`,
      sandbox: 'Open the graphql URL in your browser for Apollo Sandbox',
    }));
    return;
  }

  // GraphQL endpoint
  if (url.pathname === '/graphql') {
    const bodyChunks: Buffer[] = [];
    for await (const chunk of req) {
      bodyChunks.push(Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(bodyChunks).toString('utf-8');

    // Apollo v5 expects body as parsed JSON object
    let body: Record<string, unknown> = {};
    try {
      if (rawBody) body = JSON.parse(rawBody);
    } catch {
      // let Apollo handle the error
    }

    const result = await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: req.method ?? 'GET',
        headers: new HeaderMap(Object.entries(req.headers).map(([k, v]) => [k, String(v)])),
        body,
        search: url.search,
      },
      context: async () => ({}),
    });

    res.writeHead(result.status ?? 200, Object.fromEntries(result.headers));

    if (result.body.kind === 'complete') {
      res.end(result.body.string);
      return;
    }

    for await (const chunk of result.body.asyncIterator) {
      res.write(chunk);
    }
    res.end();
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// WebSocket server for subscriptions (graphql-ws protocol)
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useServer({ schema }, wsServer);

httpServer.listen(PORT, () => {
  console.log(`
  BookShelf GraphQL API ready

  HTTP:      http://localhost:${PORT}/graphql
  WebSocket: ws://localhost:${PORT}/graphql
  Sandbox:   open http://localhost:${PORT}/graphql in your browser
  `);
});
