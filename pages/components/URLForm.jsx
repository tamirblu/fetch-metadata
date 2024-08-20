import { useState } from 'react';
import DOMPurify from 'dompurify';
import styles from '../styles/URLForm.module.css';

/**
 * URLForm component to handle user input of URLs and submit them for metadata fetching.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - The function to call when the form is submitted.
 * @returns {JSX.Element} The rendered URLForm component.
 */
const URLForm = ({ onSubmit }) => {
    const [urls, setUrls] = useState(['']);
    const [error, setError] = useState(null);

    /**
     * Handles changes to the input fields.
     *
     * @param {number} index - The index of the input field being changed.
     * @param {Object} event - The event object from the input field.
     */
    const handleChange = (index, event) => {
        const newUrls = [...urls];
        const sanitizedContent = DOMPurify.sanitize(event.target.value);

        newUrls[index] = sanitizedContent;

        if (sanitizedContent.trim()) {
            if (index === urls.length - 1) {
                newUrls.push('');
            }
        } else {
            if (index !== urls.length - 1) {
                newUrls.splice(index, 1);
            }
        }

        setUrls(newUrls);
    };

    /**
     * Handles form submission.
     *
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        onSubmit(urls.filter(url => url.trim()));  // Passing the non-empty URLs to the parent component
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {urls.map((url, index) => (
                <div key={index}>
                    <input
                        className={styles.input}
                        type="text"
                        value={url}
                        onChange={(e) => handleChange(index, e)}
                        placeholder={`Enter URL ${index + 1}`}
                    />
                </div>
            ))}
            <button className={styles.button} type="submit">Fetch Metadata</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default URLForm;