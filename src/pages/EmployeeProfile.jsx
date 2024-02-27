import { useParams } from 'react-router-dom';
import Header from '../components/header';

const EmployeeProfile = () => {
    // Access the userEmployeeID parameter from the URL
    const { userEmployeeID } = useParams();

    return ( 
        <>
            <Header />
            <h1>Employee Profile</h1>
            <p>User Employee ID: {userEmployeeID}</p>
        </>
    );
}
 
export default EmployeeProfile;