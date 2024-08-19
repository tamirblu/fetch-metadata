// import fetchMetadata from '../fetch-metadata';
// import { createMocks } from 'node-mocks-http';
// import axios from 'axios';
//
// jest.mock('axios');
//
// describe('/api/fetch-metadata API', () => {
//     it('returns metadata for valid URLs', async () => {
//         const mockHTML = '<html><head><title>Example Title</title><meta name="description" content="Example description for the website."><meta property="og:image" content="https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"></head></html>';
//         axios.get.mockResolvedValueOnce({ data: mockHTML });
//
//         const { req, res } = createMocks({
//             method: 'POST',
//             body: {
//                 urls: ['https://jsonplaceholder.typicode.com/posts'],
//             },
//         });
//
//         await fetchMetadata(req, res);
//
//         expect(res._getStatusCode()).toBe(200);
//         expect(JSON.parse(res._getData())).toEqual([{
//             title: 'Example Title',
//             description: 'Example description for the website.',
//             image: 'https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg',
//         }]);
//     });
//
//     it('handles errors gracefully', async () => {
//         axios.get.mockRejectedValueOnce(new Error('Network error'));
//
//         const { req, res } = createMocks({
//             method: 'POST',
//             body: {
//                 urls: ['http://invalid-url.com'],
//             },
//         });
//
//         await fetchMetadata(req, res);
//
//         expect(res._getStatusCode()).toBe(500);
//         expect(JSON.parse(res._getData()).message).toBe('Error fetching metadata');
//     });
// });
import fetchMetadata from '../pages/api/fetch-metadata';
import { createMocks } from 'node-mocks-http';
import axios from 'axios';

jest.mock('axios');

describe('/api/fetch-metadata API', () => {
    it('returns metadata for valid GET request', async () => {
        const mockHTML = '<html><head><title>Test Title</title><meta name="description" content="Test description."><meta property="og:image" content="https://example.com/test.jpg"></head></html>';
        axios.get.mockResolvedValueOnce({ data: mockHTML });

        const { req, res } = createMocks({
            method: 'GET',
            query: {
                url: 'https://example.com',
            },
        });

        await fetchMetadata(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({
            title: 'Test Title',
            description: 'Test description.',
            image: 'https://example.com/test.jpg',
        });
    });
});