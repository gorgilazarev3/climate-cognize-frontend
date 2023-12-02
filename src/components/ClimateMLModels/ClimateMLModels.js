import React, {Component} from 'react';
import ClimateCognizeService from '../../repository/climateCognizeRepository';
import ClassificationDatasetEntry from '../../models/ClassificationDatasetEntry';
import ClimateMLModel from '../../models/ClimateMLModel';

class ClimateMLModels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "models": [],
            "selectedModel": "",
            "message": "",
            "latestF1Score": 0.0 
        }
    }

    getModels = () => {
       ClimateCognizeService.getAllModels().then( (response) => {
            if(response.status === 200) {
                for(let model of response.data) {
                    let climateModel = new ClimateMLModel();
                    climateModel.model = model['model'];
                    climateModel.previousF1Score = model['previousF1Score'];
                    climateModel.currentF1Score = model['currentF1Score'];
                    this.state.models.push(climateModel);
                    this.setState({
                        "models" : [...this.state.models]
                    });
                }
            }
            else {
                console.log("ERROR WITH GET");
            }
        }).catch((reason) => window.location.href="/login?errorMsg=You are not authorized to access this resource. Please log in with an appropriate account that has the permission.");
    }


    trainModel = async (model) => {
        ClimateCognizeService.trainModel(model);
        this.setState({
            "message" : "The model " + model + " is currently being trained, please wait for a moment.",
            "selectedModel" : model

        });
    }

    evaluateModel = async (model) => {
        ClimateCognizeService.evaluateModel(model).then((resp) => {
            if(resp.status === 200) {
                this.setState({
                    "latestF1Score" : resp.data
                });
            }
        });
        this.setState({
            "message" : "The model " + model + " is currently being evaluated, please wait for a moment and refresh to get the results.",
            "selectedModel" : model
        });
    }

    refreshModels = async () => {
        let resultsLatest = "";
        let resultsBest = "";
        let percentageLatest = 0.0;
        let percentageBest = 0.0;
        let selectedModel = this.state.models.find((m) => m.model === this.state.selectedModel);
        if(selectedModel != null) {
            if(this.state.latestF1Score != 0.0) {
                if(this.state.latestF1Score > selectedModel.previousF1Score) {
                    resultsLatest = "better";
                }
                else if(this.state.latestF1Score < selectedModel.previousF1Score) {
                    resultsLatest = "worse";
                }
                else {
                    resultsLatest = "equal";
                }
                if(this.state.latestF1Score > selectedModel.currentF1Score) {
                    resultsBest = "better";
                }
                else if(this.state.latestF1Score < selectedModel.currentF1Score) {
                    resultsBest = "worse";
                }
                else {
                    resultsBest = "equal";
                }
                percentageLatest = Math.abs(this.state.latestF1Score/selectedModel.previousF1Score);
                percentageBest = Math.abs(this.state.latestF1Score/selectedModel.currentF1Score);
            }
            let latestString = resultsLatest !== "equal" ? percentageLatest.toFixed(2) + "% " + resultsLatest : resultsLatest;
            latestString+= " results since the last training and ";
            let bestString = resultsBest !== "equal" ? percentageBest.toFixed(2) + "% " + resultsBest : resultsBest;
            bestString+= " results from the current best results";
            this.setState({
                "message" : "The latest training of the model " + selectedModel.model + " yielded " + latestString + bestString
            });
        }
        
    }

    componentDidMount() {
        this.getModels();
    }



    render() {
        return (

            <div className='col table-responsive'>

            <p className='mb-5 mt-5'>Below is the table with all the available models in this interface. The currentF1Score column indicates the best F1 score achieved by the model and the current F1 score of the saved model, while the previousF1Score column indicates the F1 score that the model has achieved since the last training with the dataset from this platform.</p>
        
                <table className="table table-striped table-hover">
                    <thead className='table-success'>
                    <tr>
                        {Object.getOwnPropertyNames(new ClimateMLModel()).map( (key, index) => {
                            return (<th key={index}>{key}</th>);
                        })}
                        <th></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.models.map((model, index) => {
                            return (
                                <tr>
                                    <td>{model.model}</td>
                                    <td>{model.currentF1Score}</td>
                                    <td>{model.previousF1Score}</td>
                                    <td><button onClick={() => this.trainModel(model.model)} className='btn btn-app app-primary-bg-color'>Train Model</button></td>
                                    <td><button onClick={() => this.evaluateModel(model.model)} className='btn btn-app app-success-bg-color text-white'>Evaluate Model</button></td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>

                <button className='btn btn-app app-primary-bg-color' onClick={this.refreshModels}>Refresh</button>

                <p className='mt-5'>{this.state.message}</p>
                

            </div>
        );
    }

}

export default ClimateMLModels;