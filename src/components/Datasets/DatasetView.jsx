import React from "react";
import { useEffect, useState, useReducer } from "react";
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { CSVDownload } from "react-csv";
import ReactPaginate from "react-paginate";

import User from "../../models/User";
import ClimateCognizeService from "../../services/climateCognizeService";


const DatasetView = () => {
    const { id } = useParams();
    const [dataset, setDataset] = useState({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [pageCount, setPageCount] = useState(0);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const offset = pageSize * page;
    const nextPageOffset = offset + pageSize;
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const navigate = useNavigate();
    const [user, setUser] = useState(new User("", "", "", ""));

    useEffect(() => {
        ClimateCognizeService.getDatasetById(id).then((resp) => {
            if (resp.status === 200) {
                setDataset(resp.data);
            }
        });
        let username = localStorage.getItem("currentUser");
        if (username === null) {
            navigate("/login?errorMsg=You are not authorized to view this dataset");
        }
        ClimateCognizeService.getUserInfo(username).then((resp) => {
            if (resp.status === 200) {
                let obj = resp.data;
                setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'], isPremium: obj['premium'] });
            }
        });
    }, []);

    useEffect(() => {
        if (dataset['rows'] != undefined) {
            setPageCount(Math.ceil(dataset['rows'].length / pageSize));
        }
        if (dataset['private'] && dataset['author'] !== user.username) {
            navigate("/login?errorMsg=You are not authorized to view this dataset");
        }
    }, [dataset['rows']]);

    const handlePageClick = (data) => {
        let selected = data.selected;
        setPage(selected);
    }

    const deleteDataset = (id) => {
        ClimateCognizeService.deleteDataset(id).then((resp) => {
            if (resp.status == 200) {
                navigate("/userProfile?user=" + user.username + '&closeModal=true');
            }
        });
    }

    const getEntriesPage = (offset, nextPageOffset) => {
        return dataset['rows'].filter((input, index) => {
            return index >= offset && index < nextPageOffset;
        })
    }

    const likeDataset = (id) => {
        ClimateCognizeService.likeDataset(id).then((resp) => {
            if (resp.status === 200) {
                setDataset(resp.data);
            }
        });
    }

    const increaseDownloads = () => {
        ClimateCognizeService.downloadDataset(dataset['id']).then((resp) => {
            if (resp.status === 200) {
                setDataset(resp.data);
                setIsDownloaded(true);
            }
        });
    }

    const getCsvData = () => {
        return [dataset['columns'], ...dataset['rows'].map(row => row.entries)];
    }

    return (
        <>
            <div className="full-width">
                <div className="row bg-light">
                    <div className="container" style={{ marginLeft: "10em", marginRight: "10em" }}>
                        <div className="mt-5 mb-3 text-start row">
                            <div className="col-9">
                                <NavLink to="/datasets" className="nav-link px-3 text-secondary fw-bold fs-5 d-inline"><span>                <svg color="darkgrey" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database-fill" viewBox="0 0 16 16">
                                    <path d="M3.904 1.777C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4s-.875 1.755-1.904 2.223C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777C2.875 5.755 2 5.007 2 4s.875-1.755 1.904-2.223" />
                                    <path d="M2 6.161V7c0 1.007.875 1.755 1.904 2.223C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777C13.125 8.755 14 8.007 14 7v-.839c-.457.432-1.004.751-1.49.972C11.278 7.693 9.682 8 8 8s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                                    <path d="M2 9.161V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13s3.022-.289 4.096-.777C13.125 11.755 14 11.007 14 10v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                                    <path d="M2 12.161V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972" />
                                </svg> </span> Datasets:</NavLink> <span onClick={() => navigate("/userProfile?user=" + dataset['author'])} style={{ color: "darkgray", cursor: "pointer" }} className="fs-5">{dataset['author']}/</span><span className="fw-bold fs-5">{dataset['name']}</span>
                                <div class="btn-group btn-group-sm ms-3 rounded-3" role="group" aria-label="Small button group">
                                    <button onClick={() => likeDataset(dataset['id'])} type="button" class="border shadow-sm border-light-subtle btn btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart " viewBox="0 0 16 16">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                    </svg> Like</button>
                                    <button type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn btn-outline-secondary border shadow-sm border-light-subtle">{dataset['numLikes']}</button>
                                </div>
                            </div>

                            <div className="col-2">
                                <div class="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Delete dataset</h5>
                                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure that you want to delete the dataset <b>{dataset['name']}</b>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-danger" onClick={() => deleteDataset(dataset['id'])}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {user.username === dataset['author'] &&
                                    <>
                                        <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="border shadow-sm border-light-subtle btn btn-outline-danger bg-danger-subtle">Delete dataset</button>
                                    </>
                                }

                            </div>
                            <div className="col">

                            </div>
                        </div>



                        <div className="mb-3 text-start">
                            <span style={{ color: "darkgray" }} className="fs-6">Task: </span>
                            <div class="btn-group btn-group-sm ms-3 rounded-3 " role="group" aria-label="Small button group">
                                <button type="button" class="btn btn-outline-secondary border shadow-sm border-light-subtle" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}><svg xmlns="http://www.w3.org/2000/svg" className="app-alternate-color" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                                    <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
                                </svg></button>
                                <button type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn btn-outline-secondary border shadow-sm border-light-subtle">{dataset['task']}</button>
                            </div>


                            <span style={{ color: "darkgray" }} className="fs-6 ms-3">Language: </span>
                            <small class="d-inline-flex px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe me-1 mt-1" viewBox="0 0 16 16">
                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                                </svg>
                                {dataset['language']}</small>


                            <span style={{ color: "darkgray" }} className="fs-6 ms-3">Tags: </span>
                            {dataset['tags'] != undefined && dataset['tags'].map((tag, index) => {
                                return (
                                    <small class="d-inline-flex mb-3 px-2 py-1 me-2 fw-semibold text-dark app-primary-bg-color bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                        {tag}</small>
                                );
                            })}

                        </div>

                        <div className="mb-5 text-start">

                            <span style={{ color: "darkgray" }} className="fs-6"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                            </svg> Downloads: </span>
                            <span className="">{dataset['numDownloads']}</span>
                            {user.username != "" && <button className="btn btn-app btn-outline-secondary ms-4 btn-sm border shadow-sm border-light-subtle" onClick={increaseDownloads}>Download dataset</button>}
                            {isDownloaded == true ? <CSVDownload data={getCsvData()} target="_blank" filename={dataset['name'] + ".csv"} /> : null}
                        </div>
                    </div>

                </div>


            </div>
            <div className="row mt-5">
                <div className="container">
                    {
                        dataset['columns'] != undefined &&
                        <>

                            <div className='row mt-5'>
                                <div className='col'>
                                    <p className='float-start fw-bold'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z" />
                                    </svg> Dataset viewer</p>
                                </div>
                                <div className='col'>
                                    <small class="float-end d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{dataset['rows'].length === 1 ? dataset['rows'].length + ' row' : dataset['rows'].length + ' rows'}</small>
                                </div>
                            </div>


                            <table className='table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden'>

                                <thead className='text-start'>
                                    <tr>
                                        {dataset['columns'].map((entry, index) => {
                                            return (
                                                <th>{entry}<br></br><span className='text-muted fw-light'>{dataset['types'][index]}</span></th>
                                            );
                                        })}
                                    </tr>
                                </thead>

                                <tbody className='table-group-divider'>

                                    {getEntriesPage(offset, nextPageOffset).map((entry, index) => {
                                        return (
                                            <tr>
                                                {entry['entries'].map((cell, index) => {
                                                    return (
                                                        <td>{cell}</td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <ReactPaginate previousLabel="< Previous"
                                nextLabel="Next >"
                                breakLabel={<a href="/#">...</a>}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination m-4 justify-content-center"}
                                activeClassName={"active"} />


                            <div className="mt-5 text-start" id="dataset-card-view">


                                <h4>Dataset card for "{dataset['name']}"</h4>

                                <p style={{ whiteSpace: "pre-wrap" }}>{dataset['description']}</p>
                            </div>

                        </>

                    }
                </div>
            </div>
        </>
    );
}

export default DatasetView;