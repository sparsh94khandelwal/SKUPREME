import ApiBaseClient from "lsqUtils/build/api/ApiBaseClient";
import V2Client from "lsqUtils/build/api/ApiV2BaseClient";
import ApiCredentials from "../model/ApiCredentials";
import ApiV2BaseClient from "lsqUtils/build/api/ApiV2BaseClient";
import * as dto from "../dto/authDTO";
import ApiResponseBase from "../base/ApiResponseBase";

interface ApiConfig {
    serviceUrl: string;
    apiToken: string;
}

export default class ApiClient extends ApiBaseClient {
    credentials: ApiCredentials;
    v2: V2Client;
    constructor(params: ApiCredentials, apiConfig: ApiConfig) {
        super({});
        this.credentials = params;
        this.v2 = ApiV2BaseClient.getInstance(
            {
                queryStringParameters: params
            },
            apiConfig.serviceUrl,
            apiConfig.apiToken
        );
    }

    getBaseUrl(): string {
        return `${process.env.BASE_URL}`;
    }

    static getInstance(credentials: ApiCredentials, apiConfig: ApiConfig) {
        if (credentials && credentials.accessKey && credentials.secretKey && apiConfig.serviceUrl && apiConfig.apiToken) {
            return new ApiClient(credentials, apiConfig);
        }
        throw new Error("Missing Params: Required credentials are not passed!");
    }

    test = async (request: any, onSuccess: any, onError: any) => {
        this.callApi()(request);
    };

    checkAllowedUser = (allowedUsers: any, role: string) => {
        return (allowedUsers || allowedUsers === "") && (role === "Administrator" || allowedUsers.split(",").includes(role));
    };

    validateConnectorSettings = (settings: any, userEmail: string, role: string, checkRole: boolean = true): dto.EventStatus => {
        let status: any = {
            isSuccess: true
        };
        if (!settings) {
            return ApiResponseBase.connectorNotConfigured();
        } else if (settings.isDisabled) {
            return ApiResponseBase.connectorDisabled();
        } else if (settings.isDeleted) {
            return ApiResponseBase.connectorDeleted();
        } else if (!settings.isImportedorConfigured) {
            return ApiResponseBase.connectorNotConfigured();
        } else if (checkRole && (role === undefined || userEmail === undefined || !this.checkAllowedUser(settings.settings.allowedUsers, role))) {
            return ApiResponseBase.userPermissionDenied();
        }
        return status;
    };
}
