import './Loader.scss';

function Loader({ size = 100, type = 'multi-square-spin' }) {
    return (<div className="loader-container">
        <div className={type} style={{ width: `${size}px`, height: `${size}px` }} />
    </div>);
}

export default Loader;