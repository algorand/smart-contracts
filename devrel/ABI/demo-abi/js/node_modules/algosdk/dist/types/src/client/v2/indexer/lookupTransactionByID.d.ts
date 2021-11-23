import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupTransactionByID extends JSONRequest {
    private txID;
    constructor(c: HTTPClient, intDecoding: IntDecoding, txID: string);
    path(): string;
}
