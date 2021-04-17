import * as awsSdk from "aws-sdk";
import { S3Params } from "./S3Params";
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
}
