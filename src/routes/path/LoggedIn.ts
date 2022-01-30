import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class LoggedIn extends RouteBase implements IRoute {
    protected _path: string = "/loggedin";
    
    public async handle(req: any, res: any): Promise<void> {
        const db: IDatabase = Container.instance.get("database");
        const q: string = "SELECT expires FROM sessions WHERE token = ? LIMIT 1";
        const results: any[] = await db.select(q, [req.body.token]);

        let expired: boolean = false;

        if (results.length === 0) {
            expired = true;
        } else {
            const expires: number = results[0].expires;

            if (expires < Date.now()) { // token expired
                expired = true;
            }
        }

        res.send({
            expired
        });
    }
}

export { LoggedIn }
