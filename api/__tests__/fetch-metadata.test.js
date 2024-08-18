import fetchMetadata from '../fetch-metadata';
import { createMocks } from 'node-mocks-http';
import axios from 'axios';
import cheerio from 'cheerio';

jest.mock('axios');

describe('/api/fetch-metadata API', () => {
    it('returns metadata for valid URLs', async () => {
        const mockHTML = '<html><head><title>Test Title</title><meta name="description" content="Test description"><meta property="og:image" content="http://example.com/image.jpg"></head></html>';
        axios.get.mockResolvedValueOnce({ data: mockHTML });

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                urls: ['http://example.com'],
            },
        });

        await fetchMetadata(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual([{
            title: 'Test Title',
            description: 'Test description',
            image: 'http://example.com/image.jpg',
        }]);
    });

    it('handles errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network error'));

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                urls: ['http://invalid-url.com'],
            },
        });

        await fetchMetadata(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData()).message).toBe('Error fetching metadata');
    });
});
