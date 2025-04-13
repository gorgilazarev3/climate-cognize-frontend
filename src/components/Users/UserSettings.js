import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';

import { LocalStorageKeys } from "../../constants/localStorageKeys";
import User from "../../models/User";
import ClimateCognizeService from "../../services/climateCognizeService";
import { SearchParams } from "../../constants/searchParams";
import { UserRoutes } from "../../constants/routes";

const UserSettings = () => {
  const [user, setUser] = useState(new User("", "", ""));
  const [selectedButton, setSelectedButton] = useState("Profile");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    ClimateCognizeService.getUserInfo(localStorage.getItem(LocalStorageKeys.CURRENT_USER)).then((resp) => {
      if (resp.status === 200) {
        let obj = resp.data;
        setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'] });
      }
    });

    let sel = searchParams.get(SearchParams.SELECTED_BUTTON);
    if (sel != null) {
      setSelectedButton(sel);
      let allLinks = document.querySelectorAll("div#profile-menu button.list-group-item");
      allLinks.forEach((link) => {
        if (link.textContent === sel) {
          link.classList.add("active");
          link.setAttribute("aria-current", true);
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      });
    }
  }, []);

  const changeProfileSettings = (e) => {
    e.preventDefault();
    const name = document.getElementById('firstName').value;
    const surname = document.getElementById('lastName').value;

    ClimateCognizeService.changeProfileInfo(user.username, name, surname).then((resp) => {
      if (resp.status === 200) {
        let obj = resp.data;
        setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'] });
      }
    });
  };

  const changeAccountSettings = (e) => {
    e.preventDefault();
    const name = document.getElementById('firstName').value;
    const surname = document.getElementById('lastName').value;

    ClimateCognizeService.changeProfileInfo(user.username, name, surname).then((resp) => {
      if (resp.status === 200) {
        let obj = resp.data;
        setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'] });
      }
    });
  };

  const changePasswordSettings = (e) => {
    e.preventDefault();
    const oldpw = document.getElementById('old-password').value;
    const newpw = document.getElementById('new-password').value;
    const confirmpw = document.getElementById('confirm-password').value;

    ClimateCognizeService.changePasswordSettings(user.username, oldpw, newpw, confirmpw).then((resp) => {
      if (resp.status === 200) {
        let obj = resp.data;
        if (obj === "error") {
          window.location.href = "/userSettings?errorMsg=An error occurred, please try again later.";
        }
      }
    });
  };

  const selectButton = (e) => {
    let allLinks = document.querySelectorAll("div#profile-menu button.list-group-item");
    allLinks.forEach((link) => {
      if (link === e.target) {
        link.classList.add("active");
        link.setAttribute("aria-current", true);
        setSelectedButton(link.textContent);
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  };

  return (
    <div className="container text-start mt-5">
      <div className="row">
        <div className="col-3">
          <div className="list-group" id="profile-menu">
            <button onClick={() => navigate(UserRoutes.USER_PROFILE)} type="button" className="list-group-item list-group-item-profile text-start">
              <span className="fw-bold">{user.name + " " + user.surname}</span>
              <br />
              <small className="mt-3 d-inline-flex mb-3 px-2 py-1 fw-semibold bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{user.username}</small>
            </button>
            <button onClick={selectButton} type="button" className="list-group-item list-group-item-action list-group-item-profile active" aria-current="true">Profile</button>
            <button onClick={selectButton} type="button" className="list-group-item list-group-item-action list-group-item-profile">Account</button>
            <button type="button" className="list-group-item list-group-item-action list-group-item-profile">Sign out</button>
          </div>
        </div>

        <div className="col-9">
          {searchParams.get(SearchParams.ERROR_MESSAGE) && (
            <div className='mx-auto text-center'>
              <p className='text-danger fs-4'>{searchParams.get(SearchParams.ERROR_MESSAGE)}</p>
            </div>
          )}

          {selectedButton === "Profile" && (
            <div className="ms-5">
              <h5>Profile Settings</h5>
              <form onSubmit={changeProfileSettings} method="post">
                <div className="mt-5 mb-5 w-50">
                  <label htmlFor="firstName" className="form-label">
                    First name <span className="text-muted">(optional)</span>
                  </label>
                  <input className="form-control" type="text" id="firstName" defaultValue={user.name}></input>
                </div>

                <div className="mt-5 mb-5 w-50">
                  <label htmlFor="lastName" className="form-label">
                    Last name <span className="text-muted">(optional)</span>
                  </label>
                  <input className="form-control" type="text" id="lastName" defaultValue={user.surname}></input>
                </div>

                <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>
              </form>
            </div>
          )}

          {selectedButton === "Account" && (
            <div className="ms-5">
              <h5>Account Settings</h5>
              <form onSubmit={changeAccountSettings} method="post">
                <div className="mt-5 mb-5 w-50">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input className="form-control" type="text" id="username" defaultValue={user.username}></input>
                </div>
                <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>
              </form>

              <form onSubmit={changePasswordSettings} method="post">
                <div className="mt-5 mb-4 w-50">
                  <label htmlFor="old-password" className="form-label">Old password</label>
                  <input className="form-control" type="password" id="old-password" placeholder="Enter old password"></input>
                </div>

                <div className="mt-4 mb-4 w-50">
                  <label htmlFor="new-password" className="form-label">New password</label>
                  <input className="form-control" type="password" id="new-password" placeholder="Enter new password"></input>
                </div>

                <div className="mt-4 mb-4 w-50">
                  <label htmlFor="confirm-password" className="form-label">Confirm your new password</label>
                  <input className="form-control" type="password" id="confirm-password" placeholder="Confirm new password"></input>
                </div>

                <button className="btn btn-app app-primary-bg-color text-light" type="submit">Save changes</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;