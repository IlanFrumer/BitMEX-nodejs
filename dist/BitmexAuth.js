"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const querystring_1 = require("querystring");
let nonceCounter = 0;
function getAuthHeaders(credentials, verb, path, opts) {
    if (opts.qs) {
        path += '?' + querystring_1.stringify(opts.qs);
    }
    const data = opts.form ? querystring_1.stringify(opts.form) : '';
    const nonce = Date.now() * 1000 + (nonceCounter++ % 1000); // prevents colliding nonces. Otherwise, use expires
    const signature = crypto_1.createHmac('sha256', credentials.apiKeySecret).update(verb + path + nonce + data).digest('hex');
    return {
        'api-expires': nonce,
        'api-key': credentials.apiKeyID,
        'api-signature': signature
    };
}
exports.getAuthHeaders = getAuthHeaders;
