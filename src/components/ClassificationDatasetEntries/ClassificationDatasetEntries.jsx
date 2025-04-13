import React, { useEffect, useState } from 'react';

import ClimateCognizeService from '../../services/climateCognizeService';
import ClassificationDatasetEntry from '../../models/ClassificationDatasetEntry';
import { ClimateModelTasks } from '../../constants/climateModelTasks';

const ClassificationDatasetEntries = () => {
    const [datasetEntries, setDatasetEntries] = useState([]);
    const [displayedEntries, setDisplayedEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(new ClassificationDatasetEntry());

    const getDatasetEntries = () => {
        ClimateCognizeService.getAllDatasetEntries().then((response) => {
            if (response.status === 200) {
                for (let entry of response.data) {
                    let datasetEntry = new ClassificationDatasetEntry();
                    datasetEntry.id = entry['id'];
                    datasetEntry.input = entry['input'];
                    datasetEntry.model = entry['model'];
                    datasetEntry.predictedLabel = entry['predictedLabel'];
                    datasetEntry.score = entry['score'];
                    datasetEntry.submittedBy = entry['submittedBy'];
                    datasetEntry.task = entry['task'];
                    datasetEntry.trueLabel = entry['trueLabel'];
                    setDatasetEntries((prevDatasetEntries) => [...prevDatasetEntries, datasetEntry]);
                    setDisplayedEntries((prevDisplayedEntries) => [...prevDisplayedEntries, datasetEntry]);
                }
            }
            else {
                console.error("Error while fetching dataset");
            }
        }).catch((reason) => window.location.href = "/login?errorMsg=You are not authorized to access this resource. Please log in with an appropriate account that has the permission.");
    }

    useEffect(() => getDatasetEntries(), []);

    const getEntry = async (id) => {
        await ClimateCognizeService.getEntryFromDataset(id).then((response) => {
            let datasetEntry = new ClassificationDatasetEntry();
            if (response.status === 200) {
                let data = response.data;
                datasetEntry.id = data['id'];
                datasetEntry.input = data['input'];
                datasetEntry.model = data['model'];
                datasetEntry.predictedLabel = data['predictedLabel'];
                datasetEntry.score = data['score'];
                datasetEntry.submittedBy = data['submittedBy'];
                datasetEntry.task = data['task'];
                datasetEntry.trueLabel = data['trueLabel'];
                setSelectedEntry(prevState => ({
                    ...prevState,
                    id: datasetEntry.id,
                    input: datasetEntry.input,
                    model: datasetEntry.model,
                    predictedLabel: datasetEntry.predictedLabel,
                    score: datasetEntry.score,
                    submittedBy: datasetEntry.submittedBy,
                    task: datasetEntry.task,
                    trueLabel: datasetEntry.trueLabel

                }));
            }
        });
    }

    const deleteEntry = async (id) => {
        await getEntry(id);
        ClimateCognizeService.removeEntryFromDataset(id);
        window.location.reload();
    }

    const searchEntries = () => {
        let query = document.getElementsByName("entries-search")[0].value;
        query = query.toLowerCase();
        if (query.length > 0) {
            const filteredEntries = datasetEntries.filter((obj) => {
                return obj['input'].toLowerCase().includes(query) || obj['id'] == query || obj['predictedLabel'].toLowerCase().includes(query)
                    || obj['trueLabel'].toLowerCase().includes(query) || obj['submittedBy'].toLowerCase().includes(query) || obj['model'].toLowerCase().includes(query)
                    || obj['task'].toLowerCase().includes(query);
            });
            setDisplayedEntries(filteredEntries);
        }
        else {
            setDisplayedEntries([...datasetEntries]);
        }

    }

    const filterByTask = () => {
        let query = document.getElementsByName("task-filter")[0].value;
        query = query.toLowerCase();
        if (query.length > 0 && query !== "none") {
            const filteredEntries = datasetEntries.filter((obj) => {
                return obj['task'].toLowerCase().includes(query);
            });
            setDisplayedEntries(filteredEntries);
        }
        else if (query === "none") {
            setDisplayedEntries([...datasetEntries]);
        }

    }

    const exportToCsv = () => {
        ClimateCognizeService.exportDatasetToCSV();
    }

    const TrainModel = () => {
        ClimateCognizeService.trainDetectModel();
    }

    return (

        <div className='col table-responsive'>

            <div className='d-flex justify-content-between'>
                <div className='mb-3'>
                    <input onChange={searchEntries} name='entries-search' type="text" className='form-control align-self-start' placeholder='Search...'></input>
                </div>

                <div className='mb-3'>
                    <select onChange={filterByTask} name="task-filter" class="form-select align-self-end" aria-label="Default select example">
                        <option selected value="none">Filter by task</option>
                        <option value={ClimateModelTasks.CLIMATE_DETECTION}>climate_detection</option>
                        <option value={ClimateModelTasks.CLIMATE_SENTIMENT}>climate_sentiment</option>
                        <option value={ClimateModelTasks.CLIMATE_SPECIFICITY}>climate_specificity</option>
                        <option value={ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS}>climate_commitments_and_actions</option>
                        <option value={ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS}>climate_tcfd_recommendations</option>
                    </select>
                </div>
            </div>

            <table className="table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden">
                <thead className='table-success'>
                    <tr>
                        {Object.getOwnPropertyNames(new ClassificationDatasetEntry()).map((key, index) => {
                            return (<th key={index}>{key}</th>);
                        })}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {displayedEntries.map((entry) => {
                        return (
                            <tr>
                                <td>{entry.id}</td>
                                <td>{entry.input}</td>
                                <td>{entry.predictedLabel}</td>
                                <td>{entry.trueLabel}</td>
                                <td>{entry.score}</td>
                                <td>{entry.submittedBy}</td>
                                <td>{entry.model}</td>
                                <td>{entry.task}</td>
                                <td><button onClick={() => deleteEntry(entry.id)} className='btn btn-danger'>x</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <a href='http://localhost:9090/api/climate/dataset/export' className='btn btn-outline-success mt-3'>Export to CSV</a>
        </div>
    );
}

export default ClassificationDatasetEntries;