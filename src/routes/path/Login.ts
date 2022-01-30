import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { Hash } from "../../Hash";
import { Sessions } from "../../Sessions";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Login extends RouteBase implements IRoute {
    protected _path: string = "/login";
    
    public async handle(req: any, res: any): Promise<void> {
        const email: string = req.body.email;
        const password: string = Hash.createHash(req.body.password);

        const db: IDatabase = Container.instance.get("database");
        const q: string = "SELECT ID, first_name, last_name, email, password FROM users WHERE email = ? AND password = ? LIMIT 1";

        const results: any[] = await db.select(q, [email, password]);

        if (results.length > 0) {
            const token: string = Sessions.instance.createSession(results[0].ID);
            res.send({
                firstName: results[0].first_name,
                lastName: results[0].last_name,
                token,
            });
        } else {
            res.send({
                msg: "incorrect data"
            });
        }
    }
}

export { Login };
