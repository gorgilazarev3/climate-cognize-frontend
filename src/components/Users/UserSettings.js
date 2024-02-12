import User from "../../models/User";
import ClimateCognizeService from "../../repository/climateCognizeRepository";
import { useEffect, useState } from "react";

export default function UserSettings(props) {

    const [user, setUser] = useState(new User("","",""));


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

    return (

        <div className="container text-start mt-5">
            <div className="row">
                <div className="col-3">

                </div>
                <div className="col-9">
                    <h5>Profile Settings</h5>

                    <form onSubmit={changeProfileSettings} method="post">

                    
                    <div className="mt-5 mb-5 w-25">
                        <label htmlFor="firstName" className="form-label">
                            First name <span className="text-muted">(optional)</span>
                        </label>
                        <input className="form-control" type="text" name="firstName" id="firstName" defaultValue={user.name}></input>
                    </div>

                    <div className="mt-5 mb-5 w-25">
                        <label htmlFor="firstName" className="form-label">
                            Last name <span className="text-muted">(optional)</span>
                        </label>
                        <input className="form-control" type="text" name="lastName" id="lastName" defaultValue={user.surname}></input>
                    </div>

                    <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>

                    </form>
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