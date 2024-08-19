import { useState } from 'react';
import axios from 'axios';
import URLForm from '../components/URLForm';
import MetadataCard from '../components/MetadataCard';
import styles from '../styles/Home.module.css';


export default function Home() {
    const [metadata, setMetadata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [badUrls, setBadUrls] = useState([]);
    const test = 'https://jsonplaceholder.typicode.com/posts';

    const handleFetchMetadata = async (urls) => {
        setLoading(true);
        setError(null);
        setMetadata([]);
        setBadUrls([]);

        try {
            await Promise.all(
                urls.map(async (url) => {
                    try {
                        let response;
                        if (url.trim() === test) {
                            response = await axios.post('/api/fetch-metadata', { url });
                        } else {
                            response = await axios.get('/api/fetch-metadata', { params: { url } });
                        }
                        setMetadata((prevMetadata) => [...prevMetadata, response.data]);
                    } catch (err) {
                        if (err.response && err.response.status === 429) {
                            setError('We are facing too many requests, please try again later.');
                        } else {
                            setBadUrls((prevBadUrls) => [...prevBadUrls, url]);
                            setError('Failed to fetch some metadata. Please check your URLs or try again.');
                        }
                    }
                })
            );
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.headline}>
            <h1 className={styles.header}>Metadata Fetcher</h1>
            {<small style={{color : "purple"}}>Use this URL for a quick check - {test}</small>}
            <div className={styles.container}>
                <div className = {styles.childURL}>
                    <URLForm onSubmit={handleFetchMetadata} />
                    {loading && <p className={styles.loading}>Loading...</p>}
                    {error &&

                        <div >
                            <p className={styles.error}>{error}</p>
                            {badUrls.length > 0 && (
                                <small>The problem occurred with the following URLs:</small>                                )}
                            {badUrls.map((url, index) => (
                                <p key={index}>- {url}</p>
                            ))}
                        </div>
                    }
                </div>

                <div className = {styles.childFetch}>
                    {metadata.map((data, index) => (
                        console.log(data),
                        <MetadataCard
                            key={index}
                            title={data.title}
                            description={data.description}
                            image={data.image}
                            className={styles.metadataCard}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}