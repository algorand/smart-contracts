"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const request = __importStar(require("superagent"));
const url_parse_1 = __importDefault(require("url-parse"));
const utils = __importStar(require("../utils/utils"));
const intDecoding_1 = __importDefault(require("../types/intDecoding"));
function createJSONParser(options) {
    return (res, 
    // eslint-disable-next-line no-unused-vars
    fnOrStr
    // eslint-disable-next-line consistent-return
    ) => {
        if (typeof fnOrStr === 'string') {
            // in browser
            return fnOrStr && utils.parseJSON(fnOrStr, options);
        }
        // in node
        // based off https://github.com/visionmedia/superagent/blob/1277a880c32191e300b229e352e0633e421046c8/src/node/parsers/json.js
        res.text = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            res.text += chunk;
        });
        res.on('end', () => {
            let body;
            let err;
            try {
                body = res.text && utils.parseJSON(res.text, options);
            }
            catch (err_) {
                err = err_;
                // issue #675: return the raw response if the response parsing fails
                err.rawResponse = res.text || null;
                // issue #876: return the http status code if the response parsing fails
                err.statusCode = res.status;
            }
            finally {
                fnOrStr(err, body);
            }
        });
    };
}
/**
 * Remove falsy values or values with a length of 0 from an object.
 * @param obj
 */
function removeFalsyOrEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // eslint-disable-next-line no-param-reassign
            if (!obj[key] || obj[key].length === 0)
                delete obj[key];
        }
    }
    return obj;
}
/**
 * getAcceptFormat returns the correct Accept header depending on the
 * requested format.
 * @param query
 */
function getAcceptFormat(query) {
    if (query !== undefined &&
        Object.prototype.hasOwnProperty.call(query, 'format')) {
        switch (query.format) {
            case 'msgpack':
                return 'application/msgpack';
            case 'json':
            default:
                return 'application/json';
        }
    }
    else
        return 'application/json';
}
class HTTPClient {
    constructor(tokenHeader, baseServer, port, defaultHeaders = {}) {
        this.defaultHeaders = defaultHeaders;
        this.intDecoding = intDecoding_1.default.DEFAULT;
        const baseServerURL = new url_parse_1.default(baseServer, {});
        if (typeof port !== 'undefined') {
            baseServerURL.set('port', port.toString());
        }
        if (baseServerURL.protocol.length === 0) {
            throw new Error('Invalid base server URL, protocol must be defined.');
        }
        this.baseURL = baseServerURL;
        this.defaultHeaders = defaultHeaders;
        this.tokenHeader = tokenHeader;
    }
    /**
     * Compute the URL for a path relative to the instance's address
     * @param relativePath - A path string
     * @returns A URL string
     */
    addressWithPath(relativePath) {
        const address = new url_parse_1.default(path_1.default.posix.join(this.baseURL.pathname, relativePath), this.baseURL);
        return address.toString();
    }
    /**
     * Send a GET request.
     * @param {string} relativePath The path of the request.
     * @param {object} query An object containing the query paramters of the request.
     * @param {object} requestHeaders An object containing additional request headers to use.
     * @param {object} jsonOptions Options object to use to decode JSON responses. See
     *   utils.parseJSON for the options available.
     * @returns Response object.
     */
    async get(relativePath, query, requestHeaders = {}, jsonOptions = {}) {
        const format = getAcceptFormat(query);
        let r = request
            .get(this.addressWithPath(relativePath))
            .set(this.tokenHeader)
            .set(this.defaultHeaders)
            .set(requestHeaders)
            .set('Accept', format)
            .query(removeFalsyOrEmpty(query));
        if (format === 'application/msgpack') {
            r = r.responseType('arraybuffer');
        }
        else if (format === 'application/json' &&
            Object.keys(jsonOptions).length !== 0) {
            if (utils.isNode()) {
                // in node, need to set buffer
                r = r.buffer(true);
            }
            r = r.parse(createJSONParser(jsonOptions));
        }
        const res = await r;
        if (Buffer.isBuffer(res.body)) {
            // In node res.body will be a Buffer, but in the browser it will be an ArrayBuffer
            // (thanks superagent...), so convert it to an ArrayBuffer for consistency.
            const underlyingArrayBuffer = res.body.buffer;
            const start = res.body.byteOffset;
            const end = start + res.body.byteLength;
            res.body = underlyingArrayBuffer.slice(start, end);
        }
        return res;
    }
    async post(relativePath, data, requestHeaders = {}) {
        return request
            .post(this.addressWithPath(relativePath))
            .set(this.tokenHeader)
            .set(this.defaultHeaders)
            .set(requestHeaders)
            .send(data);
    }
    async delete(relativePath, data, requestHeaders = {}) {
        return request
            .delete(this.addressWithPath(relativePath))
            .set(this.tokenHeader)
            .set(this.defaultHeaders)
            .set(requestHeaders)
            .send(data);
    }
}
exports.default = HTTPClient;
//# sourceMappingURL=client.js.map