import React, { useState, useReducer } from 'react';
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import ReactPaginate from "react-paginate";

function DatasetCreator(props) {
    const [columns, setColumns] = useState([]);
    const [inputs, setInputs] = useState([[]]);
    const [inputsData, setInputsData] = useState([[]]);
    const [numRows, setNumRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [datasetName, setDatasetName] = useState("");

    const offset = pageSize * page;
    const nextPageOffset = offset + pageSize;
    const pageCount = Math.ceil(inputs.length / pageSize);

    return (
        <div className='custom-table-responsive'>
            <div className="header-div mb-5">
                <h1 className="h1">Dataset Creator</h1>
            </div>

            <div className='mb-4'>
                <h5 className='h5'>In this creator, you can create your own dataset by inputting data directly as a table or by importing an existing dataset and modifying it.</h5>
            </div>

            <div className='mb-5 w-25 mx-auto'>
                    <label htmlFor='dataset-name' className='form-label'>Dataset Name</label>
                    <input type='text' name='datasetName' id='dataset-name' className='form-control' placeholder='Enter your desired dataset name'></input>
                    <button className='btn btn-app app-primary-bg-color mt-3' onClick={() => setDatasetName(document.getElementById('dataset-name').value)}>{'Create dataset'}</button>
            </div>

            {datasetName !== "" && <>

            <p className='fs-6'>Import your data from a .csv file and edit it or create it manually using the dataset editor.</p>

            <div className='w-25 mx-auto mb-5' id='import-dataset-div'>
                <form onSubmit={(e) => importFromCsv(e)} enctype="multipart/form-data">
                    <div className="mb-3 input-group">
                        <input accept='.csv' className="form-control w-50" type="file" id="import-dataset-table" name='import-dataset-table'/>
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
                        <option>int</option>
                        <option>double</option>
                    </select>
                </div>
                <button className='btn btn-app app-primary-bg-color mt-3' onClick={() => addColumn({"col_name": document.getElementById('newcol').value, "col_type": document.getElementById('col-type-select').value})}>{columns.length > 0 ? 'Add column' : 'Create dataset table'}</button>
            </div>




            { numRows > 0 &&
            <div className='row mt-5'>
                <div className='col'>
                    <p className='float-start fw-bold'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
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
            {columns.length > 0 ? <div><button style={{marginLeft: '-3em'}} className='text-nowrap btn btn-outline-success float-start' onClick={() => addNewRow()}>+</button>
            <div className='float-end'>
                { numRows > 0 && columns.length > 0 &&
                <CSVLink style={{marginRight: '-6em'}} className="btn-app app-primary-bg-color btn text-dark fw-bold text-decoration-none" filename="dataset.csv" data={getCsvData()}>
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
                               activeClassName={"active"}/>}
        


            </> }

            

        </div>
    );

    function handlePageClick (data) {
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
        for(let i=0; i<columns.length; i++) {
            // newInput.push(<DatasetInput isEntered='false' id={inputs.length}></DatasetInput>);
            if(columns[i].col_type === 'string') {
                newInput.push(<input className='form-control' type='text' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
                newInputData.push("");
            }
            else {
                newInputData.push("");
                newInput.push(<input className='form-control' type='number' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
            }

        }
        if(columns.length !== 0) {
            inputs[numRows] = newInput;
            inputsData[numRows] = newInputData;
            setNumRows(numRows + 1);
        }

    }

    function addColumn(col) {
        if(columns.length === 0) {
            document.getElementById('import-dataset-div').style.display = 'none';
            document.getElementById('import-dataset-divider').style.display = 'none';
        }
        for (let i=0; i<numRows; i++) {
            while(inputs[i].length <= columns.length) {
                let j = inputs[i].length;
                inputs[i].push(<input className='form-control' type='text' id={'dataset-input-' + i + '-' + j} onKeyDown={(e) => saveInput(e, i, j)}></input>);
                inputsData[i].push("");
            }
        }
        setColumns([...columns, col]);
        document.getElementById('newcol').value = "";
        
    }

    function saveInput(event, idRow, idCol) {
        if(event.key === 'Enter') {
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
              for(let i=0; i<data.length; i++) {
                for(let j=0; j<cols.length; j++) {
                    let parsedNum = parseFloat(data[i][cols[j]]);
                    if(!isNaN(parsedNum)) {
                        data[i][cols[j]] = parsedNum;
                    }
                }
              }
              for(let i=0; i<cols.length; i++) {
                cols[i] = {'col_name': cols[i], 'col_type': typeof(data[0][cols[i]])};
              }
              setColumns(cols);
              for(let i=0; i<data.length; i++) {
                let newRow = [];
                let newRowData = [];
                let iParam = i;
                for(let j=0; j<cols.length; j++) {
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