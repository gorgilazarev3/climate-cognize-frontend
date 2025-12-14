import React, { useEffect, useState } from 'react';

import ClimateCognizeService from '../../services/climateCognizeService';
import ClimateMLModel from '../../models/ClimateMLModel';

const ClimateMLModels = () => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [message, setMessage] = useState("");
    const [latestF1Score, setLatestF1Score] = useState(0.0);


    useEffect(() => getModels(), []);

    const getModels = () => {
        ClimateCognizeService.getAllModels().then((response) => {
            if (response.status === 200) {
                for (let model of response.data) {
                    let climateModel = new ClimateMLModel();
                    climateModel.model = model['model'];
                    climateModel.previousF1Score = model['previousF1Score'];
                    climateModel.currentF1Score = model['currentF1Score'];
                    setModels((prevModels) => [...prevModels, climateModel]);
                }
            }
            else {
                console.log("ERROR WITH GET");
            }
        }).catch((reason) => window.location.href = "/login?errorMsg=You are not authorized to access this resource. Please log in with an appropriate account that has the permission.");
    }


    const trainModel = async (model) => {
        ClimateCognizeService.trainModel(model);
        setMessage("The model " + model + " is currently being trained, please wait for a moment.");
        setSelectedModel(model);
    }

    const evaluateModel = async (model) => {
        ClimateCognizeService.evaluateModel(model).then((resp) => {
            if (resp.status === 200) {
                setLatestF1Score(resp.data);
            }
        });
        setMessage("The model " + model + " is currently being evaluated, please wait for a moment and refresh to get the results.");
        setSelectedModel(model);
    }

    const refreshModels = async () => {
        let latestResults = "";
        let bestResults = "";
        let percentageLatest = 0.0;
        let percentageBest = 0.0;
        let chosenModel = models.find((m) => m.model === selectedModel);
        if (chosenModel != null) {
            if (latestF1Score != 0.0) {
                if (latestF1Score > chosenModel.previousF1Score) {
                    latestResults = "better";
                }
                else if (latestF1Score < chosenModel.previousF1Score) {
                    latestResults = "worse";
                }
                else {
                    latestResults = "equal";
                }
                if (latestF1Score > chosenModel.currentF1Score) {
                    bestResults = "better";
                }
                else if (latestF1Score < chosenModel.currentF1Score) {
                    bestResults = "worse";
                }
                else {
                    bestResults = "equal";
                }
                percentageLatest = Math.abs(latestF1Score / chosenModel.previousF1Score);
                percentageBest = Math.abs(latestF1Score / chosenModel.currentF1Score);
            }
            let latestMessage = latestResults !== "equal" ? percentageLatest.toFixed(2) + "% " + latestResults : latestResults;
            latestMessage += " results since the last training and ";
            let bestMessage = bestResults !== "equal" ? percentageBest.toFixed(2) + "% " + bestResults : bestResults;
            bestMessage += " results from the current best results";
            setMessage("The latest training of the model " + chosenModel.model + " yielded " + latestMessage + bestMessage);
        }

    }

    return (

        <div className='col table-responsive'>

            <p className='mb-5 mt-5'>Below is the table with all the available models in this interface. The currentF1Score column indicates the best F1 score achieved by the model and the current F1 score of the saved model, while the previousF1Score column indicates the F1 score that the model has achieved since the last training with the dataset from this platform.</p>

            <table className="table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden">
                <thead className='table-success'>
                    <tr>
                        {Object.getOwnPropertyNames(new ClimateMLModel()).map((key, index) => {
                            return (<th key={index}>{key}</th>);
                        })}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {models.map((model, index) => {
                        return (
                            <tr key={`${model.model}-${index}`}>
                                <td>{model.model}</td>
                                <td>{model.currentF1Score}</td>
                                <td>{model.previousF1Score}</td>
                                <td><button onClick={() => trainModel(model.model)} className='btn btn-app app-primary-bg-color text-light fw-bold'>Train Model</button></td>
                                <td><button onClick={() => evaluateModel(model.model)} className='btn btn-app text-white app-dark-bg-color fw-bold'>Evaluate Model</button></td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            <button className='btn btn-app app-primary-bg-color text-light fw-bold' onClick={refreshModels}>Refresh</button>

            <p className='mt-5'>{message}</p>


        </div>
    );
}

export default ClimateMLModels;