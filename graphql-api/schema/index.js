const path = require('path')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')

const typesArray = fileLoader(path.join(__dirname, '**/*.graphql'))
const mergedSchema = mergeTypes(typesArray, { all: true })

module.exports = mergedSchema
