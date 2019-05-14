# serverless-node-simple-image-resize

Simple AWS lambda serverless function for resizing images. The function resizes the image based on input parameters for size and upload the image on AWS S3.

## Setup
Run the following commands
```sh
$ npm install -g serverless # Install serverless globally
$ serverless config credentials --provider aws --key <AWS Access Key ID> --secret <AWS Secret Access Key> # Setting up default aws credentials
$ cd aws-serverless-image-resize
$ npm install # Installing dependency
```

## Deployment
```sh
$ serverless deploy # Deploying serverless function to aws
```

By this command `serverless deploy` you should be able to see the lambda function in your aws lambda dashboard and it should have returned an endpoint and api_key in your terminal keep these for now.

Setup the following variables into your aws lambda function 
- ACCESS_KEY_ID (AWS account access key)
- SECRET_ACCESS_KEY (AWS account secret key)
- BUCKET (S3 bucket name where resized images will get uploaded)

## Running

Run ```export MY_API_KEY=<any random key value for your lambda function>```

Make a GET API call with to the endpoint and send x-api-key into headers with the api_key value returned after deploy command. The API supports the following query parameters
- imageUrl (A public URL of the image you want to resize)
- width or height (One of the following parameter for desired image size)

```<API_URL>?imageUrl=https://s3.amazonaws.com/towlot-portal-images/1551975541895.jpeg&height=200```

The API call will return the image URL that has been added to your S3 account.

## Running by postman collection

- Import the postman collection and set the endpoint and x-api-key and make a hit.

## Contributors

[Sparsh Pipley](https://in.linkedin.com/in/sparsh-pipley-6ab0b1a4/)

## License

Built under [MIT](http://www.opensource.org/licenses/mit-license.php) license.

