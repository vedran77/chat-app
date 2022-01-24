import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { Hash } from "../../Hash";
import { Sessions } from "../../Sessions";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Register extends RouteBase implements IRoute {
    protected _path: string = "/register";

    public async handle(req: any, res: any): Promise<void> {
        // data
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const password: string = Hash.createHash(req.body.password);
        const email: string = req.body.email;

        // db
        const db: IDatabase = Container.instance.get("database");
        
        // is email alreday exists
        let q: string = "SELECT email FROM users WHERE email = ? LIMIT 1";
        const results: any[] = await db.select(q, [email]);

        if (results.length > 0) {
            res.send({
                msg: "Email alreday exists"
            });

            return;
        }

        // database insert
        q = "INSERT INTO users (first_name, last_name, password, email) VALUES (?, ?, ?, ?)";
        const userID: number = await db.insert(q, [firstName, lastName, password, email]);
        
        // creating session
        const token: string = Sessions.instance.createSession(userID);
        
        res.send({
            token,
        });
    }
}

export { Register };
