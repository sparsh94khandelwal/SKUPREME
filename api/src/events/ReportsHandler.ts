import ApiResponseBase from "../base/ApiResponseBase";
import S3Client from "../client/S3Client";
import AWS from "aws-sdk";

const sqs = new AWS.SQS();

export class ReportsHandler {
    params: {
        eventType: "getFromS3" | "pushToS3";
    };
    body: any;
    logIndex: any;
    constructor(event: any, context: any) {
        this.logIndex = {};
        this.body = event.body;
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
            
            return ApiResponseBase.success({});
        } catch (e) {
            console.error("failed in getting logs", this.logIndex, e);
            return [false, e.message];
        }
    };

   
}
