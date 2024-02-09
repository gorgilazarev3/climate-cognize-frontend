import logo from '../../logo.svg';
import './App.css';
import  { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Home from '../Home/Home';
import About from '../About/About';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import ClassificationDatasetEntries from '../ClassificationDatasetEntries/ClassificationDatasetEntries';
import ClimateMLModels from '../ClimateMLModels/ClimateMLModels';
import Login from '../Authentication/Login';
import User from '../../models/User';
import { useState } from 'react';
import Register from '../Authentication/Register';
import React from 'react';
import { UserContext } from '../../data-holder/UserContext';
import Footer from '../Footer/Footer';
import DatasetCreator from '../Datasets/Creator/DatasetCreator';
import Contact from '../Contact/Contact';

function App() {

  const [user, updateUser] = useState({
    currentUser : null
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
            <Route path={"/"} element={ <Home currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/home"} element={ <Navigate to="/" currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/about"} element={ <About currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/contact"} element={ <Contact currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/datasetEntries"} element={ <ClassificationDatasetEntries currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/climateModels"} element={ <ClimateMLModels currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/login"} element={ <Login currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/register"} element={ <Register currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
            <Route path={"/datasetCreator"} element={ <DatasetCreator currentUser={user.currentUser} updateCurrentUser={updateCurrentUser} /> } />
          </Routes>
            
          </div>
        </main>
</BrowserRouter>
<Footer></Footer>
    </div>
  );
}

export default App;
