// Home.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import Home from '../pages/index'; // Adjust the path according to your file structure
import { useRouter } from 'next/router';

// TEST:
// - The Home component should render the initial UI correctly.
// - The Home component should handle successful metadata fetch.
// - The Home component should handle error responses as excepted.

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Home Component', () => {
    let mockAxios;

    beforeEach(() => {
        mockAxios = new axiosMock(axios);
        useRouter.mockReturnValue({
            asPath: '/',
        });
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it('renders the initial UI correctly', () => {
        render(<Home />);
        expect(screen.getByText('Metadata Fetcher')).toBeInTheDocument();
        expect(screen.getByText('Use this URL for a quick check - https://jsonplaceholder.typicode.com/posts')).toBeInTheDocument();
    });

    it('handles successful metadata fetch', async () => {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        mockAxios.onPost('/api/fetchMetadata').reply(200, {
            title: 'Sample Title',
            description: 'Sample Description',
            image: 'sample-image-url',
        });

        render(<Home />);

        // Simulate entering a URL and submitting the form
        const input = screen.getByPlaceholderText(/Enter URL 1/i); // Match the actual placeholder text
        fireEvent.change(input, { target: { value: url } });
        fireEvent.submit(input);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Wait for metadata to appear
        await waitFor(() => {
            expect(screen.getByText('Sample Title')).toBeInTheDocument();
            expect(screen.getByText('Sample Description')).toBeInTheDocument();
        });
    });

    it('handles error responses gracefully', async () => {
        const url = 'https://invalid-url.com';
        mockAxios.onGet('/api/fetchMetadata').reply(500);

        render(<Home />);

        const input = screen.getByPlaceholderText(/Enter URL 1/i); // Match the actual placeholder text
        fireEvent.change(input, { target: { value: url } });
        fireEvent.submit(input);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch some metadata. Please check your URLs or try again.')).toBeInTheDocument();
            expect(screen.getByText(`- ${url}`)).toBeInTheDocument();
        });
    });
});
