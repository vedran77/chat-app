import { IRoute } from "../IRoute";
import { RouteBase } from "../RouteBase";

class Login extends RouteBase implements IRoute {
    protected _path: string = "/login";
    
    public handle(req: any, res: any) {
        console.log(req, res);
    }
}

export { Login };
