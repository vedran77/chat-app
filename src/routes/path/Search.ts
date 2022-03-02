import { Container } from "../../Container";
import { IDatabase } from "../../database";
import { Sessions } from "../../Sessions";
import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Search extends RouteBase implements IRoute {
    protected _path: string = "/search";
    
    public async handle(req: any, res: any): Promise<void> {
        const db: IDatabase = Container.instance.get("database");
        const userID: number = await Sessions.instance.getUserId(req.body.token);

        const q: string = `
            SELECT users.first_name, users.last_name, users.image, users.online, friends.user_one, friends.user_two, messages.content, messages.sender, messages.sent_at, messages.un_readed \ 
            FROM friends \ 
            INNER JOIN users \ 
            ON (friends.user_one = users.ID AND friends.user_two = ?) \ 
            OR (friends.user_two = users.ID AND friends.user_one = ?) \ 
            LEFT JOIN messages \ 
            ON (messages.sender = users.ID) OR (messages.receiver = users.ID) \ 
            WHERE (friends.user_one = ? \ 
            OR friends.user_two = ?) AND \ 
            CONCAT(users.first_name, ' ', users.last_name) \ 
            LIKE CONCAT(?, '%') \ 
            GROUP BY friends.user_one, friends.user_two \
            ORDER BY messages.sent_at ASC LIMIT 5`;
        
        const results: any[] = await db.select(q, [userID, userID, userID, userID, req.body.name]);

        const chats = [];
        for (const chat of results) {
            chats.push({
                name: chat.first_name + " " + chat.last_name,
                image: chat.image,
                onlineColor: chat.online === 0 ? "bg-red-800" : "bg-green-500",
                lastMessage: chat.content === null ? undefined : chat.content,
                newMessages: chat.un_readed === null ? undefined : chat.un_readed,
            });
        }

        res.send({
            chats
        });
    }
}

export { Search }
