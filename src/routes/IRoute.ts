interface IRoute {
    routeName(): string;
    handle(res: any, req: any): void;
}

export { IRoute };
