interface IRoute {
    routeName(): string;
    handle(res: any, req: any, ...args: any): void;
}

export { IRoute };
