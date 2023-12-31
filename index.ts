import { Application, Request, Response, NextFunction } from "express";


interface InterceptorsSettings {
    response: Record<string, any>;
    isEnable?: boolean;
}
const ORIGINAL_RESPONSE = { response: { info: "Interceptor Response" } }
export class Interceptor {
    private static app: Application
    private myResponse: Record<string, any>;
    constructor(private app: Application, private settings: InterceptorsSettings) {
        Interceptor.app = app
        this.myResponse = settings.response
        if (settings.isEnable) {
            this.InterceptResponse()
        }
    }
    /**
     * Private function that intercepts the response.
     * This function is responsible for modifying the response object by adding additional properties to the data being sent.
     * It also handles promises and catches any errors that occur during the process.
     *
     * @private
     * @return {void}
     */
    private InterceptResponse(): void {
        const _this = this
        console.log("Response is using Interceptor")
        Interceptor.app.use(function (req: Request, res: Response, next: NextFunction) {
            try {
                const oldJSON = res.json;
                res.json = (data: any) => {
                    if (data && data.then != undefined) {
                        return data.then((resData: any) => {
                            res.json = oldJSON;

                            return oldJSON.call(res, resData);
                        }).catch((error: any) => {
                            next(error);
                        });
                    } else {
                        data = Object.assign(data, _this.myResponse);
                        return oldJSON.call(res, data);
                    }
                }
                next()
            } catch (error: any) {
                let err = new Error("Something Went Wrong with Intercepting the Response");
                err.name = "PAYLOAD_TOO_LARGE";
                err.cause = error.message;
                err.stack = error
                throw error

            }
        })
    }
    /**
     * Generates a function comment for the given function body.
     *
     * @param {any} response - the response object
     * @return {void} 
     */
    public static forRoute(response: any) {
        Interceptor.app.use(function (req: Request, res: Response, next: NextFunction) {
            try {
                const oldJSON = res.json;
                res.json = (data) => {
                    if (data && data.then != undefined) {
                        return data.then((resData: any) => {
                            res.json = oldJSON;

                            return oldJSON.call(res, resData);
                        }).catch((error: any) => {
                            next(error);
                        });
                    } else {
                        data = Object.assign(data, response);
                        return oldJSON.call(res, data);
                    }
                }
                next()
            } catch (error: any) {
                let err = new Error("Something Went Wrong with Intercepting the Response");
                err.name = "PAYLOAD_TOO_LARGE";
                err.cause = error.message;
                err.stack = error
                throw error

            }
        })
    }
    /**
     * Initializes and configures the use of interceptors in the application.
     *
     * @param {Application} app - The application instance.
     * @param {{ response: Record<string, any>, isEnable?: boolean }} settings - The settings for the interceptors. Default is { ...ORIGINAL_RESPONSE, isEnable: false }.
     * @return {typeof Interceptor} - The Interceptor class.
     */
    public static useInterceptors(app: Application, settings: { response: Record<string, any>, isEnable?: boolean } = { ...ORIGINAL_RESPONSE, isEnable: false }): typeof Interceptor {
        if (!Interceptor.app) {
            new Interceptor(app, settings)
            return this
        }
        return this
    }
}