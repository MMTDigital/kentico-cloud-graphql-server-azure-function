const { join } = require('path')
const { readdirSync } = require('fs')

const path = join(__dirname, './')
const files = readdirSync(path)

const resolvers = files.reduce((finalResolvers, file) => {
  const newResolvers = require('./' + file)
  return {
    ...finalResolvers,
    ...newResolvers
  }
}, {})

module.exports = resolvers
