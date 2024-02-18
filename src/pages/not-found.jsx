import './not-found.css'; 

const NotFound = () => {
    const goBack = () => {
        window.history.back();
    };

    return ( 
        <div className="not-found">
            <div className="container-not">
                <h2>Sorry</h2> 
                <p>That page cannot be found</p>
                <button onClick={goBack}>Go back</button>
            </div>
        </div>
    );
}
 
export default NotFound;
