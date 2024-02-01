import './AddRecord.css'; 
import Header from '../components/header';
import Footer from '../components/footer';


const AddRecord = () => {
    
    return (
        <>  
            <Header/>
                <div className="AddRecordForm">
                    <div className="row-1">
                    {/*FIRST NAME*/}
                        <div className="col-1">
                            <label className="label-text">First Name: </label>
                                <input 
                                    type="text" 
                                    name="fname" 
                                    placeholder=" " 
                                    required
                                />
                        </div>
                    {/*LAST NAME*/}
                        <div className="col-2">
                            <label htmlFor="label-text">Last Name: </label>
                                <input 
                                    type="text" 
                                    name="lname" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*MIDDLE NAME*/}
                        <div className="col-3">
                            <label htmlFor="label-text">Middle Name: </label>
                                <input 
                                    type="text" 
                                    name="mname" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    </div>

                    <div className="row-2">
                    {/*ADDRESS*/}
                        <div className="col-1">
                            <label htmlFor="label-text">Address: </label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    name="address" 
                                    placeholder=" "
                                    required
                                />
                        </div>                        
                    </div>

                    <div className="row-3">
                    {/*BIRTHDAY*/}
                        <div className="col-1">
                            <label htmlFor="label-text">Birthday: </label>
                                <input 
                                    type="date" 
                                    name="birthday" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*AGE*/}
                        <div className="col-2">
                            <label htmlFor="label-text">Age: </label>
                                <input 
                                    type="text" 
                                    name="age" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*SEX*/}
                        <div className="col-3">
                            <label htmlFor="label-text">Sex:</label>
                                <input 
                                    type="radio" 
                                    id="male" 
                                    name="sex" 
                                    value="male" 
                                    checked 
                                />
                            <label for="male">Male</label>
                                <input 
                                    type="radio" 
                                    id="female" 
                                    name="sex" 
                                    value="female" 
                                />
                            <label for="female">Female</label>
                        </div>
                    {/*RATE/MONTH*/}
                        <div className="col-4">
                            <label htmlFor="label-text">Rate/Month: </label>
                                <input 
                                    type="text" 
                                    name="rate" 
                                    placeholder=" "
                                    required
                                />
                        </div>                                                         
                    </div>

                    <div className="row-4">
                    {/*STATUS*/}
                        <div className="col-1">
                            <label htmlFor="label-text">Status:</label>
                                <input 
                                    type="radio" 
                                    id="regular" 
                                    name="status" 
                                    value="regular" 
                                    checked
                                />
                            <label for="regular">Regular</label>
                                <input 
                                    type="radio" 
                                    id="contractual" 
                                    name="status" 
                                    value="contractual" 
                                />
                            <label for="contractual">Contractual</label>
                        </div>
                    </div>

                    <div className="row-5">
                    {/*DEPARTMENT*/}
                        <div className="col-1">
                            <label htmlFor="label-text">Department: </label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*POSITION*/}
                        <div className="col-2">
                            <label htmlFor="label-text">Position: </label>
                                <input 
                                type="text" 
                                name="position" 
                                placeholder=" "
                                required
                            />
                        </div>      
                    </div>

                    <div className="row-6">
                    {/*TIN #*/}
                        <div className="col-1">
                            <label htmlFor="label-text">TIN #: </label>
                                <input 
                                    type="text"
                                    name="tin" 
                                    placeholder=" " 
                                    required
                                />
                        </div>
                    {/*SSS #*/}
                        <div className="col-2">
                            <label htmlFor="label-text">SSS #: </label>
                                <input 
                                    type="text" 
                                    name="sss" 
                                    placeholder=" "
                                    required
                                />
                        </div>                        
                    </div>

                    <div className="row-7">
                    {/*Contact #*/}
                        <div className="col-1">
                            <label htmlFor="label-text">Contact #: </label>
                                <input 
                                    type="text" 
                                    name="contact" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*DATE HIRED*/}
                        <div className="col-2">
                            <label htmlFor="label-text">Date Hired: </label>
                                <input 
                                    type="datetime-local" 
                                    name="hire" 
                                    placeholder=" "
                                    required
                                />
                        </div>                                                   
                    </div>

                    <div className="row-8">
                    {/*PRC #*/}
                        <div className="col-1">
                            <label htmlFor="label-text">PRC #: </label>
                                <input 
                                    type="text" 
                                    name="prc" 
                                    placeholder=" "
                                    required
                                />
                        </div>
                    {/*PRC Expiry*/}
                        <div className="col-2">
                            <label htmlFor="label-text">PRC Expiry: </label>
                                <input 
                                    type="date" 
                                    name="expiry" 
                                    placeholder=" "
                                    required
                                />   
                        </div>                                                
                    </div>

                    <button className="save" type="save">
                        <div className="save-text">Save</div>
                    </button>
                    <button className="cancel" type="save">
                        <legend>Cancel</legend>
                    </button>
                </div>

                <div>
                    <div class="add-image-container row-1">
                        <img src="add-image.png" alt="Avatar" class="add-image"/>
                        <div class="overlay">
                            <img src="drop-img.png" alt="Add image" class="add-image-plus"/>
                            <div class="drag-here">Drag & Drop Image Here</div>
                        </div>
                    </div>    
                        <button className="choose-img" type="submit">
                            <legend>Choose File</legend>
                        </button>
                        <p className="support">Supported File Types: .jpg, .png</p>
                </div>
        <Footer />
        </>
    )
}

export default AddRecord;


