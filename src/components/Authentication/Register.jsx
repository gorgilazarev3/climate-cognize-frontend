import React from 'react';
import { useNavigate } from 'react-router-dom';

import ClimateCognizeService from '../../services/climateCognizeService';
import { AuthRoutes } from '../../constants/routes';

const Register = () => {
    const history = useNavigate();
    const [formData, updateFormData] = React.useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: ""
    });

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        ClimateCognizeService.register(formData.username, formData.password, formData.confirmPassword, formData.name, formData.surname).then(resp => {
            history(AuthRoutes.LOGIN);
        })

    }

    return (
        <div className="row mx-auto">

            <div className="climate-banner py-1 mb-5">
                <div class=" mx-auto py-5 my-5 text-center mt-5 w-50">
                    <div className='app-primary-bg-color-opacity px-1 py-2 m-2 rounded-4'>
                        <h1 class="display-6 fw-bold">ClimateCognize</h1>
                        <div class="col-lg-6 mx-auto">
                            <p class="lead mb-4 app-dark-color fw-semibold">Register as a new user</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-5 mx-auto">
                <form onSubmit={onFormSubmit}>
                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="username">Username</label>
                        <input type="text"
                            className="form-control"
                            name="username"
                            required
                            placeholder="Enter your username here"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="password">Password</label>
                        <input type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter your password here"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password"
                            className="form-control"
                            name="confirmPassword"
                            placeholder="Enter your password here again"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="name">Name</label>
                        <input type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter your name here (optional)"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group text-start mb-3">
                        <label className='lead fw-bold pb-1' htmlFor="surname">Surname</label>
                        <input type="text"
                            className="form-control"
                            name="surname"
                            placeholder="Enter your surname here (optional)"
                            onChange={handleChange}
                        />
                    </div>
                    <button id="submit" type="submit" className="mt-5 btn btn-app app-primary-bg-color border border-secondary-subtle text-light fw-bold">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register;
