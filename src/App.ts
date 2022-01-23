import { Config } from "./Config";
import { Container } from "./Container";
import { WebServer } from "./WebServer";

class App {
    public static readonly APP_URL: string = "http://localhost";
    public static readonly APP_PORT: number = 3000;

    private static _instance: App;

    public static get instance(): App {
        if (this._instance === undefined) {
            this._instance = new App();
        }

        return this._instance;
    }

    public start(): void {
        // konfiguracija
        Config.load();

        // starting web server
        WebServer.instance.start(); 

        // container
        Container.instance.load();
    }
}

export { App };
