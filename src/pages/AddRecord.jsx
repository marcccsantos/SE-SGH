import './AddRecord.css'; 
import Header from '../components/header';
import Footer from '../components/footer';


const AddRecord = () => {
    
    return (
        <>  
            <Header/>
                <div className="addTab">
                    <div className="add-rec">
                        <img src="add-image.png" alt="Avatar" className="add-image"/>
                        <button className="choose-img" type="submit">Choose File</button>
                        <p className="support">Supported File Types: .jpg, .png</p>

                        
                    </div>

                    <div className="add-inputs">
                        <form className="add-form">
                            <div className="container">
                                <label htmlFor="fname">First Name: </label>
                                <input 
                                    type="text" 
                                    name="fname" 
                                    id="fname"
                                    placeholder=" " 
                                    required
                                    autoComplete="given-name"
                                />

                                <label htmlFor="lname">Last Name: </label>
                                <input 
                                    type="text" 
                                    name="lname" 
                                    id="lname"
                                    placeholder=" " 
                                    required
                                    autoComplete="family-name"
                                />

                                <label htmlFor="mname">Middle Name: </label>
                                <input 
                                    type="text" 
                                    name="mname" 
                                    id="mname"
                                    placeholder=" " 
                                    required
                                    autoComplete="additional-name"
                                />

                                <label htmlFor="address">Address: </label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    id="address"
                                    placeholder=" " 
                                    required
                                    autoComplete="address" 
                                />

                                <label htmlFor="birthday">Birthday: </label>
                                <input 
                                    type="date" 
                                    name="birthday" 
                                    id="birthday" 
                                    placeholder=" "
                                    required
                                    autoComplete="bday"
                                />

                                <label htmlFor="age">Age: </label>
                                <input 
                                    type="text" 
                                    name="age" 
                                    id="age"
                                    placeholder=" "
                                    required
                                    autoComplete="age" 
                                />

                                <label htmlFor="sex">Sex: </label>
                                <select className="gender" id="sex" name="sex">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                <label htmlFor="rate">Rate/Month: </label>
                                <input 
                                    type="text" 
                                    name="rate" 
                                    id="rate"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="status">Status: </label>
                                <select className="status" id="status" name="status">
                                    <option value="regular">Regular</option>
                                    <option value="contractual">Contractual</option>
                                </select>

                                <label htmlFor="department">Department: </label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    id="department"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="position">Position: </label>
                                <input 
                                    type="text" 
                                    name="position"
                                    id="position" 
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="tin">TIN #: </label>
                                <input 
                                    type="text"
                                    name="tin" 
                                    id="tin"
                                    placeholder=" " 
                                    required
                                />

                                <label htmlFor="sss">SSS #: </label>
                                <input 
                                    type="text" 
                                    name="sss" 
                                    id="sss"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="contact">Contact #: </label>
                                <input 
                                    type="text" 
                                    name="contact" 
                                    id="contact"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="hire">Date Hired: </label>
                                <input 
                                    type="datetime-local" 
                                    name="hire" 
                                    id="hire"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="prc">PRC #: </label>
                                <input 
                                    type="text" 
                                    name="prc" 
                                    id="prc"
                                    placeholder=" "
                                    required
                                />

                                <label htmlFor="expiry">PRC Expiry: </label>
                                <input 
                                    type="date" 
                                    name="expiry" 
                                    id="expiry"
                                    placeholder=" "
                                    required
                                />   

                                <button className="save" type="save">Save</button>
                                <button className="cancel" type="save">Cancel</button>   
                            </div>  
                        </form>
                    </div>  
                </div>              
            <Footer />
        </>
    )
}

export default AddRecord;


