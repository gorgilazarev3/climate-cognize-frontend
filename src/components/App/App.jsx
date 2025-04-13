import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from 'react';

import './App.css';
import Header from '../Header/Header';
import Home from '../Home/Home';
import About from '../About/About';
import ClassificationDatasetEntries from '../ClassificationDatasetEntries/ClassificationDatasetEntries';
import ClimateMLModels from '../ClimateMLModels/ClimateMLModels';
import Login from '../Authentication/Login';
import Register from '../Authentication/Register';
import Footer from '../Footer/Footer';
import DatasetCreator from '../Datasets/Creator/DatasetCreator';
import Contact from '../Contact/Contact';
import UserSettings from '../Users/UserSettings';
import DatasetList from '../Datasets/Creator/DatasetList';
import DatasetView from '../Datasets/DatasetView';
import UserDashboard from '../Users/UserDashboard';
import Pricing from '../Pricing/Pricing';
import { AppRoutes, AuthRoutes, PublicRoutes, UserRoutes } from '../../constants/routes';

const App = () => {

  const [user, updateUser] = useState({
    currentUser: null
  })


  const updateCurrentUser = (newUser) => {
    updateUser({
      ...user,
      currentUser: newUser
    })
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Header currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />
        <main>
          <div className='container'>
            <Routes>
              <Route path={PublicRoutes.DEFAULT} element={<Home currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={PublicRoutes.HOME} element={<Navigate to={PublicRoutes.DEFAULT} currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={PublicRoutes.ABOUT} element={<About currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={PublicRoutes.CONTACT} element={<Contact currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={PublicRoutes.PRICING} element={<Pricing currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AuthRoutes.LOGIN} element={<Login currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AuthRoutes.REGISTER} element={<Register currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={UserRoutes.USER_SETTINGS} element={<UserSettings currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={UserRoutes.USER_PROFILE} element={<UserDashboard currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AppRoutes.DATASET_CREATOR} element={<DatasetCreator currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AppRoutes.DATASETS} element={<DatasetList currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AppRoutes.DATASET_DETAILS} element={<DatasetView currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AppRoutes.DATASET_ENTRIES} element={<ClassificationDatasetEntries currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
              <Route path={AppRoutes.CLIMATE_MODELS} element={<ClimateMLModels currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
