const { gql, ApolloServer } = require('apollo-server-azure-functions')

const schema = require('./schema')
const resolvers = require('./resolvers')

const typeDefs = [ schema ]

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false
})

module.exports = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
})
