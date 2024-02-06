const NotFound = () => {
    const goBack = () => {
        window.history.back();
    };

    return ( 
        <div className="not-found">
            <h2>Sorry</h2>
            <p>That page cannot be found</p>
            <button onClick={goBack}>Go back</button>
        </div>
    );
}
 
export default NotFound;
