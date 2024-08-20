import { useState } from 'react';
import DOMPurify from 'dompurify';
import styles from '../styles/URLForm.module.css';

const URLForm = ({ onSubmit }) => {
    const [urls, setUrls] = useState(['']);
    const [error, setError] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple URL validation before submitting
        // if (urls.some((url, index) => !url.trim() && index !== urls.length - 1)) {
        //     setError('Please fill out all URL fields.');
        //     return;
        // }
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
