export interface EventStatus {
    isSuccess?: Boolean;
    message?: string;
    data?: any;
    statusCode?: number;
    httpResponseCode?: number;
}