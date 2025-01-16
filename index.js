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
        const decoded = jwt.verify(token, "q_eDBUycOORX7vLYLhaHPhHBQsOJj4ln_qGcpnpzM_SDrXt41xQL-4Yoc7SkJRQQKpPEoWqk0qnE4kl4QtgUuc0e6XwFxjfIZS9Pk7ll4vrogp1oC7OVkbhKgKC9zzazcljeO9pJa6yYEfY35WJ2YLRvbl7PtqLM8Jtrpnb8rZ6mYZRmgIIDvdOScj8gX8vTQVcPWPDqwnTiPQTxmSZKkUTIbXo_7wDyEZaEDnrdIlhcESixLelRYAtrbh8ZFbIFwym_5hJAr8lZHj-hK-eXYYG9RlvbZOBXJ6Uwt8e2Q8b1quWl0RtJ_JU8FtLq8iCL3Q-gIw3mvO7E7VxPk-DdrQ"); // Replace with your public key or use jwks-rsa
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
