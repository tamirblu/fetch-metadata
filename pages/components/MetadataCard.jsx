import styles from '../styles/MetadataCard.module.css';
import homeStyles from '../styles/Home.module.css';

/**
 * MetadataCard component to display metadata information.
 */
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
