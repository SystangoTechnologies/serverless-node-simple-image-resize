'use strict';

let Jimp = require('jimp');
let AWS = require('aws-sdk');
let mime = require('mime-types');

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucket = process.env.BUCKET;

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

let s3 = new AWS.S3();

async function uploadToS3(buffer, filename) {
  let params = {
    Bucket: bucket,
    Key: filename,
    Body: buffer,
    ACL: 'public-read'
  };

  return await new Promise((resolve, reject) => {
    s3.putObject(params, function (err, pres) {
      if (err) {
        console.log('err', err)
        reject(err);
      } else {
        resolve('Image uploaded sucessfully');
      }
    });
  });
}

module.exports.imageResize = async (event) => {
  try {
    let request = event;
    let imageUrl = request.queryStringParameters.imageUrl;

    if (request.height && request.width) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Both height and width should not be preset in request'
        }),
      };
    }

    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'imageUrl must be present'
        }),
      };
    }

    let height = parseInt(request.queryStringParameters.height) || Jimp.AUTO;
    let width = parseInt(request.queryStringParameters.width) || Jimp.AUTO;
    let image = await Jimp.read(imageUrl);
    let mimeType = image.getMIME();
    let ext = mime.extension(mimeType);

    let fileName = `${new Date().getTime().toString()}.${ext}`;

    let buffer = await image.resize(height, width).getBufferAsync(mimeType);
    let s3Result = await uploadToS3(buffer, fileName);

    if (s3Result !== 'Image uploaded sucessfully') {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Issue while upload image to S3'
        }),
      };
    } else {
      let imageUrl = `https://${bucket}.s3.amazonaws.com/${fileName}`;
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: imageUrl
        }),
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error'
      }),
    };
  }
};
