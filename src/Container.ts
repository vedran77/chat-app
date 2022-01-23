import { Config } from "./Config";

class Container {
    private static _instance: Container;
    private containerItems: Map<string, any>;

    public static get instance(): Container {
        if (this._instance === undefined) {
            this._instance = new Container();
        }

        return this._instance;
    }

    /**
     * @description Dodaje iteme u jedan container koji cemo poslije moci iskoristiti za lakse getovanje klasa
     */

    public async load(): Promise<void> {
        this.containerItems = new Map();

        // databaza
        const { Database, storageDrivers } = await import("./database");
        this.set("database", new Database(
            new storageDrivers.MySQL(),
            Config.get("database"),
        ));
    }

    /**
     * @description Dodaje jedan item u nas container
     * @param {string} containerItemName Ime Itema
     * @param {any} containerItem Item
     */

    public set(containerItemName: string, containerItem: any) {
        this.containerItems.set(containerItemName, containerItem);
    }

    /**
     * @description Vraca odredjeni Item iz containera
     * @param {string} containerItemName ime Itema
     * @returns Item
     */

    public get(containerItemName: string): any {
        return this.containerItems.get(containerItemName);
    }
}

export { Container }
