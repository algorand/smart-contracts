import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class AccountInformation extends JSONRequest {
    private account;
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string);
    path(): string;
}
