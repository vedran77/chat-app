import _ from "lodash";
import express, { Express } from "express";
import bodyParser from "body-parser";

import { IRoute } from "./routes/IRoute";
import { routes } from "./routes"

class WebServer {
    private _server: Express;

    public start() {
        this._server = express();
        this._server.use(express.static("client/build"));

        this._server.use(bodyParser.urlencoded({ extended: false }));
        this._server.use(bodyParser.json());
    }

    /**
     * @description Registruje sve rute.
     */

    public registerEvents(): void {
        const serverRoutes: IRoute[] = _.map(routes, (route: any) => { return new route(); });
    
        _.forEach(serverRoutes, (route: IRoute) => {
            this._server.post(route.routeName(), route.handle);
        });
    }
}

export { WebServer }
