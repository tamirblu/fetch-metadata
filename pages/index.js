import { useState } from 'react';
import axios from 'axios';
import URLForm from '../components/URLForm';
import MetadataCard from '../components/MetadataCard';
import styles from '../Home.module.css';

// export default function Home() {
//     const [metadata, setMetadata] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const handleFetchMetadata = async (urls) => {
//         setLoading(true);
//         setError(null);
//         setMetadata([]);
//
//         try {
//             const response = await axios.post('/api/fetch-metadata', { urls }, {
//                 method: 'POST',
//                 }
//
//             );
//             setMetadata(response.data);
//             console.log(response.data);
//         } catch (err) {
//             if (err.response.status === 429) {
//                 console.log('inside error 429');
//                 setError('We facing too many requests, please try again later.');
//             }
//             else{
//                 setError('Failed to fetch metadata. Please check your URLs or try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//     return (
//         <div>
//             <h1>Metadata Fetcher</h1>
//             <URLForm onSubmit={handleFetchMetadata} />
//             {loading && <p>Loading...</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//
//             <div>
//                 {metadata.map((data, index) => (
//                     <MetadataCard
//                         key={index}
//                         title={data.title}
//                         description={data.description}
//                         image={data.image}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }


export default function Home() {
    const [metadata, setMetadata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchMetadata = async (urls) => {

        setLoading(true);
        setError(null);
        setMetadata([]);

        try {
            const response = await axios.post('/api/fetch-metadata', { urls }, {
                method: 'POST',
            });
            setMetadata(response.data);
            console.log(response.data);
        } catch (err) {
            if (err.response.status === 429) {
                console.log('inside error 429');
                setError('We are facing too many requests, please try again later.');
            } else {
                setError('Failed to fetch metadata. Please check your URLs or try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.headline}>
            <h1 className={styles.header}>Metadata Fetcher</h1>
            <div className={styles.container}>
                <div className = {styles.childURL}>
                    <URLForm onSubmit={handleFetchMetadata} />
                    {loading && <p className={styles.loading}>Loading...</p>}
                    {error && <p className={styles.error}>{error}</p>}
                </div>
                <div className = {styles.childFetch}>
                    {metadata.map((data, index) => (
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