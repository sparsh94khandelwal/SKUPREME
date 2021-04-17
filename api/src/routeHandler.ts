import { ReportsHandler } from "./events";

export const reportsHandler = async (event: any, context: any, callback: any) => {
    return await ReportsHandler.executeInstance(event, context);
};