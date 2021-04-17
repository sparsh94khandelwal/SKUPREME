"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsHandler = void 0;
var ApiResponseBase_1 = __importDefault(require("../base/ApiResponseBase"));
var S3FileUpload_1 = require("../fileUpload/S3FileUpload");
var xl = require('excel4node');
var os = require('os'), path = require('path'), EXTENSION = ".xlsx", //process.env.EXTENSION,
S3_BUCKET = process.env.S3_LOG_BUCKET, MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; //process.env.MIME_TYPE;
var ReportsHandler = /** @class */ (function () {
    function ReportsHandler(event, context) {
        var _this = this;
        this.getEventType = function () {
            return _this.params.eventType;
        };
        this.pushToS3 = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, wb, ws_1, headingColumnNames, headingColumnIndex_1, rowIndex_1, id, filename, filePath, tempPath, convertedPath, s3Util, fileUploadResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = [
                            {
                                "name": "Sparsh Khandelwal",
                                "email": "sparsh1994@gmail.com",
                                "mobile": "1234567890"
                            }
                        ];
                        wb = new xl.Workbook();
                        ws_1 = wb.addWorksheet('Worksheet Name');
                        headingColumnNames = Object.keys(data[0]);
                        headingColumnIndex_1 = 1;
                        headingColumnNames.forEach(function (heading) {
                            ws_1.cell(1, headingColumnIndex_1++)
                                .string(heading);
                        });
                        rowIndex_1 = 2;
                        data.forEach(function (record) {
                            var columnIndex = 1;
                            Object.keys(record).forEach(function (columnName) {
                                ws_1.cell(rowIndex_1, columnIndex++)
                                    .string(record[columnName]);
                            });
                            rowIndex_1++;
                        });
                        // take workbook and save it into the file
                        // Writes the excel file to the process.cwd();
                        console.log('this.context.awsRequestId', this.context.awsRequestId);
                        id = this.context.awsRequestId;
                        filename = this.context.awsRequestId + ".xlsx";
                        wb.write(filename);
                        filePath = path.join(process.cwd(), filename);
                        console.log('filePath', filePath);
                        tempPath = path.join(os.tmpdir(), id);
                        convertedPath = path.join(os.tmpdir(), 'converted-' + id + EXTENSION);
                        console.log('tempPath', tempPath);
                        s3Util = new S3FileUpload_1.S3Upload();
                        return [4 /*yield*/, s3Util.uploadFileToS3(S3_BUCKET, filename, filePath, MIME_TYPE)];
                    case 1:
                        fileUploadResult = _a.sent();
                        console.log('fileUploadResult', fileUploadResult);
                        // upload excel to s3
                        return [2 /*return*/, ApiResponseBase_1.default.success({})];
                    case 2:
                        e_1 = _a.sent();
                        console.error("failed in getting logs", this.logIndex, e_1);
                        return [2 /*return*/, [false, e_1.message]];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.logIndex = {};
        this.params = this.logIndex;
        this.body = event.body;
        this.context = context;
        this.params.eventType = event.pathParameters.eventType;
    }
    ReportsHandler.executeInstance = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
        var eventObj;
        return __generator(this, function (_a) {
            eventObj = null;
            try {
                eventObj = new ReportsHandler(event, context);
                return [2 /*return*/, eventObj[eventObj.getEventType()]()];
            }
            catch (error) {
                console.log("error", error);
                // return ApiResponseBase.badRequestWithMessage(error.message);
                return [2 /*return*/, ApiResponseBase_1.default.error(error.message)];
            }
            return [2 /*return*/];
        });
    }); };
    return ReportsHandler;
}());
exports.ReportsHandler = ReportsHandler;
//# sourceMappingURL=ReportsHandler.js.map