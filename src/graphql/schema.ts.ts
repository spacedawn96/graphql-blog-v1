import * as path from 'path';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'apollo-server-express';

const getTypeDefs = () => {
  return fileLoader(path.join(__dirname, 'schemas/*.graphql'));
};

const getResolvers = () => {
  return fileLoader(path.join(__dirname, 'resolvers/*.ts'), {
    ignoreIndex: false,
  });
};

const resolvers = {
  ...mergeResolvers(getResolvers()),
};

const typeDefs = mergeTypes(getTypeDefs());

let graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default graphqlSchema;
