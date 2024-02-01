import { Link } from 'react-router-dom';
import './header.css'; 
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const header = () => {
    const handleLogOut = () => {
        signOut(auth)
            .then(() => console.log("Sign Out"))
            .catch((error) => console.log(error));
    };

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
                        <li><Link to="/ViewRecord">VIEW RECORD</Link></li>
                        <li>ADD RECORD</li>
                        <li>ARCHIVE RECORD</li>
                        <li>ACTIVITY LOG</li>
                        <li>PAYROLL</li>
                        <li className="logout" onClick={handleLogOut}>LOGOUT</li>
                    </ul>
                </nav>
            </header>
        </>
    );
}
 
export default header;