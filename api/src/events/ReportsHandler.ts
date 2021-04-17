import ApiResponseBase from "../base/ApiResponseBase";
import { S3Upload } from '../fileUpload/S3FileUpload';
import AWS from "aws-sdk";
const xl = require('excel4node'),
    json2xls = require('json2xls'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
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
            // return ApiResponseBase.badRequestWithMessage(error.message);
            return ApiResponseBase.error(error.message);
        }
    };

    pushToS3 = async (): Promise<any> => {
        try {
            //sample data
            const data = [
                {
                    "name": "Sparsh Khandelwal",
                    "email": "sparsh1994@gmail.com",
                    "mobile": "1234567890"
                }
            ];

            console.log('this.context.awsRequestId', this.context.awsRequestId);
            let filename: string = `${this.context.awsRequestId}.${EXTENSION}`;
            let convertedObj = json2xls(data);
            fs.writeFileSync(`/tmp/${filename}`, convertedObj, 'binary');

            // create workbook
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Worksheet Name');
            // extract column names
            const headingColumnNames = Object.keys(data[0]);
            // writing columnName in Excel file using functions in excel4node
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });

            // write data in excel file
            let rowIndex = 2;
            data.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws.cell(rowIndex, columnIndex++)
                        .string(record[columnName])
                });
                rowIndex++;
            });
            // take workbook and save it into the file
            // Writes the excel file to the process.cwd();
            
            wb.write(filename);
            // let filePath: string = path.join(process.cwd(), filename);
            let filePath = `/tmp/${filename}`;
            console.log('filePath', filePath);

            let tempPath = path.join(os.tmpdir(), filename);

            console.log('tempPath', tempPath);
            let s3Util = new S3Upload();
            let fileUploadResult = await s3Util.uploadFileToS3(S3_BUCKET, filename, filePath, MIME_TYPE);
            console.log('fileUploadResult', fileUploadResult);
            // upload excel to s3
            return ApiResponseBase.success({});
        } catch (e) {
            console.error("failed in pushToS3", this.logIndex, e);
            return [false, e.message];
        }
    };


}
