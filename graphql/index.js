const { gql, ApolloServer } = require('apollo-server-azure-functions')
const getSchemaFromBlob = require('./get-schema-from-blob')

const checkEnvironmentVariables = (context) => {
  context.log('Ensuring the necessary environment variables are present')

  const {
    AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME,
    AZURE_STORAGE_BLOB_NAME,
    KENTICO_CLOUD_PROJECT_ID
  } = process.env

  if (
    !AZURE_STORAGE_CONNECTION_STRING ||
    !AZURE_STORAGE_CONTAINER_NAME ||
    !AZURE_STORAGE_BLOB_NAME ||
    !KENTICO_CLOUD_PROJECT_ID
  ) {
    context.done(null, {
      status: 500,
      body: 'Environment variables missing. Please refer to the README to ensure you have all the correct environment variables in place'
    })
  }
}

const runHandler = (request, context, handler) => {
  return new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body))
    handler(context, request, callback)
  })
}

module.exports = async (context, request) => {
  try {
    await checkEnvironmentVariables(context)
    await getSchemaFromBlob(context)

    const schema = require('./schema')
    const resolvers = require('./resolvers')

    const typeDefs = [ schema ]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      uploads: false
    })

    const handler = server.createHandler({
      cors: {
        origin: '*',
        credentials: true
      }
    })

    const response = await runHandler(request, context, handler)
    return response
  } catch (error) {
    context.log.error(error)
  }
}
