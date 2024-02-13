import User from "../../models/User";
import ClimateCognizeService from "../../repository/climateCognizeRepository";
import { useEffect, useState } from "react";
import {useSearchParams} from 'react-router-dom';

export default function UserSettings(props) {

    const [user, setUser] = useState(new User("","",""));
    const [selectedButton, setselectedButton] = useState("Profile");
    const [searchParams, setSearchParams] = useSearchParams();

    

    useEffect(() => {
        ClimateCognizeService.getUserInfo(localStorage.getItem("currentUser")).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                setUser({username: obj['username'], name: obj['name'], surname:  obj['surname'], role: obj['role']});
            }
        });
      }, []);

    function changeProfileSettings(e) {
        e.preventDefault();
        let name = document.getElementById('firstName').value;
        let surname = document.getElementById('lastName').value;

        ClimateCognizeService.changeProfileInfo(user.username, name, surname).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                setUser({username: obj['username'], name: obj['name'], surname:  obj['surname'], role: obj['role']});
            }
        });
    }

    function changeAccountSettings(e) {
        e.preventDefault();
        let name = document.getElementById('firstName').value;
        let surname = document.getElementById('lastName').value;

        ClimateCognizeService.changeProfileInfo(user.username, name, surname).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                setUser({username: obj['username'], name: obj['name'], surname:  obj['surname'], role: obj['role']});
            }
        });
    }

    function changePasswordSettings(e) {
        e.preventDefault();
        let oldpw = document.getElementById('old-password').value;
        let newpw = document.getElementById('new-password').value;
        let confirmpw = document.getElementById('confirm-password').value;

        ClimateCognizeService.changePasswordSettings(user.username, oldpw, newpw, confirmpw).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                if(obj === "error") {
                    window.location.href="/userSettings?errorMsg=An error occurred, please try again later.";
                }
            }
        });
    }

    function  selectButton(e) {
        let allLinks = document.querySelectorAll("div#profile-menu button.list-group-item");
        for(let link of allLinks) {
            if(link == e.target) {
                link.classList.add("active");
                link.setAttribute("aria-current", true);
                setselectedButton(link.textContent);
            }
            else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        }
        
    }

    return (

        <div className="container text-start mt-5">
            <div className="row">
                <div className="col-3">
                    <div class="list-group" id="profile-menu">
                        <button type="button" class="list-group-item list-group-item-profile text-start">
                            <span className="fw-bold">{user.name + " " + user.surname}</span>
                            <br></br>
                            <small class="mt-3 d-inline-flex mb-3 px-2 py-1 fw-semibold bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{user.username}</small>

                        </button>
                        <button onClick={(e) => selectButton(e)} type="button" class="list-group-item list-group-item-action list-group-item-profile active" aria-current="true">Profile</button>
                        <button onClick={(e) => selectButton(e)} type="button" class="list-group-item list-group-item-action list-group-item-profile">Account</button>
                        <button type="button" class="list-group-item list-group-item-action list-group-item-profile">Sign out</button>
                        {/* <button type="button" class="list-group-item list-group-item-action list-group-item-profile" disabled>A disabled button item</button> */}
                    </div>
                </div>
                <div className="col-9">
                {<div className='mx-auto text-center'>
    <p className='text-danger fs-4'>{searchParams.get("errorMsg")}</p>
</div>}

                    {selectedButton === "Profile" &&
                    
                    <div className="ms-5">
                    <h5>Profile Settings</h5>

                    <form onSubmit={changeProfileSettings} method="post">


                    <div className="mt-5 mb-5 w-50">
                        <label htmlFor="firstName" className="form-label">
                            First name <span className="text-muted">(optional)</span>
                        </label>
                        <input className="form-control" type="text" name="firstName" id="firstName" defaultValue={user.name}></input>
                    </div>

                    <div className="mt-5 mb-5 w-50">
                        <label htmlFor="firstName" className="form-label">
                            Last name <span className="text-muted">(optional)</span>
                        </label>
                        <input className="form-control" type="text" name="lastName" id="lastName" defaultValue={user.surname}></input>
                    </div>

                    <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>

                    </form>






                </div>
                    
                    }

{selectedButton === "Account" &&
                    
                    <div className="ms-5">
                    <h5>Account Settings</h5>

                    <form onSubmit={changeAccountSettings} method="post">


                    <div className="mt-5 mb-5 w-50">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input style={{display: "none"}} type="text" name="old-username" id="old-username" value={user.username}></input>
                        <input className="form-control" type="text" name="username" id="username" defaultValue={user.username}></input>
                    </div>

                    {/* <div className="mt-5 mb-5 w-25">
                        <label htmlFor="firstName" className="form-label">
                            Last name <span className="text-muted">(optional)</span>
                        </label>
                        <input className="form-control" type="text" name="lastName" id="lastName" defaultValue={user.surname}></input>
                    </div> */}

                    <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>

                    </form>



                    <form onSubmit={changePasswordSettings} method="post">


                    <div className="mt-5 mb-4 w-50">
                        <label htmlFor="old-password" className="form-label">
                            Old password
                        </label>
                        <input className="form-control" type="password" name="old-password" id="old-password" placeholder="Enter old password"></input>
                    </div>

                    <div className="mt-4 mb-4 w-50">
                        <label htmlFor="new-password" className="form-label">
                            New password
                        </label>
                        <input className="form-control" type="password" name="new-password" id="new-password" placeholder="Enter new password"></input>
                    </div>

                    <div className="mt-4 mb-4 w-50">
                        <label htmlFor="confirm-password" className="form-label">
                            Confirm your new password
                        </label>
                        <input className="form-control" type="password" name="confirm-password" id="confirm-password" placeholder="Confirm new password"></input>
                    </div>

                    <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>

                    </form>

                </div>
                    
                    }


                    {/* <div className="mt-5 mb-5 w-25">
                        <label htmlFor="firstName" className="form-label">
                            Username <span className="text-muted"></span>
                        </label>
                        <input required className="form-control" type="text" name="firstName" id="firstName" value={user.username}></input>
                    </div> */}
                </div>
            </div>
        </div>

    );
}