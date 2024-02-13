import React, { useState, useReducer, useEffect } from 'react';
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";
import ClimateCognizeService from '../../../repository/climateCognizeRepository';
import User from '../../../models/User';

function DatasetCreator(props) {
    const [columns, setColumns] = useState([]);
    const [inputs, setInputs] = useState([[]]);
    const [inputsData, setInputsData] = useState([[]]);
    const [numRows, setNumRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [datasetName, setDatasetName] = useState("");
    const [isPrivate, setDatasetPrivacy] = useState(false);
    const [tags, setTags] = useState([]);
    const [user, setUser] = useState(new User("","","",""));

    const offset = pageSize * page;
    const nextPageOffset = offset + pageSize;
    const pageCount = Math.ceil(inputs.length / pageSize);

    useEffect(() => {
        let username = localStorage.getItem("currentUser");
        ClimateCognizeService.getUserInfo(username).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                setUser({username: obj['username'], name: obj['name'], surname:  obj['surname'], role: obj['role'], isPremium: obj['premium']});
            }
        });
    }, []);


    return (
        <div className='custom-table-responsive'>
            <div className='full-width'>
                <div className="header-div mb-5">
                    <h1 className="h1">Dataset Creator</h1>
                </div>
            </div>

            <div className='mb-4'>
                <h5 className='h5'>In this creator, you can create your own dataset by inputting data directly as a table or by importing an existing dataset and modifying it.</h5>
            </div>

            <div className='mb-5 w-25 mx-auto'>
                <label htmlFor='dataset-name' className='form-label'>Dataset Name</label>
                <input type='text' name='datasetName' id='dataset-name' className='form-control' placeholder='Enter your desired dataset name'></input>

                <hr></hr>

                <div class="form-check text-start mb-4">
                    <input onClick={() => setDatasetPrivacy(false)} defaultChecked class="form-check-input" type="radio" name="privacyDatasetOptions" id="publicDatasetOptions"></input>
                    <label class="form-check-label" for="publicDatasetOptions">
                        <div className='row'>
                            <div className='col-2'>
                                <svg style={{color: "lightgrey"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
                                    <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" />
                                </svg>
                            </div>
                            <div className='col-10'>
                                <div className='row'>
                                    <p className='fw-bold mb-1'>Public</p>
                                    <small className='text-muted'>Anyone can see and use this dataset.</small>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="form-check text-start">
                    
                    <input onClick={() => setDatasetPrivacy(true)} disabled={!user.isPremium} class="form-check-input" type="radio" name="privacyDatasetOptions" id="privateDatasetOptions"></input>
                    <label class="form-check-label" for="privateDatasetOptions">
                    <div className='row'>
                            <div className='col-2'>
                                <svg style={{color: "lightgrey"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-database-lock" viewBox="0 0 16 16">
                                <path d="M13 5.698a5 5 0 0 1-.904.525C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777A5 5 0 0 1 3 5.698V7c0 .374.356.875 1.318 1.313C5.234 8.729 6.536 9 8 9c.666 0 1.298-.056 1.876-.156-.43.31-.804.693-1.102 1.132A12 12 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777A5 5 0 0 1 3 8.698V10c0 .374.356.875 1.318 1.313C5.234 11.729 6.536 12 8 12h.027a4.6 4.6 0 0 0-.017.8A2 2 0 0 0 8 13c-1.573 0-3.022-.289-4.096-.777A5 5 0 0 1 3 11.698V13c0 .374.356.875 1.318 1.313C5.234 14.729 6.536 15 8 15c0 .363.097.704.266.997Q8.134 16.001 8 16c-1.573 0-3.022-.289-4.096-.777C2.875 14.755 2 14.007 2 13V4c0-1.007.875-1.755 1.904-2.223C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4v4.256a4.5 4.5 0 0 0-1.753-.249C12.787 7.654 13 7.289 13 7zm-8.682-3.01C3.356 3.124 3 3.625 3 4c0 .374.356.875 1.318 1.313C5.234 5.729 6.536 6 8 6s2.766-.27 3.682-.687C12.644 4.875 13 4.373 13 4c0-.374-.356-.875-1.318-1.313C10.766 2.271 9.464 2 8 2s-2.766.27-3.682.687Z"/>
  <path d="M9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/>
                                </svg>
                            </div>
                            <div className='col-10'>
                                <div className='row'>
                                    <p className='fw-bold mb-1'>Private</p>
                                    <small className='text-muted'>Only you (personal dataset) can see and use this dataset.</small>
                                    {!user.isPremium && <small className='text-muted'>Only accounts with Pro Subscription can create private datasets.</small>  }

                                </div>
                            </div>
                        </div>
                    </label>
                </div>

                <button className='btn btn-app app-primary-bg-color mt-3' onClick={() => setDatasetName(document.getElementById('dataset-name').value)}>{'Create dataset'}</button>
            </div>



            {datasetName !== "" && <>

                <p className='fs-6'>Import your data from a .csv file and edit it or create it manually using the dataset editor.</p>

                <div className='w-25 mx-auto mb-5' id='import-dataset-div'>
                    <form onSubmit={(e) => importFromCsv(e)} enctype="multipart/form-data">
                        <div className="mb-3 input-group">
                            <input accept='.csv' className="form-control w-50" type="file" id="import-dataset-table" name='import-dataset-table' />
                        </div>
                        <input className="btn btn-primary" type="submit" value={"Import from .csv"}></input>
                    </form>
                </div>

                <div className='w-25 mx-auto' id='import-dataset-divider'>
                    <hr></hr>
                    <p className='text-center'>or</p>
                    <hr></hr>
                </div>

                <div className='form-group w-25 m-auto row'>
                    <div className='col'>
                        <label htmlFor='newcol' className='form-label'>Column Name</label>
                        <input type='text' name='newcol' id='newcol' className='form-control'></input>
                    </div>
                    <div className='col'>
                        <label htmlFor='col-type-select' className='form-label'>Column Type</label>
                        <select id='col-type-select' name='col-type-select' className='form-select d-inline'>
                            <option>string</option>
                            <option>number</option>
                            <option>object</option>
                        </select>
                    </div>
                    <button className='btn btn-app app-primary-bg-color mt-3' onClick={() => addColumn({ "col_name": document.getElementById('newcol').value, "col_type": document.getElementById('col-type-select').value })}>{columns.length > 0 ? 'Add column' : 'Create dataset table'}</button>
                </div>




                {numRows > 0 &&
                    <div className='row mt-5'>
                        <div className='col'>
                            <p className='float-start fw-bold'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z" />
                            </svg> Dataset editor - {datasetName}</p>
                        </div>
                        <div className='col'>
                            <small class="float-end d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{numRows === 1 ? numRows + ' row' : numRows + ' rows'}</small>
                        </div>
                    </div>
                }

                <table className='table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden' id="dataset-table">

                    <thead className='text-start'>
                        <tr>
                            {columns.map((entry, index) => {
                                return (
                                    <th>{entry.col_name}<br></br><span className='text-muted fw-light'>{entry.col_type}</span></th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className='table-group-divider'>

                        {getInputsPage(offset, nextPageOffset).map((entry, index) => {
                            return (
                                <tr>
                                    {entry.map((cell, index) => {
                                        return (
                                            <td>{cell}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {columns.length > 0 ? <div><button style={{ marginLeft: '-3em' }} className='text-nowrap btn btn-outline-success float-start' onClick={() => addNewRow()}>+</button>
                    <div className='float-end'>
                        {numRows > 0 && columns.length > 0 &&
                            <CSVLink style={{ marginRight: '-6em' }} className="btn-app app-primary-bg-color btn text-dark fw-bold text-decoration-none" filename={datasetName + ".csv"} data={getCsvData()}>
                                Export to <br></br> CSV
                            </CSVLink>
                        }
                    </div>
                </div> : ""}

                {numRows > 0 && columns.length > 0 && <ReactPaginate previousLabel="back"
                    nextLabel="next"
                    breakLabel={<a href="/#">...</a>}
                    // breakClassName={"break-me"}
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
                    activeClassName={"active"} />}



                {numRows > 0 &&
                    <>

                        <h5 className='h5 mt-5 mb-5'>When you are done editing your dataset and have filled in the options press the button below to save it.</h5>

                        <div className='row mt-5 mb-5'>
                            <label className='form-label' htmlFor='description-input'>Dataset Description</label>
                            <textarea rows={3} cols={10} className='form-control mb-5 w-75 mx-auto' id='description-input' name='description-input'></textarea>
                        </div>
                        
                        <div className='row mt-5 mb-5'>
                            <div className='col'>
                                <label className='form-label' htmlFor='language-input'>Language</label>
                                <input type='text' className='form-control mb-5 w-75 mx-auto' id='language-input' name='language-input' placeholder='Enter language in format: ex. English (en)'></input>
                            </div>
                            <div className='col'>
                                <label htmlFor='task-select' className='form-label'>Task</label>
                                <select id='task-select' name='task-select' className='form-select w-50 mx-auto'>
                                    <option>Text Classification</option>
                                    <option>Zero-Shot Classification</option>
                                    <option>Translation</option>
                                    <option>Conversational</option>
                                    <option>Token Classification</option>
                                    <option>Text2Text Generation</option>
                                    <option>Summarization</option>
                                    <option>Question Answering</option>
                                </select>
                            </div>
                        </div>

                        <div className='row mt-5 mb-5'>
                            <div className='col'>
                                <label className='form-label' htmlFor='tags-input'>Enter tags (optional)</label>
                                <input onKeyDown={handleTagInput} type='text' className='form-control mb-5 w-50 mx-auto' id='tags-input' name='tags-input' placeholder='Enter a tag and press enter'></input>
                            </div>
                            <div className='col'>
                                <p>Tags:</p>
                                <div id='tags-inputted' className='row row-cols-6 rounded-3'>
                                {tags.map((tag, index) => {
                                        return (
                                            <div><small class="justify-content-center float-end d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">{tag}</small></div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleCreateDataset}>
                            <button type="submit" className='btn-app app-primary-bg-color btn text-dark fw-bold text-decoration-none'>Save dataset</button>
                        </form>
                    </>

                }


            </>}



        </div>
    );

    function handlePageClick(data) {
        let selected = data.selected;
        setPage(selected);
    }

    function getNodeText(
        node
    ) {
        if (!node) {
            return ''
        }

        if (typeof node === 'string' || typeof node === 'number') {
            return node.toString()
        }

        if (Array.isArray(node)) {
            return node.map(getNodeText).join('')
        }

        return getNodeText(node.props.children)
    }

    function handleCreateDataset(e) {
        e.preventDefault();

        let description = document.getElementById("description-input").value;
        let language = document.getElementById("language-input").value;
        let task = document.getElementById("task-select").value;
        let cols = columns.map(col => col['col_name']);
        let types = columns.map(col => col['col_type']);
        let rows = [];
        for (let index = 0; index < inputsData.length; index++) {
            const row = inputsData[index];
            let entries = [];
            row.forEach(element => {
                entries.push(element);
            });
            rows[index] = {"entries" : entries};
            // rows[index] = entries;
            
        }
        ClimateCognizeService.createNewDataset(localStorage.getItem("currentUser"), datasetName, description, isPrivate, language, task, "train", cols, rows, tags, types).then((resp) => {
            if(resp.status === 200) {
                window.location.href = "/datasets";
            }
            else {
                console.log(resp);
            }
        });
    }

    function handleTagInput(e) {
        if(e.key === "Enter") {
            tags.push(document.getElementById("tags-input").value);
            document.getElementById("tags-input").value = "";
            forceUpdate();
        }
    }

    function getCsvData() {
        return [columns.map(col => col.col_name), ...inputsData];
    }

    function getInputsPage(offset, nextPageOffset) {
        return inputs.filter((input, index) => {
            return index >= offset && index < nextPageOffset;
        })
    }

    function addNewRow() {
        let newInput = [];
        let newInputData = [];
        for (let i = 0; i < columns.length; i++) {
            // newInput.push(<DatasetInput isEntered='false' id={inputs.length}></DatasetInput>);
            if (columns[i].col_type === 'string') {
                newInput.push(<input className='form-control' type='text' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
                newInputData.push("");
            }
            else {
                newInputData.push("");
                newInput.push(<input className='form-control' type='number' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
            }

        }
        if (columns.length !== 0) {
            inputs[numRows] = newInput;
            inputsData[numRows] = newInputData;
            setNumRows(numRows + 1);
        }

    }

    function addColumn(col) {
        if (columns.length === 0) {
            document.getElementById('import-dataset-div').style.display = 'none';
            document.getElementById('import-dataset-divider').style.display = 'none';
        }
        for (let i = 0; i < numRows; i++) {
            while (inputs[i].length <= columns.length) {
                let j = inputs[i].length;
                inputs[i].push(<input className='form-control' type='text' id={'dataset-input-' + i + '-' + j} onKeyDown={(e) => saveInput(e, i, j)}></input>);
                inputsData[i].push("");
            }
        }
        setColumns([...columns, col]);
        document.getElementById('newcol').value = "";

    }

    function saveInput(event, idRow, idCol) {
        if (event.key === 'Enter') {
            let id = 'dataset-input-' + idRow + '-' + idCol;
            let inputValue = document.getElementById(id).value;
            inputs[idRow][idCol] = <p onClick={() => changeInput(idRow, idCol)} data-value={inputValue}>{inputValue}</p>;
            inputsData[idRow][idCol] = inputValue;
            forceUpdate();
        }

    }

    function changeInput(idRow, idCol) {
        let inputValue = inputs[idRow][idCol];
        inputs[idRow][idCol] = <input className='form-control' type='text' id={'dataset-input-' + idRow + '-' + idCol} onKeyDown={(e) => saveInput(e, idRow, idCol)} defaultValue={inputValue.props['data-value']}></input>;
        inputsData[idRow][idCol] = "";
        forceUpdate();

    }

    function importFromCsv(e) {
        e.preventDefault();
        let dataset_file = document.getElementById("import-dataset-table").files[0];
        Papa.parse(dataset_file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                let data = results.data;
                let cols = Object.keys(data[0]);
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < cols.length; j++) {
                        let parsedNum = parseFloat(data[i][cols[j]]);
                        if (!isNaN(parsedNum)) {
                            data[i][cols[j]] = parsedNum;
                        }
                    }
                }
                for (let i = 0; i < cols.length; i++) {
                    cols[i] = { 'col_name': cols[i], 'col_type': typeof (data[0][cols[i]]) };
                }
                setColumns(cols);
                for (let i = 0; i < data.length; i++) {
                    let newRow = [];
                    let newRowData = [];
                    let iParam = i;
                    for (let j = 0; j < cols.length; j++) {
                        let jParam = j;
                        let dataValue = data[i][cols[j].col_name];
                        newRowData[j] = dataValue;
                        newRow[j] = <p onClick={() => changeInput(iParam, jParam)} data-value={dataValue}>{dataValue}</p>;
                    }
                    data[i] = newRow;
                    inputs[i] = data[i];
                    inputsData[i] = newRowData;
                }
                setNumRows(data.length);
                setInputs(data);
                forceUpdate();
            },
        });

        document.getElementById('import-dataset-div').style.display = 'none';
        document.getElementById('import-dataset-divider').style.display = 'none';

        // let inputPosition = document.getElementById("import-dataset-input-position").value;
        // let data = new FormData();
        // data.append('dataset_file', dataset_file);
        // this.state.datasetResponse = [];
        //           this.setState({
        //           "datasetResponse" : [...this.state.datasetResponse],
        //       });
        // ClimateCognizeService.importDatasetFromCSV(data.get("dataset_file"), this.state.selectedTask, inputPosition).then((resp) => {
        //   if(resp.status === 200) {
        //     let responses = resp.data;
        //     for(let entry of responses) {
        //       let datasetEntry = new ClimateDatasetResponse();
        //       datasetEntry.input = entry['input'];
        //       datasetEntry.predictedLabel = entry['label'];
        //       this.state.datasetResponse.push(datasetEntry);
        //       this.setState({
        //           "datasetResponse" : [...this.state.datasetResponse],
        //       });
        //   }
        //   }
        // });
    }
}

// function DatasetInput(isEntered, id) {
//     const [input, setInput] = useState("");

//     if(isEntered) {
//         return (
//             <td>{input}</td>
//         );
//     }
//     else {
//         return (
//             <input type='text' id={'dataset-input-'+id} onKeyDown={(e) => saveInput(e)}></input>
//         );
//     }

//     function saveInput(event) {
//         if(event.key == 'Enter') {
//             let inputValue = document.getElementById('dataset-input-'+id).value;
//             setInput(inputValue);
//             isEntered = true;
//         }

//     }

// }

export default DatasetCreator;