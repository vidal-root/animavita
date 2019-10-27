import { GraphQLServer } from 'graphql-yoga';
import { database } from '../core/database';
import middlewares from '../core/middleware';
import { getUser } from '~/utils/auth';
import { schema } from './schema';

require('dotenv').config();

/* Connect to mongodb */
database();

const { PORT } = process.env;

const options = {
  port: PORT || '4000',
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: process.env.NODE_ENV === 'production' ? false : '/playground'
};

const contextSettings = async ({ request, connection }) => {
  const { user } = await getUser(
    request ? request.headers.authorization : connection.context.Authorization
  );
  return {
    ...request,
    user
  };
};

const server = new GraphQLServer({
  schema,
  context: contextSettings,
  middlewares
});

server.start(options, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
