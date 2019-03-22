const environmentVariables = require('checkenv')
const { gql, ApolloServer } = require('apollo-server-azure-functions')
const getSchemaFromBlob = require('./get-schema-from-blob')

const checkEnvironmentVariables = (context) => {
  context.log('Ensuring the necessary environment variables are present')

  try {
    environmentVariables.check(false)
  } catch (error) {
    context.log.error(error)
    context.done(null, {
      status: 500,
      body: 'Environment variables missing. Please refer to the README and the env.json to ensure you have all the correct environment variables in place. More details will br provided in server the console.'
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

    return runHandler(request, context, handler)
  } catch (error) {
    context.log.error(error)
  }
}
