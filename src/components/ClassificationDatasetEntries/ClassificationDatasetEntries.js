import React, {Component} from 'react';
import ClimateCognizeService from '../../repository/climateCognizeRepository';
import ClassificationDatasetEntry from '../../models/ClassificationDatasetEntry';

class ClassificationDatasetEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "datasetEntries": [],
            "displayedEntries": [],
            "selectedEntry": new ClassificationDatasetEntry()
        }
    }

    getDatasetEntries = () => {
       ClimateCognizeService.getAllDatasetEntries().then( (response) => {
            if(response.status === 200) {
                for(let entry of response.data) {
                    let datasetEntry = new ClassificationDatasetEntry();
                    datasetEntry.id = entry['id'];
                    datasetEntry.input = entry['input'];
                    datasetEntry.model = entry['model'];
                    datasetEntry.predictedLabel = entry['predictedLabel'];
                    datasetEntry.score = entry['score'];
                    datasetEntry.submittedBy = entry['submittedBy'];
                    datasetEntry.task = entry['task'];
                    datasetEntry.trueLabel = entry['trueLabel'];
                    this.state.datasetEntries.push(datasetEntry);
                    this.state.displayedEntries.push(datasetEntry);
                    this.setState({
                        "datasetEntries" : [...this.state.datasetEntries],
                        "displayedEntries" : [...this.state.displayedEntries]
                    });
                }
            }
            else {
                console.log("ERROR WITH GET");
            }
        }).catch((reason) => window.location.href="/login?errorMsg=You are not authorized to access this resource. Please log in with an appropriate account that has the permission.");
    }

    getEntry = async (id) => {
       await ClimateCognizeService.getEntryFromDataset(id).then((response) => {
            let datasetEntry = new ClassificationDatasetEntry();
            if(response.status === 200) {
                let data = response.data;
                datasetEntry.id = data['id'];
                datasetEntry.input = data['input'];
                datasetEntry.model = data['model'];
                datasetEntry.predictedLabel = data['predictedLabel'];
                datasetEntry.score = data['score'];
                datasetEntry.submittedBy = data['submittedBy'];
                datasetEntry.task = data['task'];
                datasetEntry.trueLabel = data['trueLabel'];
                this.setState(prevState => ({
                    selectedEntry: {                   // object that we want to update
                        ...prevState.selectedEntry,    // keep all other key-value pairs
                        id: datasetEntry.id,
                        input: datasetEntry.input,
                        model: datasetEntry.model,
                        predictedLabel: datasetEntry.predictedLabel,
                        score: datasetEntry.score,
                        submittedBy: datasetEntry.submittedBy,
                        task: datasetEntry.task,
                        trueLabel: datasetEntry.trueLabel
                    }
                }))
            }
        });
    }

    deleteEntry = async (id) => {
        await this.getEntry(id);
        ClimateCognizeService.removeEntryFromDataset(id);
        window.location.reload();
    }

    componentDidMount() {
        this.getDatasetEntries();
    }

    searchEntries = () => {
        let query = document.getElementsByName("entries-search")[0].value;
        query = query.toLowerCase();
        if(query.length > 0) {
            this.state.displayedEntries = this.state.datasetEntries.filter((obj) => {
                return obj['input'].toLowerCase().includes(query) || obj['id'] == query || obj['predictedLabel'].toLowerCase().includes(query)
                || obj['trueLabel'].toLowerCase().includes(query) || obj['submittedBy'].toLowerCase().includes(query) || obj['model'].toLowerCase().includes(query)
                || obj['task'].toLowerCase().includes(query);
            });
            this.setState({
                "displayedEntries" : [...this.state.displayedEntries]
            });
        }
        else {
            this.setState({
                "displayedEntries" : [...this.state.datasetEntries]
            });
        }

    }

    filterByTask = () => {
        let query = document.getElementsByName("task-filter")[0].value;
        query = query.toLowerCase();
        if(query.length > 0 && query !== "none") {
            this.state.displayedEntries = this.state.datasetEntries.filter((obj) => {
                return obj['task'].toLowerCase().includes(query);
            });
            this.setState({
                "displayedEntries" : [...this.state.displayedEntries]
            });
        }
        else if(query === "none") {
            this.state.displayedEntries = Array.from(this.state.datasetEntries);
            this.setState({
                "displayedEntries" : [...this.state.displayedEntries]
            });
        }

    }

    exportToCsv = () => {
        ClimateCognizeService.exportDatasetToCSV();
    }

    TrainModel = () => {
        ClimateCognizeService.trainDetectModel();
    }

    render() {
        return (

            <div className='col table-responsive'>

                <div className='d-flex justify-content-between'>
                <div className='mb-3'>
                <input onChange={this.searchEntries} name='entries-search' type="text" className='form-control align-self-start' placeholder='Search...'></input>
            </div>

            <div className='mb-3'>
            <select onChange={this.filterByTask} name="task-filter" class="form-select align-self-end" aria-label="Default select example">
  <option selected value="none">Filter by task</option>
  <option value="climate_detection">climate_detection</option>
  <option value="climate_sentiment">climate_sentiment</option>
  <option value="climate_specificity">climate_specificity</option>
  <option value="climate_commitments_and_actions">climate_commitments_and_actions</option>
  <option value="climate_tcfd_recommendations">climate_tcfd_recommendations</option>
</select>
            </div>
                </div>
        
                <table className="table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden">
                    <thead className='table-success'>
                    <tr>
                        {Object.getOwnPropertyNames(new ClassificationDatasetEntry()).map( (key, index) => {
                            return (<th key={index}>{key}</th>);
                        })}
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.displayedEntries.map((entry, index) => {
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
                                    <td><button onClick={() => this.deleteEntry(entry.id)} className='btn btn-danger'>x</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {/* <tbody>
                        {this.state.datasetEntries.map(entry => {
                            <tr></tr>
                        })}
                    </tbody> */}
                </table>
                
                <a href='http://localhost:9090/api/climate/dataset/export' className='btn btn-outline-success mt-3'>Export to CSV</a>
                {/* <button onClick={this.TrainModel} className='btn btn-app app-primary-bg-color mt-3'>Train Detect Model</button> */}
            </div>
        );
    }

}

export default ClassificationDatasetEntries;