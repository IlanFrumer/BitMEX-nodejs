"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BitmexAuth_1 = require("./BitmexAuth");
const url_1 = require("url");
const request_1 = tslib_1.__importDefault(require("request"));
class BitmexAbstractAPI {
    constructor(credentials) {
        this.credentials = credentials;
        this.ratelimit = null;
    }
    getRateLimitDelay() {
        const rate = this.ratelimit;
        return rate != null && rate.remaining <= 0 ? Math.max(rate.reset - new Date().valueOf(), 0) : 0;
    }
    request(method, endpoint, opts, auth = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `${this.basePath}${endpoint}`;
            const path = url_1.parse(url).pathname || '';
            const headers = auth && this.credentials ? BitmexAuth_1.getAuthHeaders(this.credentials, method, path, opts) : {};
            const options = Object.assign({ method,
                url,
                headers, json: true }, opts);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    request_1.default(options, (error, response, body) => {
                        if (error)
                            return reject(error);
                        this.ratelimit = {
                            limit: parseInt(response.headers['x-ratelimit-limit']),
                            remaining: parseInt(response.headers['x-ratelimit-remaining']),
                            reset: parseInt(response.headers['x-ratelimit-reset']) * 1000
                        };
                        if (body.error)
                            return reject(body.error);
                        resolve(body);
                    });
                }, this.getRateLimitDelay());
            });
        });
    }
}
exports.BitmexAbstractAPI = BitmexAbstractAPI;
