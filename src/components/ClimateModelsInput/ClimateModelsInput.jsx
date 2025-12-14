import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Papa from 'papaparse';

import ClimateCognizeService from "../../services/climateCognizeService";
import ClimateMLResponse from "../../models/ClimateMLResponse";
import ClimateDatasetResponse from "../../models/ClimateDatasetResponse";
import { ClimateModels } from "../../constants/climateModels";
import { ClimateModelTasks } from "../../constants/climateModelTasks";
import { LocalStorageKeys } from "../../constants/localStorageKeys";

const ClimateModelsInput = () => {
  const [selectedModel, setSelectedModel] = useState(ClimateModels.AUTO_DETECT);
  const [selectedTask, setSelectedTask] = useState(ClimateModelTasks.CLIMATE_DETECTION);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [inputData, setInputData] = useState("");
  const [trueLabel, setTrueLabel] = useState("yes");
  const [response, setResponse] = useState(new ClimateMLResponse());
  const [activeStep, setActiveStep] = useState(0);
  const [dataConsent, setDataConsent] = useState(null);
  const [datasetResponse, setDatasetResponse] = useState([]);
  const [importedDatasetColumns, setImportedDatasetColumns] = useState([]);
  const [importedDatasetColumnTypes, setImportedDatasetColumnTypes] = useState([]);
  const [importedDatasetRow, setImportedDatasetRow] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [error, setError] = useState();

  const handleChange = (event) => {
    setInputData(event.target.value);
  }

  const handleResponse = (resp) => {
    let mlResponse = new ClimateMLResponse()
    mlResponse['label'] = resp['label'];
    mlResponse['score'] = resp['score'];
    mlResponse['model'] = selectedModel;
    mlResponse['input'] = inputData;
    setResponse(mlResponse);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(undefined);
    setIsResponseLoading(true);
    let value;
    try {
      if (selectedTask === ClimateModelTasks.CLIMATE_DETECTION) {
        value = await ClimateCognizeService.sendToDetectModel(inputData, selectedModel);
      }
      else if (selectedTask === ClimateModelTasks.CLIMATE_SENTIMENT) {
        value = await ClimateCognizeService.sendToSentimentModel(inputData, selectedModel);
      }
      else if (selectedTask === ClimateModelTasks.CLIMATE_SPECIFICITY) {
        value = await ClimateCognizeService.sendToSpecificityModel(inputData, selectedModel);
      }
      else if (selectedTask === ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS) {
        value = await ClimateCognizeService.sendToCommitmentsModel(inputData, selectedModel);
      }
      else if (selectedTask === ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS) {
        value = await ClimateCognizeService.sendToTCFDModel(inputData, selectedModel);
      }
      if (value?.status === 200) {
        handleResponse(value.data);
      }
    }
    catch (e) {
      setError(e.message);
    }
    finally {
      setIsResponseLoading(false);
    }


  }

  const handleDatasetImport = (e) => {
    if (!e.target.files) {
      return;
    }

    var datasetObj = { "columns": [], "column_types": [], row: [] };
    let dataset_file = e.target.files[0];
    var columns = [];
    Papa.parse(dataset_file, {
      header: true,
      skipEmptyLines: true,
      complete: setDataset,
    });


  }

  const setDataset = (results) => {
    let data = results.data;
    let cols = Object.keys(data[0]);
    let colTypes = [];
    let firstRow = [];

    for (let j = 0; j < cols.length; j++) {
      let parsedNum = parseFloat(data[0][cols[j]]);
      if (!isNaN(parsedNum)) {
        data[0][cols[j]] = parsedNum;
      }
    }

    for (let i = 0; i < cols.length; i++) {
      colTypes[i] = typeof (data[0][cols[i]]);
    }
    for (let j = 0; j < cols.length; j++) {
      let dataValue = data[0][cols[j]];
      firstRow[j] = dataValue;
    }

    setImportedDatasetColumns(cols);
    setImportedDatasetColumnTypes(colTypes);
    setImportedDatasetRow(firstRow);
  }

  const handleSubmitToDataset = (event) => {
    event.preventDefault();
    ClimateCognizeService.addEntryToDataset(response.input, response.label, trueLabel, response.score, selectedModel, localStorage.getItem(LocalStorageKeys.CURRENT_USER) != null ? localStorage.getItem(LocalStorageKeys.CURRENT_USER) : "anonymous", selectedTask);

    setSelectedModel(ClimateModels.AUTO_DETECT);
    setInputData("");
    setResponse(new ClimateMLResponse());
    setDataConsent(null);
    setTrueLabel("yes");
    setSelectedTask("");

    document.getElementsByName("inputData")[0].value = "";
  }

  const handleConsent = (event) => {
    if (event.target.getAttribute("data-consent") == "yes") {
      setDataConsent(true);
    }
    else {
      setDataConsent(false);
    }
  }

  const importFromCsv = (e) => {
    e.preventDefault();
    let dataset_file = document.getElementById("import-dataset-input").files[0];
    let inputPosition = document.getElementById("import-dataset-input-position").value;
    let data = new FormData();
    data.append('dataset_file', dataset_file);
    setDatasetResponse([]);
    setDatasetResponse([...datasetResponse]);
    ClimateCognizeService.importDatasetFromCSV(data.get("dataset_file"), selectedTask, inputPosition).then((resp) => {
      if (resp.status === 200) {
        let responses = resp.data;
        for (let entry of responses) {
          let datasetEntry = new ClimateDatasetResponse();
          datasetEntry.input = entry['input'];
          datasetEntry.predictedLabel = entry['label'];
          datasetResponse.push(datasetEntry);
          setDatasetResponse([...datasetResponse]);
        }
      }
    });

  }

  const changeModelType = (e) => {
    setSelectedModel(e.target.value);
  }

  const changeInputMethodType = (e) => {
    setSelectedMethod(e.target.value);
  }

  const selectColumn = (e, index) => {
    document.getElementById("import-dataset-input-position").value = index;
    let ths = document.getElementsByClassName('column-headers');
    let tds = document.getElementsByClassName('column-first-row');
    for (let i = 0; i < ths.length; i++) {
      const element = ths[i];
      if (element != e.target) {
        element.classList.remove("selected-column");
        tds[i].classList.remove("selected-column");
      }
      else {
        element.classList.add("selected-column");
        tds[i].classList.add("selected-column");
      }
    }
  }

  const changeTaskType = (e) => {
    let defaultTrueLabel = "yes";
    let selectedModel = ClimateModels.AUTO_DETECT;
    if (e.target.value === ClimateModelTasks.CLIMATE_SENTIMENT) {
      defaultTrueLabel = "neutral";
      selectedModel = ClimateModels.CLIMATEBERT;
    }
    else if (e.target.value === ClimateModelTasks.CLIMATE_SPECIFICITY) {
      defaultTrueLabel = "specific";
      selectedModel = ClimateModels.CLIMATEBERT;
    }
    else if (e.target.value === ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS) {
      defaultTrueLabel = "none";
      selectedModel = ClimateModels.CLIMATEBERT;
    }
    else if (e.target.value === ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS) {
      selectedModel = ClimateModels.CLIMATEBERT;
    }
    setSelectedTask(e.target.value);
    setTrueLabel(defaultTrueLabel);
    setSelectedModel(selectedModel);

  }

  const changeTrueLabel = (e) => {
    setTrueLabel(e.target.value);
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setError(undefined);
  };


  return (
    <>
      <div className="mt-5">

        <div className="row">
          <h5>In this section you can try out ClimateCognize - the web interface that utilizes the latest state-of-the-art climate models that process texts and aims to battle misinformation about climate change that appears due to the rising prevalence of climate change information available to the public as well as AI generated content that everyone is using to attract attention to the text, regardless of whether it is a news article, a social media post, a blog post or any other written form</h5>
        </div>
        <div className="row">
          <h5>Using the buttons below select the task of interest first and after that select the model that you would like to use for the execution of the selected task</h5>
        </div>


        <Box sx={{ maxWidth: '100%' }}>
          <Stepper activeStep={activeStep} orientation="vertical">

            <Step key={"step-1-task"}>
              <StepLabel
                optional={
                  null
                }
              >
                <h3 id="#climate-tasks-input" className="h3 mt-5 mb-5">Select the task of interest</h3>
              </StepLabel>
              <StepContent>
                {/* Selection of task */}
                <div className="grid-radio">

                  <div class="form-check form-check-inline">
                    <label className="card">
                      <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio1Task" value={ClimateModelTasks.CLIMATE_DETECTION} checked={selectedTask === ClimateModelTasks.CLIMATE_DETECTION} onChange={changeTaskType}></input>
                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap">Climate Topic Detection</span>
                        <span className="mt-2">detection of the presence of climate-related topics in a given text</span>
                      </span>
                    </label>

                  </div>
                  <label className="card">
                    <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio2Task" value={ClimateModelTasks.CLIMATE_SENTIMENT} checked={selectedTask === ClimateModelTasks.CLIMATE_SENTIMENT} onChange={changeTaskType}></input>

                    <span class="plan-details">
                      <span class="plan-cost fw-bold text-wrap">Sentiment Analysis</span>
                      <span className="mt-2">classification of climate-related sentiment in a given text</span>
                    </span>
                  </label>
                  <label className="card">
                    <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio3Task" value={ClimateModelTasks.CLIMATE_SPECIFICITY} checked={selectedTask === ClimateModelTasks.CLIMATE_SPECIFICITY} onChange={changeTaskType}></input>

                    <span class="plan-details">
                      <span class="plan-cost fw-bold text-wrap">Determination of specificity</span>
                      <span className="mt-2">determining whether a given climate-related paragraph is specific or not</span>
                    </span>
                  </label>
                  <label className="card h-100">
                    <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio4Task" value={ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS} checked={selectedTask === ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS} onChange={changeTaskType}></input>

                    <span class="plan-details">
                      <span class="plan-cost fw-bold text-wrap">Identification of Climate Commitments and Actions</span>
                      <span className="mt-2">identification of whether a given paragraph is about climate-related commitments and actions or not</span>
                    </span>
                  </label>
                  <label className="card">
                    <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio5Task" value={ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS} checked={selectedTask === ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS} onChange={changeTaskType}></input>

                    <span class="plan-details">
                      <span class="plan-cost fw-bold text-wrap">Assignment of a climate disclosure category</span>
                      <span className="mt-2">assigning a climate disclosure category to climate-related paragraphs based on the four categories of the recommendations of the Task Force on Climate-related Financial Disclosures (TCFD)</span>
                    </span>
                  </label>
                </div>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      className="app-primary-bg-color"
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {'Select'}
                    </Button>
                    <Button
                      disabled={true}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>

            <Step key={"step-2-task"}>
              <StepLabel
                optional={
                  null
                }
              >
                <h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
              </StepLabel>
              <StepContent>

                {/* Climate Detection */}
                {selectedTask === ClimateModelTasks.CLIMATE_DETECTION && <div>
                  <div className="grid-radio-4">
                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={ClimateModels.AUTO_DETECT} checked={selectedModel === ClimateModels.AUTO_DETECT} onChange={changeModelType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap">Auto-detect</span>
                        <span className="mt-2">Auto-detect which model is best for the task, depending on whether the input is one sentence only or one or more paragraphs</span>
                      </span>
                    </label>
                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={ClimateModels.CLIMATEBERT} checked={selectedModel === ClimateModels.CLIMATEBERT} onChange={changeModelType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Detector</span>
                        <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for detecting climate-related paragraphs</span>
                      </span>
                    </label>
                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio3" value={ClimateModels.PERSONAL_MODEL} checked={selectedModel === ClimateModels.PERSONAL_MODEL} onChange={changeModelType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap">ClimateCognize Detector - Our model</span>
                        <span className="mt-2">Our own fine-tuned model for detecting climate-related topics in sentences</span>
                      </span>
                    </label>
                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value={ClimateModels.CHATGPT} checked={selectedModel === ClimateModels.CHATGPT} onChange={changeModelType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg></span> ChatGPT</span>
                        <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
                      </span>
                    </label>
                  </div>
                </div>}


                {/* Climate Sentiment */}
                {selectedTask === ClimateModelTasks.CLIMATE_SENTIMENT && <div>
                  <div className="grid-radio-2">

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={ClimateModels.CLIMATEBERT} checked={selectedModel === ClimateModels.CLIMATEBERT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Sentiment</span>
                        <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into the climate-related sentiment classes opportunity, neutral, or risk.</span>
                      </span>
                    </label>
                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value={ClimateModels.CHATGPT} checked={selectedModel === ClimateModels.CHATGPT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg></span> ChatGPT</span>
                        <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
                      </span>
                    </label>
                  </div>
                </div>}

                {/* Climate Specificity */}
                {selectedTask === ClimateModelTasks.CLIMATE_SPECIFICITY && <div>
                  <h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
                  <div className="grid-radio-2">

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={ClimateModels.CLIMATEBERT} checked={selectedModel === ClimateModels.CLIMATEBERT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Specificity</span>
                        <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into specific and non-specific paragraphs.</span>
                      </span>
                    </label>

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value={ClimateModels.CHATGPT} checked={selectedModel === ClimateModels.CHATGPT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg></span> ChatGPT</span>
                        <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
                      </span>
                    </label>
                  </div>
                </div>}

                {/* Climate Commitments and actions */}
                {selectedTask === ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS && <div>
                  <div className="grid-radio-2">

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={ClimateModels.CLIMATEBERT} checked={selectedModel === ClimateModels.CLIMATEBERT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Commitments and Actions</span>
                        <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into paragraphs being about climate commitments and actions and paragraphs not being about climate commitments and actions.</span>
                      </span>
                    </label>

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value={ClimateModels.CHATGPT} checked={selectedModel === ClimateModels.CHATGPT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg></span> ChatGPT</span>
                        <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
                      </span>
                    </label>
                  </div>
                </div>}

                {/* Climate TCFD Recommendations */}
                {selectedTask === ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS && <div>
                  <div className="grid-radio-2">

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={ClimateModels.CLIMATEBERT} checked={selectedModel === ClimateModels.CLIMATEBERT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap">ClimateBERT TCFD Recommendations Classifier</span>
                        <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into the four TCFD recommendation categories (fsb-tcfd.org).</span>
                      </span>
                    </label>

                    <label className="card">
                      <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value={ClimateModels.CHATGPT} checked={selectedModel === ClimateModels.CHATGPT} onChange={changeModelType}></input>

                      <span class="plan-details">
                        <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg></span> ChatGPT</span>
                        <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
                      </span>
                    </label>
                  </div>
                </div>}

                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      className="app-primary-bg-color"
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {'Select'}
                    </Button>
                    <Button
                      disabled={false}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>

            <Step key={"step-3-task"}>
              <StepLabel
                optional={
                  null
                }
              >
                <h3 id="#climate-models-input" className="h3 mt-5 mb-5">Data Input</h3>
              </StepLabel>
              <StepContent>
                {/* Climate Detection */}
                <div>
                  <div className="grid-radio-2">
                    <label className="card">
                      <input class="radio" type="radio" name="dataInputOptions" id="dataInputRadio1" value="text-input" checked={selectedMethod === "text-input"} onChange={changeInputMethodType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap">Input your data</span>
                        <span className="mt-2">Enter your input by typing it in in a text area (you can enter just some words, a sentence or whole paragraphs and texts, the text area is adaptable to all sizes)</span>
                      </span>
                    </label>
                    <label className="card">
                      <input class="radio" type="radio" name="dataInputOptions" id="dataInputRadio2" value="import-dataset" checked={selectedMethod === "import-dataset"} onChange={changeInputMethodType}></input>

                      <span class="plan-details pt-4">
                        <span class="plan-cost fw-bold text-wrap">Import a whole dataset to predict</span>
                        <span className="mt-2">Import a dataset in .CSV format, select the column that contains the inputs and get predictions for the whole dataset</span>
                      </span>
                    </label>
                  </div>
                </div>

                {selectedMethod === "text-input" &&

                  <form onSubmit={handleSubmit} id="models-form" >
                    <div className="mt-5 mb-3 w-50 mx-auto">
                      <label htmlFor="inputData" className="form-label">In the text area below enter your input (you can enter just some words, a sentence or whole paragraphs and texts, the text area is adaptable to all sizes)</label>
                      <textarea rows="1" placeholder="Enter the text that you want to validate here" class="form-control" type="text" name="inputData" onChange={handleChange}></textarea>


                    </div>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          type="submit"
                          className="app-dark-bg-color"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {'Compute'}
                        </Button>
                        <Button
                          disabled={false}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </form>

                }

                {selectedMethod === "import-dataset" &&

                  <form className="w-50 mt-5 mx-auto" onSubmit={(e) => importFromCsv(e)} encType="multipart/form-data">


                    <div className="mb-3 input-group">
                      <input className="form-control w-50" accept=".csv" type="file" id="import-dataset-input" onChange={handleDatasetImport} />
                    </div>
                    <div className="mb-3 input-group">
                      <input style={{ display: "none" }} className="form-control" type="number" id="import-dataset-input-position" placeholder="Enter the position of the dataset cells that contain the input here such that the inputs can be appropriatelly loaded. Use a 0-based integer for the position." />
                    </div>



                    {importedDatasetColumns.length > 0 &&



                      <div className="mt-5 mb-5">

                        <p className="mb-5">Select the column that contains the input</p>

                        <div className='row mt-5' style={{ marginLeft: "-8em" }}>
                          <div className='col'>
                            <p className='float-start fw-bold'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z" />
                            </svg> Dataset preview</p>
                          </div>
                        </div>

                        <table style={{ marginLeft: "-8em" }} className='table table-responsive table-hover table-striped table-bordered rounded-3 overflow-hidden' id="dataset-table">

                          <thead className='text-start'>
                            <tr>
                              {importedDatasetColumns.map((entry, index) => {
                                return (
                                  <th className="column-headers" onClick={(e) => selectColumn(e, index)}>{entry}<br></br><span className='text-muted fw-light active'>{importedDatasetColumnTypes[index]}</span></th>
                                );
                              })}
                            </tr>
                          </thead>

                          <tbody className='table-group-divider'>
                            <tr>
                              {importedDatasetRow.map((entry, index) => {
                                return (

                                  <td className="column-first-row">{entry}</td>


                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    }


                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          type="submit"
                          className="app-dark-bg-color"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {'Compute'}
                        </Button>
                        <Button
                          disabled={false}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>

                  </form>

                }

              </StepContent>
            </Step>

          </Stepper>
          {isResponseLoading && <CircularProgress color="success" />}
          {error && <Paper square elevation={0} sx={{ p: 3 }}>
            {/* <Typography>All steps completed - you&apos;re finished</Typography> */}
            <p className="text-danger fs-5">An error occured: {error}</p>
            <Button className="btn btn-app btn-dark text-light fw-bold app-primary-bg-color" onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Try again
            </Button>
          </Paper>}

          {activeStep === 2 && (datasetResponse.length > 0 || response.label.length > 0) && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              {/* <Typography>All steps completed - you&apos;re finished</Typography> */}
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Do another prediction
              </Button>
            </Paper>
          )}
        </Box>

        {datasetResponse.length > 0 &&
          <div className='col table-responsive mt-5'>

            <table className="table table-striped table-hover">
              <thead className='table-success'>
                <tr>
                  <th>Input</th>
                  <th>Predicted Label</th>
                </tr>
              </thead>
              <tbody>
                {datasetResponse.map((resp) => {
                  return (
                    <tr>
                      <td>{resp.input}</td>
                      <td>{resp.predictedLabel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>


          </div>
        }



        <div className="mt-5 mb-5">
          {response.label.length > 0 && <div>
            <h2>Response from the model</h2>
            <h4>Label: <span className="fw-normal">{response.label}</span></h4>
            <h4>Score: <span className="fw-normal">{response.score}</span></h4>


            {(dataConsent == null || dataConsent) && <div className="row mt-5 mb-5"><p>Do you want to contribute to the development of better NLP models for solving climate change-related misinformation?</p>
              <p>Help us by providing your input as data we can use to further train and fine-tune our models on. Data provided and annotated by the users will be used in a community-provided dataset that will be incorporated in training and testing of our models.</p>
              <p>All that you need to do to help us is give consent so that your data can be used in this dataset and annotate the correct label in case the model predicted the wrong label.</p>

              {(dataConsent == null) && <div className="row d-flex flex-row "><a onClick={handleConsent} data-consent="yes" role="button" className="pe-auto app-success-color me-3 text-underline d-inline">Yes, I consent</a> <a onClick={handleConsent} role="button" data-consent="no" className="pe-auto text-danger me-3 text-underline d-inline">No, I do not consent</a></div>}
              {(dataConsent) && <div className="mt-5 w-50 mx-auto">
                <p>Please select the correct label for your input</p>
                <div className="row mb-3 mt-3">Real label:</div>
                <form onSubmit={handleSubmitToDataset}>
                  {(() => {
                    if (selectedTask === ClimateModelTasks.CLIMATE_DETECTION || selectedTask === ClimateModelTasks.CLIMATE_COMMITMENTS_AND_ACTIONS) {
                      return (
                        <select onChange={changeTrueLabel} class="form-select" aria-label="Default select example">

                          <option selected={trueLabel === "yes"} value="yes">Yes</option>
                          <option selected={trueLabel === "no"} value="no">No</option>
                        </select>

                      );
                    }
                    else if (selectedTask === ClimateModelTasks.CLIMATE_DETECTION) {
                      return (
                        <select onChange={changeTrueLabel} class="form-select" aria-label="Default select example">

                          <option selected={trueLabel === "neutral"} value="neutral">Neutral</option>
                          <option selected={trueLabel === "opportunity"} value="opportunity">Opportunity</option>
                          <option selected={trueLabel === "risk"} value="risk">Risk</option>
                        </select>

                      );
                    }
                    else if (selectedTask === ClimateModelTasks.CLIMATE_SPECIFICITY) {
                      return (
                        <select onChange={changeTrueLabel} class="form-select" aria-label="Default select example">

                          <option selected={trueLabel === "specific"} value="specific">Specific</option>
                          <option selected={trueLabel === "non-specific"} value="non-specific">Non-Specific</option>
                        </select>

                      );
                    }
                    else if (selectedTask === ClimateModelTasks.CLIMATE_TCFD_RECOMMENDATIONS) {
                      return (
                        <select onChange={changeTrueLabel} class="form-select" aria-label="Default select example">

                          <option selected={trueLabel === "none"} value="none">None</option>
                          <option selected={trueLabel === "metrics"} value="metrics">Metrics</option>
                          <option selected={trueLabel === "strategy"} value="strategy">Strategy</option>
                          <option selected={trueLabel === "risk"} value="risk">Risk</option>
                          <option selected={trueLabel === "governance"} value="governance">Governance</option>
                        </select>

                      );
                    }
                  })()}


                  <button className="btn btn-app app-success-bg-color mt-2 text-light" type="submit">Submit to dataset</button>
                </form>
              </div>}
            </div>

            }


          </div>}
        </div>

        <hr></hr>

        <div className="home-info-div mt-5 mb-5">

          <div className="container text-start">
            <div className="row">

              <div className="col-1"><img src='images\climate-change.png' className='ms-5 d-inline' style={{ width: "3em" }}></img></div>
              <div className="col-5"><h3 className="h3 d-inline">ClimateCognize Basic Membership</h3>
                <small class="float-end d-inline-flex mb-3 px-2 py-1 fw-semibold text-success bg-success bg-opacity-10 border border-success border-opacity-10 rounded-2">free</small>

              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <h5 className="text-muted">ClimateCognize is the ultimate interface for all climate-related NLP models and datasets.</h5>
                <h5 className="text-muted">Join the community today and start exploring, experimenting and collaborating with the Machine Learning technology.</h5>
              </div>
              <div className="col-2">
                <a type="button" className="btn btn-dark rounded-3 py-2 link-app" href="/register">➞ Sign up</a>
              </div>
            </div>
          </div>
        </div>

        <hr></hr>

        <div className="pro-info bg-dark full-width text-start pt-2 pb-2">
          <div className="container mt-5 mb-5 border border-light rounded-4 border-opacity-50 ps-5 shadow">
            <div className="row pt-5 pb-5">
              <div className="col-5">
                <h2 className="text-white d-inline me-3 fs-italic">Pro Account</h2>
                <small class="pro-badge fs-4 d-inline-flex mb-3 px-2 py-1 fw-semibold text-light ">PRO</small>

              </div>
              <div className="col-2">

              </div>

            </div>
            <div className="row text-light">
              <div className="col">
                <p className=" fs-5">
                  One time subscription to access exclusive features.
                </p>
              </div>
              <div className="col">
                <ul style={{ listStyleType: 'none' }}>
                  <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg> Early access to new features</li>
                  <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg> Get a pro badge on your profile</li>
                </ul>
              </div>
              <div className="col">
                <ul style={{ listStyleType: 'none' }}>
                  <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg> Private repositories for datasets</li>
                  <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                  </svg> Advanced reports for your datasets</li>
                </ul>

              </div>
            </div>
            <div className="row pb-5">
              <div className="col-2">
                <a type="button" className="btn btn-light rounded-3 py-2 link-app" href="/pricing">➞ Get PRO</a>

              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}


export default ClimateModelsInput;