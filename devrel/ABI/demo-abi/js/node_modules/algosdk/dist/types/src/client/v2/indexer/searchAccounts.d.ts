import JSONRequest from '../jsonrequest';
export default class SearchAccounts extends JSONRequest {
    path(): string;
    currencyGreaterThan(greater: number): this;
    currencyLessThan(lesser: number): this;
    limit(limit: number): this;
    assetID(id: number): this;
    nextToken(nextToken: string): this;
    round(round: number): this;
    authAddr(authAddr: string): this;
    applicationID(applicationID: number): this;
    includeAll(value?: boolean): this;
}
