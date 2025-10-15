import crypto from 'crypto';

const base64urlEncode = (strOrBuffer) => {
    const buff = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(String(strOrBuffer));
    return buff.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64urlDecode = (b64url) => {
    b64url = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = 4 - (b64url.length % 4);
    if (pad !== 4) b64url += '='.repeat(pad);
    return Buffer.from(b64url, 'base64').toString();
};

export function createSignedToken(payload = {}, secret, expiresInSec = 3600) {
    const header = { alg: 'HS256', typ: 'TOKEN' };
    const now = Math.floor(Date.now() / 1000);
    const body = Object.assign({}, payload, { iat: now, exp: now + expiresInSec });

    const headerB64 = base64urlEncode(JSON.stringify(header));
    const payloadB64 = base64urlEncode(JSON.stringify(body));
    const data = `${headerB64}.${payloadB64}`;

    const signature = crypto.createHmac('sha256', secret).update(data).digest('base64');
    const sigB64 = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${data}.${sigB64}`;
}

export function verifySignedToken(token, secret) {
    if (!token || typeof token !== 'string') throw new Error('No token');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed token');

    const [headerB64, payloadB64, sigB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const valid = crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig));
    if (!valid) throw new Error('Invalid signature');

    const payloadJson = JSON.parse(base64urlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    if (payloadJson.exp && now > payloadJson.exp) throw new Error('Token expired');

    return payloadJson;
}

export function createOpaqueTokenString(bytes = 48) {
    return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}