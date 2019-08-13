"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = tslib_1.__importDefault(require("request"));
const url_1 = require("url");
const BitmexAuth_1 = require("../common/BitmexAuth");
class BitmexAbstractAPI {
    constructor(options = {}) {
        this.ratelimit = null;
        const proxy = options.proxy || '';
        this.host = !!options.testnet ?
            `${proxy}https://testnet.bitmex.com` : `${proxy}https://www.bitmex.com`;
        this.apiKeyID = options.apiKeyID || null;
        this.apiKeySecret = options.apiKeySecret || null;
    }
    getRateLimitTimeout() {
        const rate = this.ratelimit;
        return rate != null && rate.remaining <= 0 ? Math.max(rate.reset - new Date().valueOf(), 0) : 0;
    }
    request(method, endpoint, opts, auth = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (opts.qs && Object.keys(opts.qs).length === 0) {
                delete opts.qs;
            }
            if (opts.form && Object.keys(opts.form).length === 0) {
                delete opts.form;
            }
            const url = `${this.host}${this.basePath}${endpoint}`;
            const path = url_1.parse(url).pathname || '';
            const headers = auth ? BitmexAuth_1.getAuthHeaders({
                apiKeyID: this.apiKeyID,
                apiKeySecret: this.apiKeySecret,
                method,
                path,
                opts
            }) : {};
            const options = Object.assign({ method,
                url,
                headers, json: true }, opts);
            const timeout = this.getRateLimitTimeout();
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    request_1.default(options, (error, response, body) => {
                        if (error) {
                            return reject(error);
                        }
                        this.ratelimit = {
                            limit: parseInt(response.headers['x-ratelimit-limit'], 10),
                            remaining: parseInt(response.headers['x-ratelimit-remaining'], 10),
                            reset: parseInt(response.headers['x-ratelimit-reset'], 10) * 1000
                        };
                        if (body.error) {
                            return reject(body.error);
                        }
                        resolve(body);
                    });
                }, timeout);
            });
        });
    }
}
exports.BitmexAbstractAPI = BitmexAbstractAPI;
