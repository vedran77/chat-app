import { Container } from "./Container";
import { IDatabase } from "./database";
import { getRandomString } from "./Helpers";

class Sessions {
    private static _instance: Sessions;

    public static get instance(): Sessions {
        if (this._instance === undefined) {
            this._instance = new Sessions();
        }

        return this._instance;
    }

    /**
     * @description Kreira sesiju za jednog usera
     * @param {number} userID 
     * @returns {string} token sesije
     */

    public createSession(userID: number): string {
        const token: string = getRandomString(60);

        const db: IDatabase = Container.instance.get("database");
        const q: string = "INSERT INTO sessions (userID, token, expires) VALUES (?, ?, ?)";

        db.insert(q, [userID, token, Date.now() + (3600 * 60)]);

        return token;
    }

    /**
     * @description Vraca ID usera uz pomoc tokena
     */

    public async getUserId(token: string): Promise<number> {
        const db: IDatabase = Container.instance.get("database");
        const q: string = "SELECT userID FROM sessions WHERE token = ? LIMIT 1";
        const results: any[] = await db.select(q, [token]);

        return results[0].userID as number;
    }
}

export { Sessions }
