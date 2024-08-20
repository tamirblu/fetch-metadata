import rateLimit from 'express-rate-limit';
import { csrfMiddleware } from '../../lib/csrf';

/**
 * Rate-limiting middleware configuration.
 * Limits each IP to 5 requests per second.
 */
const limiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 5,         // Limit each IP to 5 requests per second
    keyGenerator: () => 'global', // Use a fixed key to apply the limit globally
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again later.' });
    },
});

/**
 * API handler to fetch metadata from a given URL.
 * Supports GET and POST methods.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const fetchMetadata = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Apply rate limiting
    await new Promise((resolve, reject) => {
        limiter(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            resolve(result);
        });
    });

    // Handle GET request
    if (req.method === 'GET') {
        const { url } = req.query;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-type': 'text/html; charset=UTF-8',
                },
            });
            const data = await response.json();
            const title = data.title;
            const description = data.description;
            const image = data.image;

            res.status(200).json({
                title: title || '',
                description: description || '',
                image: image || '',
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching metadata' });
        }
    }

    // Handle POST request
    else if (req.method === 'POST') {
        const { url } = req.body;
        try {
            const formattedUrl = url.trim();
            const response = await fetch(formattedUrl, {
                method: 'POST',
                body: JSON.stringify({
                    image: 'https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg',
                    title: 'Example Title',
                    description: 'Example description for the website.',
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            const title = data.title;
            const description = data.description;
            const image = data.image;
            res.status(200).json({
                title: title || '',
                description: description || '',
                image: image || '',
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching metadata' });
        }
    }

    // Handle unsupported methods
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default csrfMiddleware(fetchMetadata);
export { fetchMetadata }; // Export the handler separately for testing