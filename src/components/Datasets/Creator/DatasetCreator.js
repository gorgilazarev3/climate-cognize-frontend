import React, { useState, useReducer } from 'react';
import { useReactTable } from '@tanstack/react-table'

function DatasetCreator(props) {
    const [columns, setColumns] = useState([]);
    const [inputs, setInputs] = useState([[]]);
    const [numRows, setNumRows] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <div className='custom-table-responsive'>
            <div className="header-div mb-5">
                <h1 className="h1">Dataset Creator</h1>
            </div>

            <div className='mb-4'>
                <h5 className='h5'>In this creator, you can create your own dataset by inputting data directly as a table or by importing an existing dataset and modifying it.</h5>
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

            
            <table className='mt-5 table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden' id="dataset-table">

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
                    
                {inputs.map((entry, index) => {
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
            {columns.length > 0 ? <td><button style={{marginLeft: '-3em'}} className='text-nowrap btn btn-outline-success float-start' onClick={() => addNewRow()}>+</button></td> : ""} 
        </div>
    );

    function addNewRow() {
        let newInput = [];
        for(let i=0; i<columns.length; i++) {
            // newInput.push(<DatasetInput isEntered='false' id={inputs.length}></DatasetInput>);
            if(columns[i].col_type === 'string') {
               
                newInput.push(<input className='form-control' type='text' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
            }
            else {
                newInput.push(<input className='form-control' type='number' id={'dataset-input-' + numRows + '-' + i} onKeyDown={(e) => saveInput(e, numRows, i)}></input>);
            }

        }
        if(columns.length != 0) {
            inputs[numRows] = newInput;
            setNumRows(numRows + 1);
        }

    }

    function addColumn(col) {
        for (let i=0; i<numRows; i++) {
            while(inputs[i].length <= columns.length) {
                let j = inputs[i].length;
                    inputs[i].push(<input className='form-control' type='text' id={'dataset-input-' + i + '-' + j} onKeyDown={(e) => saveInput(e, i, j)}></input>);
            }
        }
        setColumns([...columns, col]);
    }

    function saveInput(event, idRow, idCol) {
        if(event.key == 'Enter') {
            let id = 'dataset-input-' + idRow + '-' + idCol;
            let inputValue = document.getElementById(id).value;
            inputs[idRow][idCol] = <p onClick={() => changeInput(idRow, idCol)} data-value={inputValue}>{inputValue}</p>;
            forceUpdate();
        }

    }

    function changeInput(idRow, idCol) {
            let inputValue = inputs[idRow][idCol];
            inputs[idRow][idCol] = <input className='form-control' type='text' id={'dataset-input-' + idRow + '-' + idCol} onKeyDown={(e) => saveInput(e, idRow, idCol)} defaultValue={inputValue.props['data-value']}></input>;
            forceUpdate();

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