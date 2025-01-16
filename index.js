const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
    const token = event.headers.Authorization?.split(" ")[1];

    if (!token) {
        return {
            statusCode: 401,
            body: "Unauthorized: No token provided",
        };
    }

    try {
        // Verify token with Cognito's public key
        const decoded = jwt.verify(token, "YOUR_COGNITO_PUBLIC_KEY"); // Replace with your public key or use jwks-rsa
        return {
            statusCode: 200,
            body: `Hello, ${decoded.email || "User"}!`,
        };
    } catch (err) {
        return {
            statusCode: 401,
            body: "Unauthorized: Invalid token",
        };
    }
};
