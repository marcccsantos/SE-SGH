import './not-found.css'; 

const NotFound = () => {
    const goBack = () => {
        window.history.back();
    };

    return ( 
        <div className="not-found">
            <img className="broken-hand" src="/broken-hand.png" alt="" />
            <div className="container-not">
                <div className="err">404 error </div>
                <div className="err-text">The page you are looking for was moved, removed, renamed, or might never existed.</div>
                <button className="button-err" onClick={goBack}>Go Back</button>
            </div>
        </div>
    );
}
 
export default NotFound;
