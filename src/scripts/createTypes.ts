import { generateNamespace } from '@gql2ts/from-schema';
import * as fs from 'fs';
import * as path from 'path';
import graphqlSchema from '../graphql/schema.ts';

const schema = graphqlSchema;

const typescriptTypes = generateNamespace('MyGraphQL', schema);

fs.writeFile(
  path.join(__dirname, '../types/schema.d.ts'),
  typescriptTypes,
  (err) => {
    console.log(err);
  },
);
