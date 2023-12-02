import React from 'react';
import '../App/App.css';
import {Link} from 'react-router-dom';
const Header = (props) => {

  let authenticate;
  if (localStorage.getItem("JWT")) {
      authenticate = (<div><p className='pe-3 fw-bold app-dark-color d-inline'>{localStorage.getItem("currentUser")}</p> <button className="btn app-primary-bg-color btn-app my-2 my-sm-0"
                              onClick={() => {
                                localStorage.removeItem("JWT")
                                localStorage.removeItem("currentUser")
                                localStorage.removeItem("userRole")
                                window.location.reload();
                                }}>Logout</button></div>);
  } else {
      authenticate = (          <><Link to="/login" type="button" class="btn app-dark-color app-secondary-bg-color me-2 btn-app">Login</Link><Link to="/register" type="button" class="btn text-white app-primary-bg-color btn-app">Sign-up</Link></>);
  }



    return (
        <header class="p-3">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="link-app pe-5 app-primary-color d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
          ClimateCognize
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="/" class="nav-link px-2 text-secondary">Home</a></li>
          <li><a href="#" class="nav-link px-2 text-secondary">About</a></li>
          {localStorage.getItem("userRole") === "ROLE_ADMIN" && <li><a href="/climateModels" class="nav-link px-2 text-secondary">Climate Models</a></li>}
          {localStorage.getItem("userRole") ==="ROLE_ADMIN" && <li><a href="/datasetEntries" class="nav-link px-2 text-secondary">Dataset Entries</a></li>}
        </ul>

        <div class="text-end">
          {authenticate}
        </div>
      </div>
    </div>
  </header>
    )
}

export default Header;