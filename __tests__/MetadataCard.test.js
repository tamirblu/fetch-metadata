import { render, screen } from '@testing-library/react';
import MetadataCard from '../components/MetadataCard';

describe('MetadataCard', () => {
    const mockData = {
        title: 'Example Title',
        description: 'Example description for the website.',
        image: 'http://example.com/image.jpg'
    };

    it('displays metadata correctly', () => {
        render(<MetadataCard title={mockData.title} description={mockData.description} image={mockData.image} />);

        expect(screen.getByText(mockData.title)).toBeInTheDocument();
        expect(screen.getByText(mockData.description)).toBeInTheDocument();
        expect(screen.getByAltText(mockData.title)).toHaveAttribute('src', mockData.image);
    });
});
