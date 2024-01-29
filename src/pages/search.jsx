import { Link } from 'react-router-dom';
import './search.css'; 

const Search = () => {
    return (
        <>  
            <div className="img-header">
                <img className="logo-search" src="/logo-1.png" alt="" />
                <img className="sgh-text" src="/text-sgh.png" alt="" />
            </div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/search">Search Record</Link></li>
                        <li>View Record</li>
                        <li>Add Record</li>
                        <li>Archive Record</li>
                        <li>Activity Log</li>
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </nav>
            </header>
            
            <footer>
                <p>COPYRIGHTS © 2023 ALL RIGHTS RESERVED</p>
            </footer>
        </>
    )
}

export default Search;