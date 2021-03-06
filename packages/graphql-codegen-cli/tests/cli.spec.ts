import { executeWithOptions } from '../src/codegen';
import { getLogger, useWinstonLogger } from 'graphql-codegen-core';

describe('executeWithOptions', () => {
  it('execute the correct results when using schema with json file', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/githunt/schema.json',
      template: 'ts'
    });

    expect(result.length).toBe(1);
  });

  it('execute the throw an error when a document is not valid', async () => {
    useWinstonLogger();
    let spyLogger: jest.SpyInstance = jest.spyOn(getLogger(), 'error');
    spyLogger.mockImplementation();
    let spyProcessExit: jest.SpyInstance = jest.spyOn(process, 'exit');
    spyProcessExit.mockImplementation();

    await executeWithOptions({
      silent: false,
      schema: './tests/test-documents/schema.graphql',
      template: 'graphql-codegen-typescript-template',
      args: ['./tests/test-documents/invalid-fields.graphql']
    });

    expect(spyLogger.mock.calls[0][0]).toBe(
      '[./tests/test-documents/invalid-fields.graphql] GraphQL Error: Cannot query field "fieldD" on type "Query". Did you mean "fieldA" or "fieldB"?'
    );
    expect(spyLogger.mock.calls[1][0]).toBe('Found 1 errors when validating your GraphQL documents against schema!');
    expect(spyProcessExit).toBeCalledWith(1);

    spyLogger.mockRestore();
    spyProcessExit.mockRestore();
  });

  it('execute the correct results when using schema with js file', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-object.js',
      template: 'ts'
    });

    expect(result.length).toBe(1);
  });

  it('execute the correct results when using schema with graphql file', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema.graphql',
      template: 'ts'
    });

    expect(result.length).toBe(1);
  });

  it('execute the correct results when using schema with graphql file and imports', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-with-imports.graphql',
      template: 'ts'
    });

    expect(result.length).toBe(1);
  });

  it('execute the correct results when using custom config file', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/githunt/schema.json',
      template: 'ts',
      config: '../../dev-test/config/gql-gen.json'
    });

    expect(result[0].content).toMatch('Generated in');
  });

  it('execute the correct results when using schema export as object', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-object.js',
      template: 'ts'
    });
    expect(result.length).toBe(1);
  });

  it('execute the correct results when using schema export as text', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-text.js',
      template: 'ts'
    });
    expect(result.length).toBe(1);
  });

  describe('with local schema', () => {
    it('execute the correct results when using schema export as object', async () => {
      const result = await executeWithOptions({
        schema: '../../dev-test/test-schema/schema-object.js',
        clientSchema: '../../dev-test/test-schema/local/schema-object.js',
        template: 'ts'
      });
      expect(result.length).toBe(1);
    });

    it('execute the correct results when using schema export as text', async () => {
      const result = await executeWithOptions({
        schema: '../../dev-test/test-schema/schema-text.js',
        clientSchema: '../../dev-test/test-schema/local/schema-text.js',
        template: 'ts'
      });

      const content = result[0].content;

      expect(content).toMatch('export interface Post');
      expect(content).toMatch('allPosts: (Post | null)[];');
      expect(content).toMatch('allPosts: (Post | null)[];');
      expect(content).toMatch('allPosts?: AllPostsResolver<(Post | null)[], any, Context>;');

      expect(result.length).toBe(1);
    });
  });

  it('execute the correct results when using skipSchema', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-text.js',
      template: 'ts',
      skipSchema: true
    });

    expect(result[0].content).toMatch(/^\/\* tslint:disable \*\//);
  });

  it('execute the correct results when using skipDocuments', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/star-wars/schema.json',
      template: 'ts',
      args: ['../../dev-test/star-wars/HeroDetails.graphql'],
      skipDocuments: true,
      skipSchema: true
    });

    expect(result[0].content).not.toMatch('HeroDetails');
  });

  it('execute the correct results when using schema export as ast', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-ast.js',
      template: 'ts'
    });
    expect(result.length).toBe(1);
  });

  it('execute the correct results when using schema export as json', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/test-schema/schema-json.js',
      template: 'ts'
    });
    expect(result.length).toBe(1);
  });

  it('execute the correct results when using export and require', async () => {
    const result = await executeWithOptions({
      schema: '../../dev-test/githunt/schema.js',
      template: 'ts',
      require: ['../tests/dummy-require.js']
    });
    expect(result.length).toBe(1);
    expect(global['dummyWasLoaded']).toBe(true);
  });
});
