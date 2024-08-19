// const MetadataCard = ({ title, description, image }) => {
//     return (
//         <div style={cardStyle}>
//             <img src={image} alt={title} style={imageStyle} />
//             <div style={textContainerStyle}>
//                 <h3>{title}</h3>
//                 <p>{description}</p>
//             </div>
//         </div>
//     );
// };
//
// const cardStyle = {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     margin: '16px 0',
//     padding: '16px',
//     display: 'flex',
//     alignItems: 'center',
//     maxWidth: '600px'
// };
//
// const imageStyle = {
//     width: '100px',
//     height: '100px',
//     marginRight: '16px',
//     borderRadius: '8px',
//     objectFit: 'cover'
// };
//
// const textContainerStyle = {
//     display: 'flex',
//     flexDirection: 'column'
// };
//
// export default MetadataCard;

import styles from './MetadataCard.module.css';
import homeStyles from '../Home.module.css';

export default function MetadataCard({ title, description, image }) {
    return (
        <div className={homeStyles.metadataContainer}>
            <div className={styles.card}>
                {image && <img src={image} alt={title} className={styles.image} />}
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

//// components/MetadataCard.jsx
// import React from 'react';
// import styles from './MetadataCard.module.css';
// import homeStyles from '../Home.module.css';
//
// const MetadataCard = ({ metadata }) => {
//     return (
//         <div className={homeStyles.metadataContainer}>
//             {metadata.map((data, index) => (
//                 <div key={index} className={styles.card}>
//                     <img src={data.image} alt={data.title} className={styles.image} />
//                     <h2 className={styles.title}>{data.title}</h2>
//                     <p className={styles.description}>{data.description}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default MetadataCard;
