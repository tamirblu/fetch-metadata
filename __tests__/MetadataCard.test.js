import { render, screen } from '@testing-library/react';
import MetadataCard from '../pages/components/MetadataCard';
import '@testing-library/jest-dom';

// TEST:
// - The MetadataCard component should render the title, description, and image.
describe('MetadataCard', () => {
    test('renders title, description, and image', () => {
        const title = 'Test Title';
        const description = 'Test Description';
        const image = 'test-image.jpg';

        render(<MetadataCard title={title} description={description} image={image} />);

        // Check if the title is rendered
        expect(screen.getByText(title)).toBeInTheDocument();

        // Check if the description is rendered
        expect(screen.getByText(description)).toBeInTheDocument();

        // Check if the image is rendered with the correct src and alt attributes
        const imgElement = screen.getByAltText(title);
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', image);
    });

    test('renders without image', () => {
        const title = 'Test Title';
        const description = 'Test Description';

        render(<MetadataCard title={title} description={description} />);

        // Check if the title is rendered
        expect(screen.getByText(title)).toBeInTheDocument();

        // Check if the description is rendered
        expect(screen.getByText(description)).toBeInTheDocument();

        // Check if the image is not rendered
        expect(screen.queryByRole('img')).toBeNull();
    });
});
