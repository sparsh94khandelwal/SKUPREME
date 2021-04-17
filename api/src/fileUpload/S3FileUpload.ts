import * as awsSdk from "aws-sdk";
import { S3Params } from "../S3/S3Params";
const fs = require('fs');
awsSdk.config.update({ region: process.env.DEFAULT_REGION });
const s3 = new awsSdk.S3();

export class S3Upload {
    private s3: any;
    constructor() {
        this.s3 = new awsSdk.S3();
    }

    public upload(params: S3Params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.s3.upload(params, function (error: any, data: any) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }

    public fetch = async (params: any): Promise<any> => {
        await this.s3.getObject(params).promise();
    };

    public downloadFileFromS3 = async (bucket, fileKey, filePath) => {
		console.log('downloading', bucket, fileKey, filePath);
		return new Promise(function (resolve, reject) {
			const file = fs.createWriteStream(filePath),
				stream = s3.getObject({
					Bucket: bucket,
					Key: fileKey
				}).createReadStream();
			stream.on('error', reject);
			file.on('error', reject);
			file.on('finish', function () {
				console.log('downloaded', bucket, fileKey);
				resolve(filePath);
			});
			stream.pipe(file);
		});
	}
    
    public uploadFileToS3 = async (bucket, fileKey, filePath, contentType) => {
		console.log('uploading', bucket, fileKey, filePath);
		return s3.upload({
			Bucket: bucket,
			Key: fileKey,
			Body: fs.createReadStream(filePath),
			ACL: 'private',
			ContentType: contentType
		}).promise();
	};
}
