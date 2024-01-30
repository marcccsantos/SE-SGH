import { Link } from 'react-router-dom';
import './header.css'; 

const header = () => {
    return (  
        <>
            <div className="img-header">
                <img className="logo-header" src="/logo-1.png" alt="" />
                <img className="sgh-text" src="/text-sgh.png" alt="" />
            </div>
            <header>
                {/*<nav>
                    <ul>
                        <li><Link to="/search">Search Record</Link></li>
                        <li>View Record</li>
                        <li>Add Record</li>
                        <li>Archive Record</li>
                        <li>Activity Log</li>
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </nav>*/}
            </header>
        </>
    );
}
 
export default header;