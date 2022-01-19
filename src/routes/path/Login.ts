import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Login extends RouteBase implements IRoute {
    public path: string = "/login";

    public requestType: "post" | "get" = "post";
    
    public handle(req: any, res: any) {
        console.log(req, res);
    }
}

export { Login };
