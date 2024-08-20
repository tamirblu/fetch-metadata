import rateLimit from 'express-rate-limit';
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Respond to preflight requests with a 200 status
        return res.status(200).end();
    }

    await new Promise((resolve, reject) => {
        limiter(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            resolve(result);
        });
    });

    if (req.method === 'GET') {
        const { url } = req.query;

        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const title = $('head title').text();
            const description = $('meta[name="description"]').attr('content');
            const image = $('meta[property="og:image"]').attr('content');

            res.status(200).json({
                title: title || '',
                description: description || '',
                image: image || '',
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching metadata' });
        }
    }

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
            const description = data.description
            const image = data.image;
            console.log(data);
            res.status(200).json({
                title: title || '',
                description: description || '',
                image: image || '',
            });


        }catch (error) {
            res.status(500).json({ message: 'Error fetching metadata' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
export default csrfMiddleware(fetchMetadata);