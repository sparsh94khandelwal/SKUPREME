"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiResponseBase = /** @class */ (function () {
    function ApiResponseBase() {
    }
    ApiResponseBase.response = function (statusCode, statusMessage, // Connector specific status code
    data, headers) {
        if (headers === void 0) { headers = {}; }
        return {
            statusCode: statusCode,
            headers: Object.assign({
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }, headers),
            body: JSON.stringify({
                status: statusMessage,
                data: data
            })
        };
    };
    ApiResponseBase.success = function (data, statusMessage) {
        if (statusMessage === void 0) { statusMessage = "SUCCESS"; }
        return ApiResponseBase.response(200, statusMessage, data);
    };
    ApiResponseBase.error = function (data, statusMessage) {
        if (statusMessage === void 0) { statusMessage = "ERROR"; }
        return ApiResponseBase.response(200, statusMessage, data);
    };
    ApiResponseBase.methodNotAllowed = function () {
        return ApiResponseBase.response(405, "ERROR", {
            message: "Method Not Allowed"
        });
    };
    ApiResponseBase.actionNotAllowed = function (statusMessage) {
        if (statusMessage === void 0) { statusMessage = "ERROR"; }
        return ApiResponseBase.response(405, statusMessage, "Action not allowed");
    };
    ApiResponseBase.badRequest = function (statusMessage) {
        if (statusMessage === void 0) { statusMessage = "ERROR"; }
        return ApiResponseBase.response(400, statusMessage, "Bad Request");
    };
    ApiResponseBase.serverError = function () {
        return ApiResponseBase.response(500, "SERVER_ERROR", {
            message: "Error in processing request"
        });
    };
    return ApiResponseBase;
}());
exports.default = ApiResponseBase;
//# sourceMappingURL=ApiResponseBase.js.map