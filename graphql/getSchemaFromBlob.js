const { createWriteStream } = require('fs')
const path = require('path')
const azure = require('azure-storage')

const getSchemaFromBlob = (context) => {
  context.log('Fetching schema from blob storage...')

  const blobService = azure.createBlobService()
  const schemaPath = path.resolve(__dirname, 'schema/kentico-cloud-schema.graphql')
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
  const blobName = process.env.AZURE_STORAGE_BLOB_NAME

  return new Promise((resolve, reject) => {
    blobService.getBlobToStream(containerName, blobName, createWriteStream(schemaPath),
      (error, result, response) => {
        if (!error) resolve(result)
        if (error) reject({ error, response })
      }
    )
  })
}

module.exports = getSchemaFromBlob
