const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SEC_KEY
})

s3.listBuckets({}, (err, data) => {
    if (err) throw err
    console.log(data)
})
