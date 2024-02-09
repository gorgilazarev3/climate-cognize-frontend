import React from 'react';
import '../App/App.css';
import {Link, NavLink} from 'react-router-dom';
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
        <a href="/" className="link-app pe-5 fw-bold text-dark d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
          <img src='images\climate-change.png' className='me-2' width={20}></img>
          ClimateCognize
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><NavLink to="/" className="nav-link px-3 text-secondary">Home</NavLink></li>
          <li><NavLink to="/about" className="nav-link px-3 text-secondary">About</NavLink></li>
          <li><NavLink to="/contact" className="nav-link px-3 text-secondary">Contact</NavLink></li>
          {localStorage.getItem("userRole") === "ROLE_ADMIN" && <li><NavLink to="/climateModels" className="nav-link px-3 text-secondary">Climate Models</NavLink></li>}
          {localStorage.getItem("userRole") ==="ROLE_ADMIN" && <li><NavLink to="/datasetEntries" className="nav-link px-3 text-secondary">Dataset Entries</NavLink></li>}
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