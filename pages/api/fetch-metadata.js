import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cheerio from 'cheerio';
import { csrfMiddleware } from '../../lib/csrf';

// Initialize rate-limiting middleware
const limiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 5,         // Limit each IP to 5 requests per second
    keyGenerator: () => 'global', // Use a fixed key to apply the limit globally
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again later.' });
    },
});
const fetchMetadata =  async function handler(req, res) {
    await new Promise((resolve, reject) => {
        limiter(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            resolve(result);
        });
    });
    if (req.method === 'POST') {
        const {urls} = req.body;

        try {
            const results  = await Promise.all(
                urls.map(async (url) => {
                // Ensure the URL is correctly formatted
                    const formattedUrl = url.trim();

                    // Fetch metadata from the URL
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
                    console.log(data);

                    return {
                        title: title || '',
                        description: description || '',
                        image: image || '',
                    };
                })
            );
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching metadata' });
        }
    }   else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
export default csrfMiddleware(fetchMetadata);