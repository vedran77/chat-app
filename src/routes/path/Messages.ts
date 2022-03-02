import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { Sessions } from "../../Sessions";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Messages extends RouteBase implements IRoute {
    protected _path: string = "/messages";
    
    public async handle(req: any, res: any): Promise<void> {
        const db: IDatabase = Container.instance.get("database");
        const userID: number = await Sessions.instance.getUserId(req.body.token);
        const q: string = `
            SELECT users.image, messages.content, messages.sender, messages.sent_at, messages.un_readed \ 
            FROM messages \ 
            INNER JOIN users \ 
            ON (messages.sender = users.ID AND messages.receiver = ?) \ 
            OR (messages.receiver = users.ID AND messages.sender = ?) \ 
            WHERE (messages.sender = ? OR messages.receiver = ?) \ 
            ORDER BY messages.sent_at ASC;
        `;

        const results: any[] = await db.select(q, [userID, userID, userID, userID]);

        const messages: any[] = [];

        for (const message of results) {
            messages.push({
                text: message.content,
                sentByUser: message.sender === userID ? true : false,
                unreaded: message.un_readed > 0 ? true : false,
                image: message.image,
            });
        }

        res.send({
            messages
        });
    }
}

export { Messages }
