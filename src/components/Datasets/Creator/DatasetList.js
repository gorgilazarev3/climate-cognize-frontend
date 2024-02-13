import React from "react";
import ClimateCognizeService from "../../../repository/climateCognizeRepository";
import { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

export default function DatasetList(props) {

    const [datasets, setDatasets] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("Default");
    const [taskFilter, setTaskFilter] = useState([]);
    const [langsFilter, setLangsFilter] = useState([]);
    const [tasks, setTasks] = useState([
        "Text Classification",
        "Zero-Shot Classification",
        "Translation",
        "Conversational",
        "Token Classification",
        "Text2Text Generation",
        "Summarization",
        "Question Answering",
    ]);
    const [languages, setLanguages] = useState([]);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const navigate = useNavigate();


    useEffect(() => {
        ClimateCognizeService.getAllDatasets().then((resp) => {
            if (resp.status === 200) {
                setDatasets(resp.data);
            }
        });
    }, []);

    useEffect(() => {
        if(datasets.length > 0) {
            setLanguages([...new Set(datasets.map(ds => ds['language']))]);
        }

      }, [datasets]);

    function sort(e) {
        let sortOrder = e.target.dataset.sort;
        setSortOrder(sortOrder);
    }

    function handleNameFilter(e) {
        setNameFilter(e.target.value);
    }

    

    function handleTaskFilter(e) {
        if(!taskFilter.includes(e.target.dataset.task))
            taskFilter.push(e.target.dataset.task);
        else
           {
            const index = taskFilter.indexOf(e.target.dataset.task);
            if (index > -1) { // only splice array when item is found
                taskFilter.splice(index, 1); // 2nd parameter means remove one item only
            }
           }
        let taskButtons = document.getElementsByClassName("tasks-buttons-text");
        for (let index = 0; index < taskButtons.length; index++) {
            const element = taskButtons[index];
            if(element == e.target) {
                if(!element.classList.contains("active")) {
                    element.classList.add("active");
                    document.getElementsByClassName("tasks-buttons-icons")[index].classList.add("active");
                }
                else {
                    element.classList.remove("active");
                    document.getElementsByClassName("tasks-buttons-icons")[index].classList.remove("active");
                }

            }
            
        }
        forceUpdate();
    }

    function handleLangFilter(e) {
        console.log(languages)
        console.log(langsFilter, e.target.dataset.lang);
        if(!langsFilter.includes(e.target.dataset.lang))
            langsFilter.push(e.target.dataset.lang);
        else
           {
            const index = langsFilter.indexOf(e.target.dataset.lang);
            if (index > -1) { // only splice array when item is found
                langsFilter.splice(index, 1); // 2nd parameter means remove one item only
            }
           }
        let taskButtons = document.getElementsByClassName("langs-buttons-text");
        for (let index = 0; index < taskButtons.length; index++) {
            const element = taskButtons[index];
            if(element == e.target) {
                if(!element.classList.contains("active")) {
                    element.classList.add("active");
                    document.getElementsByClassName("langs-buttons-icons")[index].classList.add("active");
                }
                else {
                    element.classList.remove("active");
                    document.getElementsByClassName("langs-buttons-icons")[index].classList.remove("active");
                }

            }
            
        }
        forceUpdate();
    }

    function filteredDatasets(name) {
        let ds = datasets.filter(d => (d['name'].toLowerCase().includes(name.toLowerCase()) || d['author'].toLowerCase().includes(name.toLowerCase())));
        if(taskFilter.length > 0) {
            ds = ds.filter(d => taskFilter.includes(d['task']));
        }
        if(langsFilter.length > 0) {
            ds = ds.filter(d => langsFilter.includes(d['language']));
        }
        if(sortOrder != "Default") {
            if(sortOrder === "Most likes") {
                ds.sort((d1, d2) => d2['numLikes'] - d1['numLikes']);
            }
            else if(sortOrder === "Most downloads") {
                ds.sort((d1, d2) => d2['numDownloads'] - d1['numDownloads']);
            }
            else if(sortOrder === "Most recent") {
                ds.sort((d1, d2) => new Date(d2['lastUpdated']) - new Date(d1['lastUpdated']));
            }
        }
        return ds;
    }

    function navigateToView(id) {
        navigate(`/dataset/${id}`);
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-3 bg-light text-start rounded-3">
                    <div className="mb-3">
                    <p className="text-muted fw-semibold mt-3">Tasks</p>
                        {tasks.map((task, index) => {
                            return (
                                <div class="btn-group btn-group-sm ms-3 rounded-3 mb-3" role="group" aria-label="Small button group">
                                <button onClick={handleTaskFilter} data-task={task} type="button" class="btn btn-outline-secondary tasks-buttons-icons" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}><svg xmlns="http://www.w3.org/2000/svg" className="app-alternate-color" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                                    <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
                                </svg></button>
                                <button onClick={handleTaskFilter} data-task={task} type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn btn-outline-secondary tasks-buttons-text">{task}</button>
                                </div>
                            );
                        })
                        }
                    </div>
                    <hr></hr>
                    <div className="mb-3">
                    <p className="text-muted fw-semibold mt-3">Languages</p>
                        {languages.map((lang, index) => {
                            return (
                                <div class="btn-group btn-group-sm ms-3 rounded-3 mb-3" role="group" aria-label="Small button group">
                                <button onClick={handleLangFilter} data-lang={lang} type="button" class="btn btn-outline-success langs-buttons-icons" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe me-1" viewBox="0 0 16 16">
  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
</svg> 
                                </button>
                                <button onClick={handleLangFilter} data-lang={lang} type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn btn-outline-success langs-buttons-text">{lang}</button>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
                <div className="col-9">
                    <div className="row mb-5">
                        <div className="col">
                            <p>Datasets <span className="text-muted ps-3 small">{filteredDatasets(nameFilter, taskFilter).length}</span></p>
                        </div>
                        <div className="col">
                            <div className="input-group">
                                <span style={{ borderTopRightRadius: 0, borderRight: 0 }} class="input-group-text bg-transparent" id="basic-addon1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
                                        <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"></path>
                                    </svg>
                                </span>
                                <input onChange={handleNameFilter} style={{ borderTopLeftRadius: 0, borderLeft: 0 }} className="form-control form-control-sm" aria-describedby="basic-addon1" type="text" id="filter-by-name" name="filter-by-name" placeholder=" Filter by name"></input>

                            </div>
                        </div>
                        <div className="col">
                            <div className="dropdown">
                                <button type="button" class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"></path>
                                    </svg>
                                    Sort: {sortOrder}
                                </button>
                                <ul class="dropdown-menu">
                                    <li><button onClick={sort} data-sort="Most likes" class="dropdown-item" href="#">Most likes</button></li>
                                    <li><button onClick={sort} data-sort="Most recent" class="dropdown-item" href="#">Most recent</button></li>
                                    <li><button onClick={sort} data-sort="Most downloads" class="dropdown-item" href="#">Most downloads</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>



                    {/* datasets display */}
                    <div className="row row-cols-2 mt-5 justify-content-between">
                        {filteredDatasets(nameFilter).map((dataset, index) => {
                            return (
                                // style={{width: "fit-content"}}
                                <div className="col mb-4">
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
                                    </div>
                                </div>
                                </div>
                            );
                        })}
                    </div>


                </div>
            </div>
        </div>
    );

} 