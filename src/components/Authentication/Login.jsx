import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ClimateCognizeService from '../../services/climateCognizeService';
import { PublicRoutes } from '../../constants/routes';
import { LocalStorageKeys } from '../../constants/localStorageKeys';
import { SearchParams } from '../../constants/searchParams';

const Login = (props) => {
    const history = useNavigate();
    const [formData, updateFormData] = React.useState({
        username: "",
        password: ""
    })
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        })
    }


    const onFormSubmit = (e) => {
        e.preventDefault();
        ClimateCognizeService.login(formData.username, formData.password).then(resp => {
            localStorage.setItem(LocalStorageKeys.JWT, resp.data["jwt"]);
            localStorage.setItem(LocalStorageKeys.CURRENT_USER, formData.username);
            localStorage.setItem(LocalStorageKeys.USER_ROLE, resp.data["role"]);
            history(PublicRoutes.DEFAULT);
            props.updateCurrentUser(formData.username);
        })

    }

    return (
        <div className="row mx-auto">

            <div className="climate-banner py-1 mb-5">
                <div class=" mx-auto py-5 my-5 text-center mt-5 w-50">
                    <div className='app-primary-bg-color-opacity px-1 py-2 m-2 rounded-4'>
                        <h1 class="display-6 fw-bold">ClimateCognize</h1>
                        <div class="col-lg-6 mx-auto">
                            <p class="lead mb-4 app-dark-color fw-semibold">Login</p>
                        </div>
                    </div>
                </div>
            </div>

            {<div className='mx-auto text-center'>
                <p className='text-danger fs-4'>{searchParams.get(SearchParams.ERROR_MESSAGE)}</p>
            </div>}

            <div className="col-md-5 mx-auto">
                <form onSubmit={onFormSubmit}>
                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="name">Username</label>
                        <input type="text"
                            className="form-control"
                            name="username"
                            required
                            placeholder="Enter your username here"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-start">
                        <label className='lead fw-bold pb-1' htmlFor="price">Password</label>
                        <input type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter your password here"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <button id="submit" type="submit" className="mt-5 btn btn-app app-primary-bg-color border border-dark-subtle fw-bold text-light">Log in</button>
                </form>
            </div>
        </div>
    )
}

export default Login;
