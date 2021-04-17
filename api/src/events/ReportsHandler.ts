import ApiResponseBase from "../base/ApiResponseBase";
import { S3Upload } from '../fileUpload/S3FileUpload';
const json2xls = require('json2xls'),
    fs = require('fs'),
    EXTENSION = process.env.EXTENSION,
    S3_BUCKET = process.env.S3_LOG_BUCKET,
    MIME_TYPE = process.env.MIME_TYPE;

export class ReportsHandler {
    params: {
        eventType: "getFromS3" | "pushToS3";
    };
    body: any;
    logIndex: any;
    context: any;
    constructor(event: any, context: any) {
        this.logIndex = {};
        this.params = this.logIndex;
        this.body = event.body;
        this.context = context;
        this.params.eventType = event.pathParameters.eventType;
    }

    getEventType = () => {
        return this.params.eventType;
    };

    static executeInstance = async (event: any, context: any) => {
        let eventObj: ReportsHandler | null = null;
        try {
            eventObj = new ReportsHandler(event, context);
            return eventObj[eventObj.getEventType()]();
        } catch (error) {
            console.log("error", error);
            return ApiResponseBase.error(error.message);
        }
    };

    pushToS3 = async (): Promise<any> => {
        try {
            console.log('this.context.awsRequestId', this.context.awsRequestId);
            let filename: string = `${this.context.awsRequestId}.${EXTENSION}`;
            // convert json to xls
            console.log('eventBody', this.body);
            let convertedObj = json2xls(this.body.data);
            fs.writeFileSync(`/tmp/${filename}`, convertedObj, 'binary');
           
            let filePath = `/tmp/${filename}`;
            console.log('filePath', filePath);

            // upload excel to s3
            let s3Util = new S3Upload();
            let fileUploadResult = await s3Util.uploadFileToS3(S3_BUCKET, filename, filePath, MIME_TYPE);
            console.log('fileUploadResult', fileUploadResult);
            
            return ApiResponseBase.success({});
        } catch (e) {
            console.error("failed in pushToS3", this.logIndex, e);
            return [false, e.message];
        }
    };


}
