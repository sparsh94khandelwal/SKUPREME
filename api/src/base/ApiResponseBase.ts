export default class ApiResponseBase {
    static response = (
        statusCode: number,
        statusMessage: string, // Connector specific status code
        data: any,
        headers = {}
    ) => {
        return {
            statusCode,
            headers: Object.assign(
                {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                headers
            ),
            body: JSON.stringify({
                status: statusMessage,
                data
            })
        };
    };

    static success = (data: any, statusMessage: string = "SUCCESS") => {
        return ApiResponseBase.response(200, statusMessage, data);
    };

    static error = (data: any, statusMessage: string = "ERROR") => {
        return ApiResponseBase.response(200, statusMessage, data);
    };

    static methodNotAllowed = () => {
        return ApiResponseBase.response(405, "ERROR", {
            message: "Method Not Allowed"
        });
    };

    static actionNotAllowed = (statusMessage: string = "ERROR") => {
        return ApiResponseBase.response(405, statusMessage, "Action not allowed");
    };

    static badRequest = (statusMessage: string = "ERROR") => {
        return ApiResponseBase.response(400, statusMessage, "Bad Request");
    };

    static serverError = () => {
        return ApiResponseBase.response(500, "SERVER_ERROR", {
            message: "Error in processing request"
        });
    };
}
