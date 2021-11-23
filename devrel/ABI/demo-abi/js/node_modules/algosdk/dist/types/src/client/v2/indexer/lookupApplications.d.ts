import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupApplications extends JSONRequest {
    private index;
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number);
    path(): string;
    includeAll(value?: boolean): this;
}
