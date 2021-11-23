import JSONRequest from '../jsonrequest';
export default class LookupBlock extends JSONRequest {
    constructor(c, intDecoding, round) {
        super(c, intDecoding);
        this.round = round;
        this.round = round;
    }
    path() {
        return `/v2/blocks/${this.round}`;
    }
}
//# sourceMappingURL=lookupBlock.js.map