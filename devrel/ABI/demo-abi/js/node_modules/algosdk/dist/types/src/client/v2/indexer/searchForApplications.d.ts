import JSONRequest from '../jsonrequest';
export default class SearchForApplications extends JSONRequest {
    path(): string;
    index(index: number): this;
    nextToken(next: string): this;
    limit(limit: number): this;
    includeAll(value?: boolean): this;
}
