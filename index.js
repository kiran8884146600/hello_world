const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const ISSUER_URL = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TU0wIUvWa/.well-known/jwks.json";

const client = jwksClient({
    jwksUri: `${ISSUER_URL}/.well-known/jwks.json`,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err, null);
        } else {
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        }
    });
}

exports.handler = async (event) => {
    const token = event.headers.Authorization?.split(" ")[1];
    if (!token) {
        return { statusCode: 401, body: "Unauthorized: No token provided" };
    }

    return new Promise((resolve) => {
        jwt.verify(
            token,
            getKey,
            {
                issuer: ISSUER_URL,
                algorithms: ["RS256"],
            },
            (err, decoded) => {
                if (err) {
                    resolve({ statusCode: 401, body: "Unauthorized: Invalid token" });
                } else {
                    resolve({ statusCode: 200, body: `Hello, ${decoded.email || "User"}!` });
                }
            }
        );
    });
};
