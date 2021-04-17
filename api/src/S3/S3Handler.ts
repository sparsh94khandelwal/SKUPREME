import * as awsSdk from "aws-sdk";
import { S3Params } from "./S3Params";
awsSdk.config.update({ region: process.env.DEFAULT_REGION });
const s3 = new awsSdk.S3();

export class S3Handler {
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
        return new Promise((resolve, reject) => {
            this.s3.getObject(params, function (error: any, data: any) {
                if (error) {
                    reject(error);
                }
                resolve(data?.Body?.toString());
            });
        });
    };

    public getObjects = async (params: any): Promise<any> => {
        return await this.s3.listObjects(params, function (err, data) {
            if (err) console.log(err, err.stack);
            // an error occurred
            else console.log(data); // successful response
        });
    };
}
