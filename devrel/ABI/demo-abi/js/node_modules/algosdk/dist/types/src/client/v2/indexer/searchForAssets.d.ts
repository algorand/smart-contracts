import JSONRequest from '../jsonrequest';
export default class SearchForAssets extends JSONRequest {
    path(): string;
    limit(limit: number): this;
    creator(creator: string): this;
    name(name: string): this;
    unit(unit: string): this;
    index(index: number): this;
    nextToken(nextToken: string): this;
    includeAll(value?: boolean): this;
}
