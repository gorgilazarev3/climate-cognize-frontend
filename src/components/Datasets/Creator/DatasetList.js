import React from "react";
import { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import ClimateCognizeService from "../../../services/climateCognizeService";
import User from "../../../models/User";
import { LocalStorageKeys } from "../../../constants/localStorageKeys";

const DatasetList = () => {

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
    const [user, setUser] = useState(new User("", "", "", ""));
    const navigate = useNavigate();


    useEffect(() => {
        ClimateCognizeService.getAllDatasets().then((resp) => {
            if (resp.status === 200) {
                setDatasets(resp.data);
            }
        });
        let username = localStorage.getItem(LocalStorageKeys.CURRENT_USER);
        if (username != null) {
            ClimateCognizeService.getUserInfo(username).then((resp) => {
                if (resp.status === 200) {
                    let obj = resp.data;
                    setUser({ username: obj['username'], name: obj['name'], surname: obj['surname'], role: obj['role'], isPremium: obj['premium'] });
                }
            });
        }

    }, []);

    useEffect(() => {
        if (datasets.length > 0) {
            setLanguages([...new Set(datasets.map(ds => ds['language']))]);
        }

    }, [datasets]);

    const sort = (e) => {
        let sortOrder = e.target.dataset.sort;
        setSortOrder(sortOrder);
    }

    const handleNameFilter = (e) => {
        setNameFilter(e.target.value);
    }



    const handleTaskFilter = (e) => {
        if (!taskFilter.includes(e.target.dataset.task))
            taskFilter.push(e.target.dataset.task);
        else {
            const index = taskFilter.indexOf(e.target.dataset.task);
            if (index > -1) { // only splice array when item is found
                taskFilter.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        let taskButtons = document.getElementsByClassName("tasks-buttons-text");
        for (let index = 0; index < taskButtons.length; index++) {
            const element = taskButtons[index];
            if (element == e.target) {
                if (!element.classList.contains("active")) {
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

    const handleLangFilter = (e) => {
        if (!langsFilter.includes(e.target.dataset.lang))
            langsFilter.push(e.target.dataset.lang);
        else {
            const index = langsFilter.indexOf(e.target.dataset.lang);
            if (index > -1) { // only splice array when item is found
                langsFilter.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        let taskButtons = document.getElementsByClassName("langs-buttons-text");
        for (let index = 0; index < taskButtons.length; index++) {
            const element = taskButtons[index];
            if (element == e.target) {
                if (!element.classList.contains("active")) {
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

    const filteredDatasets = (name) => {
        let ds = datasets.filter(d => (d['name'].toLowerCase().includes(name.toLowerCase()) || d['author'].toLowerCase().includes(name.toLowerCase())));
        if (user.isPremium) {
            ds = ds.filter(d => d['private'] === false || d['private'] === true && d['author'] == user.username);
        }
        else {
            ds = ds.filter(d => d['private'] === false);
        }
        if (taskFilter.length > 0) {
            ds = ds.filter(d => taskFilter.includes(d['task']));
        }
        if (langsFilter.length > 0) {
            ds = ds.filter(d => langsFilter.includes(d['language']));
        }
        if (sortOrder != "Default") {
            if (sortOrder === "Most likes") {
                ds.sort((d1, d2) => d2['numLikes'] - d1['numLikes']);
            }
            else if (sortOrder === "Most downloads") {
                ds.sort((d1, d2) => d2['numDownloads'] - d1['numDownloads']);
            }
            else if (sortOrder === "Most recent") {
                ds.sort((d1, d2) => new Date(d2['lastUpdated']) - new Date(d1['lastUpdated']));
            }
        }
        return ds;
    }

    const navigateToView = (id) => {
        navigate(`/dataset/${id}`);
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-3 bg-light text-start rounded-3 border-light-subtle border shadow-sm">
                    <div className="mb-3">
                        <p className="text-muted fw-semibold mt-3">Tasks ({taskFilter.length == 0 ? "all" : taskFilter.length} selected)</p>
                        {tasks.map((task, index) => {
                            return (
                                <div class="btn-group btn-group-sm ms-3 rounded-3 mb-3 tasks-btn-group" role="group" aria-label="Small button group">
                                    {index == 0 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-warning-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}><svg xmlns="http://www.w3.org/2000/svg" className="app-alternate-color" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-richtext" viewBox="0 0 16 16">
                                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                                        <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V8.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8s1.54-1.274 1.639-1.208M6.25 6a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
                                    </svg></button>}
                                    {index == 1 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-danger-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                        </svg></button>}
                                    {index == 2 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-primary-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
                                            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
                                            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
                                        </svg></button>}
                                    {index == 3 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-success-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                        </svg></button>}
                                    {index == 4 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-info-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-braces-asterisk" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z" />
                                        </svg></button>}
                                    {index == 5 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-dark-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand-vertical" viewBox="0 0 16 16">
                                            <path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8" />
                                        </svg></button>}
                                    {index == 6 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-light-subtle bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-data" viewBox="0 0 16 16">
                                            <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                                        </svg></button>}
                                    {index == 7 && <button onClick={handleTaskFilter} data-task={task} type="button" class="btn border shadow-sm border-light-subtle bg-body-secondary bg-gradient tasks-buttons-icons btn-outline-secondary" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-square" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                                        </svg></button>}
                                    <button onClick={handleTaskFilter} data-task={task} type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn border shadow-sm border-light-subtle btn-outline-secondary tasks-buttons-text">{task}</button>
                                </div>
                            );
                        })
                        }
                    </div>
                    <hr></hr>
                    <div className="mb-3">
                        <p className="text-muted fw-semibold mt-3">Languages ({langsFilter.length == 0 ? "all" : langsFilter.length} selected)</p>
                        {languages.map((lang, index) => {
                            return (
                                <div class="btn-group btn-group-sm ms-3 rounded-3 mb-3" role="group" aria-label="Small button group">
                                    <button onClick={handleLangFilter} data-lang={lang} type="button" class="btn border shadow-sm border-success-subtle langs-buttons-icons btn-outline-success" style={{ borderTopLeftRadius: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopRightRadius: "0px" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe me-1" viewBox="0 0 16 16">
                                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                                        </svg>
                                    </button>
                                    <button onClick={handleLangFilter} data-lang={lang} type="button" style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem", borderTopLeftRadius: "0px" }} class="btn border shadow-sm border-success-subtle btn-outline-success langs-buttons-text">{lang}</button>
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
                <div className="col-9">
                    <div className="row mb-5">
                        <div className="col">
                            <h5>Datasets <span className="text-muted ps-3 small">{filteredDatasets(nameFilter, taskFilter).length}</span></h5>
                        </div>
                        <div className="col">
                            <div className="input-group">
                                <span style={{ borderTopRightRadius: 0, borderRight: 0 }} class="input-group-text bg-transparent" id="basic-addon1">
                                    <svg color={"gray"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
                                        <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"></path>
                                    </svg>
                                </span>
                                <input onChange={handleNameFilter} style={{ borderTopLeftRadius: 0, borderLeft: 0 }} className="form-control form-control-sm" aria-describedby="basic-addon1" type="text" id="filter-by-name" name="filter-by-name" placeholder=" Filter by name"></input>

                            </div>
                        </div>
                        <div className="col">
                            <div className="dropdown">
                                <button type="button" class="border shadow-sm border-secondary-subtle btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
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
                                            <p className="text-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="text-secondary bi bi-database" viewBox="0 0 16 16">
                                                <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" />
                                            </svg> <span style={{ fontFamily: 'Roboto Mono' }} className="ps-2 dataset-name">{dataset['author'] + "/" + dataset['name']}</span></p>
                                        </div>
                                        <div className="text-start text-muted" >
                                            <small><span style={{ fontFamily: 'Roboto Mono' }}>Updated {new Date(dataset['lastUpdated']).toLocaleString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })}</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                            </svg> <span style={{ fontFamily: 'Roboto Mono' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                            </svg> {dataset['numDownloads']} </span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                                </svg> <span style={{ fontFamily: 'Roboto Mono' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                </svg> {dataset['numLikes']}</span></small>

                                            {dataset['private'] && user.isPremium && dataset['author'] === user.username && <small style={{ marginTop: "-1em" }} class="float-end d-inline-flex mb-3 px-2 py-1 me-2 fw-semibold text-dark app-primary-bg-color bg-opacity-10 border border-success border-opacity-10 rounded-2">
                                                PRIVATE </small>}

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

export default DatasetList;