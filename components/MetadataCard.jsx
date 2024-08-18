const MetadataCard = ({ title, description, image }) => {
    return (
        <div style={cardStyle}>
            <img src={image} alt={title} style={imageStyle} />
            <div style={textContainerStyle}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '16px 0',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '600px'
};

const imageStyle = {
    width: '100px',
    height: '100px',
    marginRight: '16px',
    borderRadius: '8px',
    objectFit: 'cover'
};

const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column'
};

export default MetadataCard;
