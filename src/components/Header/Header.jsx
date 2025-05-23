import React from 'react';
import { Link, NavLink, } from 'react-router-dom';

import '../App/App.css';
import { LocalStorageKeys } from '../../constants/localStorageKeys';
import { AppRoutes, AuthRoutes, PublicRoutes, UserRoutes } from '../../constants/routes';
import { UserRoles } from '../../constants/roles';

const Header = () => {

  let authenticate;
  if (localStorage.getItem(LocalStorageKeys.JWT)) {
    authenticate = (<div>
      <button data-bs-toggle="dropdown" aria-expanded="false" style={{ color: "wheat" }} className='btn pe-3 fw-bold d-inline bg-dark shadow-md'>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg> {localStorage.getItem(LocalStorageKeys.CURRENT_USER)}</button>

      <ul className="dropdown-menu">
        <li><a class="dropdown-item" href={UserRoutes.USER_PROFILE}>Profile</a></li>
        <li><hr class="dropdown-divider"></hr></li>
        <li><a class="dropdown-item" href={AppRoutes.DATASET_CREATOR}><span className='text-muted' style={{ fontSize: "0.8em" }}>+</span> New Dataset</a></li>
        <li><hr class="dropdown-divider"></hr></li>
        <li><a class="dropdown-item" href={UserRoutes.USER_SETTINGS}>Settings</a></li>
        <li><a class="dropdown-item" href="#" onClick={() => {
          localStorage.removeItem(LocalStorageKeys.JWT)
          localStorage.removeItem(LocalStorageKeys.CURRENT_USER)
          localStorage.removeItem(LocalStorageKeys.USER_ROLE)
          window.location.href = PublicRoutes.HOME;
        }}>Sign out</a></li>
      </ul>
    </div>);
  } else {
    authenticate = (<><Link to={AuthRoutes.LOGIN} type="button" class="btn app-dark-color app-secondary-bg-color me-2 btn-app border border-secondary-subtle">Login</Link><Link to="/register" type="button" class="btn text-white app-primary-bg-color btn-app border border-dark-subtle">Sign-up</Link></>);
  }



  return (
    <header class="p-3">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="link-app pe-5 fw-bold text-dark d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
            <img src='images\climate-change.png' className='me-2' width={20}></img>
            ClimateCognize
          </a>

          <ul style={{ fontFamily: 'Roboto' }} class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><NavLink to={PublicRoutes.DEFAULT} className="nav-link px-3 text-secondary">Home</NavLink></li>
            <li><NavLink to={PublicRoutes.ABOUT} className="nav-link px-3 text-secondary">About</NavLink></li>
            <li><NavLink to={PublicRoutes.CONTACT} className="nav-link px-3 text-secondary">Contact</NavLink></li>
            {localStorage.getItem(LocalStorageKeys.USER_ROLE) === UserRoles.ADMIN && <li><NavLink to={AppRoutes.CLIMATE_MODELS} className="nav-link px-3 text-secondary">Climate Models</NavLink></li>}
            {localStorage.getItem(LocalStorageKeys.USER_ROLE) === UserRoles.ADMIN && <li><NavLink to={AppRoutes.DATASET_ENTRIES} className="nav-link px-3 text-secondary">Dataset Entries</NavLink></li>}
            {localStorage.getItem(LocalStorageKeys.CURRENT_USER) !== null && <li><NavLink to={AppRoutes.DATASETS} className="nav-link px-3 text-secondary"><svg className="mb-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
            </svg> Datasets</NavLink></li>}
            <li><NavLink to="/pricing" className="nav-link px-3 text-secondary">Pricing</NavLink></li>
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