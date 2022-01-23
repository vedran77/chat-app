import _ from "lodash";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { IRoute } from "./routes/IRoute";
import { routes } from "./routes"

class WebServer {
    private readonly PORT: number = 3000;

    private _server: Express;
    private static _instance: WebServer;

    public static get instance(): WebServer {
        if (this._instance === undefined) {
            this._instance = new WebServer();
        }

        return this._instance;
    }

    public start(): void {
        // express konfiguracija
        this._server = express();

        this._server.use(bodyParser.urlencoded({ extended: false }));
        this._server.use(bodyParser.json());
        this._server.use(cors());

        this._server.listen(this.PORT, () => {
            console.log(`Server started on port ${this.PORT}.`);
        });

        // ucitaj rute
        this.registerRoutes();
    }

    /**
     * @description Registruje sve rute.
     */

    public registerRoutes(): void {
        const serverRoutes: IRoute[] = _.map(routes, (route: any) => { return new route(); });

        _.forEach(serverRoutes, (route: IRoute) => {
            this._server.post(route.routeName(), route.handle);
        });
    }
}

export { WebServer }
