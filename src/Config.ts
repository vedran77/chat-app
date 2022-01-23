import _ from "lodash";
import * as fs from "fs";
import dotenv from "dotenv";

class Config {
    private static CONFIG_PATH: string = "./config/conf.json";
    private static _config: Object;
    
    /**
     * @description Load konfiguracije
     */

    public static load(): void {
        if (!fs.existsSync(this.CONFIG_PATH)) {
			throw new Error(`Konfiguracijski fajl nije pronadjen na ${this.CONFIG_PATH}`);
		}

        dotenv.config();

        let cnf: string;
        try {
            cnf = fs.readFileSync(this.CONFIG_PATH, "utf-8");
        } catch (err) {
            throw new Error("Ne mogu procitati config fajl.");
        }

        try {
            this._config = JSON.parse(cnf);
        } catch (err) {
            throw new Error("Config fajl nije u JSON formatu.");
        }
    }

    /**
     * @description Vraca vrijednost iz configa
     * @param {any} key kljuc
    */

    public static get<T = any>(key: string): T {
        return _.get(this._config, key, undefined);
    }
}

export { Config }
