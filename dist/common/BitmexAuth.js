"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const querystring_1 = require("querystring");
// prevents colliding nonces. Otherwise, use expires
let nonceCounter = 0;
const generateNonce = () => Date.now() * 1000 + (nonceCounter++ % 1000);
function getAuthHeaders({ apiKeyID, apiKeySecret, opts, method, path }) {
    if (apiKeyID == null || apiKeySecret == null) {
        return {};
    }
    if (opts.qs) {
        path += '?' + querystring_1.stringify(opts.qs);
    }
    const data = opts.form ? querystring_1.stringify(opts.form) : '';
    const nonce = generateNonce();
    const signature = crypto_1.createHmac('sha256', apiKeySecret).update(method + path.substring(path.indexOf("/api")) + nonce + data).digest('hex');
    return {
        'api-expires': nonce,
        'api-key': apiKeyID,
        'api-signature': signature
    };
}
exports.getAuthHeaders = getAuthHeaders;
function getWSAuthQuery(apiKeyID, apiKeySecret) {
    const nonce = generateNonce();
    const signature = crypto_1.createHmac('sha256', apiKeySecret).update('GET/realtime' + nonce).digest('hex');
    return querystring_1.stringify({
        'api-nonce': nonce,
        'api-key': apiKeyID,
        'api-signature': signature
    });
}
exports.getWSAuthQuery = getWSAuthQuery;
