import { IRoute } from "./IRoute";

abstract class RouteBase implements IRoute {
    protected readonly _path: string = "";

    public handle(req: any, res: any): void {}

    public routeName(): string {
        return this._path;
    }
}

export { RouteBase }
