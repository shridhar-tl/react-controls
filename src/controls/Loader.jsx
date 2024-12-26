import './Loader.scss';

function Loader({ size = 100, type = 'multi-square-spin', progress }) {
    return (
        <div className="loader-container">
            <div className={type} style={{ width: `${size}px`, height: `${size}px` }} />
            {typeof progress === 'number' && (
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ '--progress': `${progress}%` }} />
                </div>
            )}
        </div>
    );
}

export default Loader;