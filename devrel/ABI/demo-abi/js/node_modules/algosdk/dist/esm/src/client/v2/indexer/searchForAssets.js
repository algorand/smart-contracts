import JSONRequest from '../jsonrequest';
export default class SearchForAssets extends JSONRequest {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/assets';
    }
    // limit for filter, as int
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // asset creator address for filter, as string
    creator(creator) {
        this.query.creator = creator;
        return this;
    }
    // asset name for filter, as string
    name(name) {
        this.query.name = name;
        return this;
    }
    // asset unit name for filter, as string
    unit(unit) {
        this.query.unit = unit;
        return this;
    }
    // asset ID for filter, as int
    index(index) {
        this.query['asset-id'] = index;
        return this;
    }
    // used for pagination
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    // include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
//# sourceMappingURL=searchForAssets.js.map