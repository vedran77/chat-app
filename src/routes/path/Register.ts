import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { Hash } from "../../Hash";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Register extends RouteBase implements IRoute {
    protected _path: string = "/register";

    public async handle(req: any, res: any): Promise<void> {
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const password: string = Hash.createHash(req.body.password);
        const email: string = req.body.email;

        const db: IDatabase = Container.instance.get("database");
        const q: string = "INSERT INTO users (first_name, last_name, password, email) VALUES (?, ?, ?, ?)";

        await db.insert(q, [firstName, lastName, password, email]);
        
        
    }
}

export { Register };
