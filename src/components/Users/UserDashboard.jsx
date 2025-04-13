import React from 'react';
import { useState, useEffect } from 'react';
import { Document, Text, Page } from '@react-pdf/renderer';
import { PDFViewer, StyleSheet, View } from '@react-pdf/renderer';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ClimateCognizeService from '../../services/climateCognizeService';
import User from '../../models/User';
import { SearchParams } from '../../constants/searchParams';
import { LocalStorageKeys } from '../../constants/localStorageKeys';



const UserDashboard = () => {

    const [user, setUser] = useState(new User("", "", ""));
    const [loggedInUser, setLoggedInUser] = useState(new User("", "", ""));
    const [datasets, setDatasets] = useState([]);
    const [requestedStatistics, setRequestedStatistics] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        let username = searchParams.get(SearchParams.USER);
        let loggedUser = localStorage.getItem(LocalStorageKeys.CURRENT_USER);
        let closeModal = searchParams.get(SearchParams.CLOSE_MODAL);
        if (closeModal) {
            window.location.href = '/userProfile?user=' + username;
        }
        if (username == null) {
            username = localStorage.getItem(LocalStorageKeys.CURRENT_USER);
        }
        ClimateCognizeService.getUserInfo(username).then((resp) => {
            if (resp.status === 200) {
                let obj = resp.data;
                setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'], isPremium: obj['premium'] });
            }
        });
        ClimateCognizeService.getUserInfo(loggedUser).then((resp) => {
            if (resp.status === 200) {
                let obj = resp.data;
                setLoggedInUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'], isPremium: obj['premium'] });
            }
        });
        ClimateCognizeService.getDatasetsByUser(username).then((resp) => {
            if (resp.status === 200) {
                setDatasets(resp.data);
            }
        });


    }, []);

    const navigateToView = (id) => {
        navigate(`/dataset/${id}`);
    }

    const styles = StyleSheet.create({
        page: {
            marginTop: 30,
            fontSize: 30,
            padding: 20,
        },
        layout: {
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    });

    const getDatasets = () => {
        let ds = datasets;
        if (loggedInUser.isPremium) {
            ds = ds.filter(d => d['private'] === false || d['private'] === true && d['author'] == loggedInUser.username);
        }
        else {
            ds = ds.filter(d => d['private'] === false);
        }
        return ds;
    }

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.layout}>
                    <Text style={{ borderBottom: "1px solid black", paddingBottom: "10" }}>Statistics for user {user.name} {user.surname} - {user.username}</Text>
                </View>


                <View style={styles.layout}><Text>Number of datasets: {datasets.length}</Text></View>
                <div style={{ borderBottom: "1px solid black", paddingBottom: "10" }}>
                    <Text>Total number of likes: {datasets.map(d => d['numLikes']).reduce((partialSum, a) => partialSum + a, 0)}</Text>
                    <Text>Total number of downloads: {datasets.map(d => d['numDownloads']).reduce((partialSum, a) => partialSum + a, 0)}</Text>
                </div>
                <div style={{ borderBottom: "1px solid black", paddingBottom: "10" }}>
                    <Text>Mean number of likes per dataset: {datasets.map(d => d['numLikes']).reduce((partialSum, a) => partialSum + a, 0) / datasets.length}</Text>
                    <Text>Mean number of downloads per dataset: {datasets.map(d => d['numDownloads']).reduce((partialSum, a) => partialSum + a, 0) / datasets.length}</Text>
                </div>

                <Text style={{ borderBottom: "1px solid black", paddingBottom: "10" }}>All datasets:</Text>
                {datasets.map((ds) => {
                    return (
                        <>
                            <Text>{ds['name']}</Text>
                            <View style={{ paddingLeft: "20", borderBottom: "1px solid black", paddingBottom: "10" }}>
                                {ds['columns'].map((col, index) => {
                                    return (
                                        <>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                                <Text>Column: </Text>
                                                <Text>{col}</Text>
                                                <Text>{ds['types'][index]}</Text>

                                            </div>
                                        </>
                                    );
                                })}
                            </View>
                        </>
                    );
                })}
            </Page>
        </Document>
    );

    return (
        <div className='row'>
            <div className='col-4 bg-light text-center rounded-3 border-light-subtle border shadow-sm'>
                <div>

                </div>
                <div class="list-group-item bg-light text-center mt-5 p-5">
                    <img style={{ position: 'relative' }} alt='img' className='rounded-circle d-block mb-3 mx-auto' src='https://huggingface.co/avatars/9d20a97061f29b3d1515971f1b8a8ced.svg'></img>
                    {user.isPremium && <small class="pro-badge fs-4 d-inline-flex mb-3 px-2 py-1 fw-semibold text-light" style={{ position: 'relative', top: "-4em" }}>PRO</small>}
                    <h5 className="fw-bold">{user.name + " " + user.surname}</h5>
                    <small class="fs-6 d-inline-flex mb-3 px-2 py-1 fw-semibold bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{user.username}</small>
                </div>
                {user.username == localStorage.getItem(LocalStorageKeys.CURRENT_USER) &&
                    <div className='row row-cols-2 w-75 mx-auto'>
                        <div className='col'>
                            <button onClick={() => navigate("/userSettings?selectedButton=Profile")} className='btn btn-light profile-btns bg-light text-start rounded-3 border-light-subtle border shadow-sm'>Edit profile</button>
                        </div>
                        <div className='col'>
                            <button onClick={() => navigate("/userSettings?selectedButton=Account")} className='btn btn-light profile-btns bg-light text-start rounded-3 border-light-subtle border shadow-sm'>Settings</button>
                        </div>
                    </div>
                }


                <hr></hr>

                <div className='mt-5 mb-4'>
                    <p className='fw-bold text-uppercase text-center'><svg color='gray' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wallet me-3" viewBox="0 0 16 16">
                        <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                    </svg> Type of membership</p>
                    <p className='text-center'>{user.isPremium ? "PRO Member" : 'Basic Member'}</p>
                </div>
                <div className='mt-5 mb-4'>
                    <p className='fw-bold text-uppercase text-center'><svg color='gray' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-heart me-3" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg> Total number of likes</p>
                    <p className='text-center'>{datasets.map(d => d['numLikes']).reduce((partialSum, a) => partialSum + a, 0)}</p>
                </div>
                <div className='mt-5 mb-4'>
                    <p className='fw-bold text-uppercase text-center'><svg color='gray' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-download me-3" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                    </svg> Total number of downloads</p>
                    <p className='text-center'>{datasets.map(d => d['numDownloads']).reduce((partialSum, a) => partialSum + a, 0)}</p>
                    {user.username === localStorage.getItem(LocalStorageKeys.CURRENT_USER) && user.isPremium &&

                        <>
                            <hr></hr>
                            <button onClick={() => setRequestedStatistics(true)} className='btn btn-light profile-btns bg-light text-start rounded-3 border-light-subtle border shadow-sm'>Request statistics</button>
                        </>}
                </div>
            </div>
            <div className='col-8'>
                <div className='datasets-profile text-start ms-3'>
                    <p className="nav-link px-3 text-dark fw-bold fs-5 d-inline mb-5"><span>                <svg color="darkgrey" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database-fill" viewBox="0 0 16 16">
                        <path d="M3.904 1.777C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4s-.875 1.755-1.904 2.223C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777C2.875 5.755 2 5.007 2 4s.875-1.755 1.904-2.223" />
                        <path d="M2 6.161V7c0 1.007.875 1.755 1.904 2.223C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777C13.125 8.755 14 8.007 14 7v-.839c-.457.432-1.004.751-1.49.972C11.278 7.693 9.682 8 8 8s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                        <path d="M2 9.161V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13s3.022-.289 4.096-.777C13.125 11.755 14 11.007 14 10v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                        <path d="M2 12.161V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                    </svg> </span> Datasets</p>

                    {datasets.length == 0 && <p className='text-muted'>None created yet</p>}
                    {getDatasets().map((dataset) => {
                        return (

                            <div className="col mb-4 mt-2">
                                <div onClick={() => navigateToView(dataset['id'])} className="rounded-3 bg-light dataset-card p-2" key={dataset['name']}>
                                    <div className="row">
                                        <p className="text-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
                                            <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" />
                                        </svg> <span style={{ fontFamily: 'Roboto Mono' }} className="ps-2 dataset-name">{dataset['author'] + "/" + dataset['name']}</span></p>
                                    </div>
                                    <div className="text-start text-muted">
                                        <small><span>Updated {new Date(dataset['lastUpdated']).toLocaleString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })}</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                        </svg> <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                        </svg> {dataset['numDownloads']} </span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                            </svg> <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                            </svg> {dataset['numLikes']}</span></small>

                                        {dataset['private'] && loggedInUser.isPremium && dataset['author'] === loggedInUser.username && <small style={{ marginTop: "-1em" }} class="float-end d-inline-flex mb-3 px-2 py-1 me-2 fw-semibold text-dark app-primary-bg-color bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                            PRIVATE </small>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            <div className='container pt-5 pb-5' style={{ height: "100vh" }}>
                {requestedStatistics && <PDFViewer width={"100%"} height={"100%"}>
                    <MyDocument />
                </PDFViewer>}
            </div>

        </div>
    );
}

export default UserDashboard;