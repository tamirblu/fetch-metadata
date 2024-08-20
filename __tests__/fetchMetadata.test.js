import httpMocks from 'node-mocks-http';
import { fetchMetadata } from '../pages/api/fetchMetadata';

jest.mock('express-rate-limit', () => jest.fn(() => jest.fn((req, res, next) => next())));
jest.mock('../lib/csrf');

// TEST CASES:
// - OPTIONS request
// - GET request
// - POST request
// - Error fetching metadata
// - Unsupported method
describe('fetchMetadata API handler', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    it('should handle OPTIONS requests', async () => {
        req.method = 'OPTIONS';

        await fetchMetadata(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe('');
    });

    it('should handle GET requests and fetch metadata', async () => {
        req.method = 'GET';
        req.query = { url: 'https://example.com' };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    title: 'Test Title',
                    description: 'Test Description',
                    image: 'https://example.com/image.jpg',
                }),
            })
        );

        await fetchMetadata(req, res);

        expect(res.statusCode).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data).toEqual({
            title: 'Test Title',
            description: 'Test Description',
            image: 'https://example.com/image.jpg',
        });
    });

    it('should handle POST requests and fetch metadata', async () => {
        req.method = 'POST';
        req.body = { url: 'https://example.com' };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    title: 'Example Title',
                    description: 'Example description for the website.',
                    image: 'https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg',
                }),
            })
        );

        await fetchMetadata(req, res);

        expect(res.statusCode).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data).toEqual({
            title: 'Example Title',
            description: 'Example description for the website.',
            image: 'https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg',
        });
    });


    it('should return 500 on fetch error', async () => {
        req.method = 'GET';
        req.query = { url: 'https://example.com' };

        global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')));

        await fetchMetadata(req, res);

        expect(res.statusCode).toBe(500);
        const data = JSON.parse(res._getData());
        expect(data).toEqual({ message: 'Error fetching metadata' });
    });

    it('should return 405 for unsupported methods', async () => {
        // Unsupported method
        req.method = 'PUT';

        await fetchMetadata(req, res);

        expect(res.statusCode).toBe(405);
        const data = JSON.parse(res._getData());
        expect(data).toEqual({ message: 'Method not allowed' });
    });
});
