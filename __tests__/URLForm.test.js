import { render, fireEvent, screen } from '@testing-library/react';
import URLForm from '../components/URLform.jsx';

describe('URLForm', () => {
    it('renders input fields and submit button', () => {
        render(<URLForm onSubmit={jest.fn()} />);

        expect(screen.getAllByRole('textbox')).toHaveLength(3);
        expect(screen.getByRole('button', { name: /fetch metadata/i })).toBeInTheDocument();
    });

    it('shows an error if a URL field is empty on submit', () => {
        const onSubmit = jest.fn();
        render(<URLForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'http://example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /fetch metadata/i }));

        expect(screen.getByText(/please fill out all url fields/i)).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with valid URLs', () => {
        const onSubmit = jest.fn();
        render(<URLForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'http://example1.com' } });
        fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'http://example2.com' } });
        fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: 'http://example3.com' } });

        fireEvent.submit(screen.getByRole('button', { name: /fetch metadata/i }));

        expect(onSubmit).toHaveBeenCalledWith(['http://example1.com', 'http://example2.com', 'http://example3.com']);
    });
});
