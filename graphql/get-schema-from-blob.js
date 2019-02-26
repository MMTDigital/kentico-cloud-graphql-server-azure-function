const fs = require('fs')
const path = require('path')
const azure = require('azure-storage')

const blobService = azure.createBlobService()

const getSchemaFromBlob = (context) => {
  context.log('Fetching schema from blob storage')
  return new Promise((resolve, reject) => {
    blobService.getBlobToStream(
      process.env.AZURE_STORAGE_CONTAINER_NAME,
      process.env.AZURE_STORAGE_BLOB_NAME,
      fs.createWriteStream(path.resolve(__dirname, 'schema/kentico-cloud-schema.graphql')),
      (error, result, response) => {
        if (!error) resolve(result)
        if (error) reject({ error, response })
      }
    )
  })
}

module.exports = getSchemaFromBlob
