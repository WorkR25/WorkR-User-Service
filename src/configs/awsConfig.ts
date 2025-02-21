import * as AWS from '@aws-sdk/client-s3';

// import AWS from 'aws-sdk';
import serverConfig from './serverConfig';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = serverConfig;

export const s3 = new AWS.S3({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID as string,
        secretAccessKey: AWS_SECRET_ACCESS_KEY as string
    }
});

// AWS.config.update({
//     credentials: new AWS.Credentials(
//         AWS_ACCESS_KEY_ID as string,
//         AWS_SECRET_ACCESS_KEY as string
//     ),
//     region: AWS_REGION || 'ap-south-1'
// });

// export const s3 = new AWS.S3();