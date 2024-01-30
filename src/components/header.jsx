import { Link } from 'react-router-dom';
import './header.css'; 

const header = () => {
    return (  
        <>
            <header>
                <div className="img-header">
                    <img className="logo-header" src="/logo-1.png" alt="" />
                    <img className="sgh-text" src="/text-sgh.png" alt="" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/search">SEARCH RECORD</Link></li>
                        <li>VIEW RECORD</li>
                        <li>ADD RECORD</li>
                        <li>ARCHIVE RECORD</li>
                        <li>ACTIVITY LOG</li>
                        <li>PAYROLL</li>
                        <li className="logout"><Link to="/">LOGOUT</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    );
}
 
export default header;