import React, { Component } from "react";
import ClimateCognizeService from "../../repository/climateCognizeRepository";
import ClimateMLResponse from "../../models/ClimateMLResponse";
import ClimateDatasetResponse from "../../models/ClimateDatasetResponse";


class ClimateModelsInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModel: "auto-detect",
            inputData: "",
            response: new ClimateMLResponse(),
            datasetResponse: [],
            dataConsent: null,
            trueLabel: "yes",
            selectedTask: "climate_detection"
        }
        this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({inputData: event.target.value});
  }

  handleResponse(resp) {
    let mlResponse = new ClimateMLResponse()
    mlResponse['label'] = resp['label'];
    mlResponse['score'] = resp['score'];
    mlResponse['model'] = this.state.selectedModel;
    mlResponse['input'] = this.state.inputData;
    this.setState({response: mlResponse});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.selectedTask === "climate_detection") {
      ClimateCognizeService.sendToDetectModel(this.state.inputData, this.state.selectedModel).then((value) => {
        if(value.status === 200) {
          this.handleResponse(value.data);
        }
      });
    }
    else if(this.state.selectedTask === "climate_sentiment") {
      ClimateCognizeService.sendToSentimentModel(this.state.inputData, this.state.selectedModel).then((value) => {
        if(value.status === 200) {
          this.handleResponse(value.data);
        }
      });
    }
    else if(this.state.selectedTask === "climate_specificity") {
      ClimateCognizeService.sendToSpecificityModel(this.state.inputData, this.state.selectedModel).then((value) => {
        if(value.status === 200) {
          this.handleResponse(value.data);
        }
      });
    }
    else if(this.state.selectedTask === "climate_commitments_and_actions") {
      ClimateCognizeService.sendToCommitmentsModel(this.state.inputData, this.state.selectedModel).then((value) => {
        if(value.status === 200) {
          this.handleResponse(value.data);
        }
      });
    }
    else if(this.state.selectedTask === "climate_tcfd_recommendations") {
      ClimateCognizeService.sendToTCFDModel(this.state.inputData, this.state.selectedModel).then((value) => {
        if(value.status === 200) {
          this.handleResponse(value.data);
        }
      });
    }

  }

  handleSubmitToDataset = (event) => {
    event.preventDefault();
    ClimateCognizeService.addEntryToDataset(this.state.response.input, this.state.response.label, this.state.trueLabel, this.state.response.score, this.state.selectedModel, localStorage.getItem("currentUser") != null ? localStorage.getItem("currentUser") : "anonymous", this.state.selectedTask);
    this.setState({
      selectedModel: "auto-detect",
      inputData: "",
      response: new ClimateMLResponse(),
      dataConsent: null,
      trueLabel: "yes",
      selectedTask: ""
    });
    document.getElementsByName("inputData")[0].value = "";
    // ClimateCognizeService.sendToDetectModel(this.state.inputData).then((value) => {
    //   if(value.status === 200) {
    //     this.handleResponse(value.data);
    //   }
    // });
  }

  handleConsent = (event) => {
    if(event.target.getAttribute("data-consent") == "yes") {
      this.setState({dataConsent : true});
    }
    else {
      this.setState({dataConsent : false});
    }
  }

  importFromCsv = (e) => {
    e.preventDefault();
    let dataset_file = document.getElementById("import-dataset-input").files[0];
    let inputPosition = document.getElementById("import-dataset-input-position").value;
    let data = new FormData();
    data.append('dataset_file', dataset_file);
    this.state.datasetResponse = [];
              this.setState({
              "datasetResponse" : [...this.state.datasetResponse],
          });
    ClimateCognizeService.importDatasetFromCSV(data.get("dataset_file"), this.state.selectedTask, inputPosition).then((resp) => {
      if(resp.status === 200) {
        let responses = resp.data;
        for(let entry of responses) {
          let datasetEntry = new ClimateDatasetResponse();
          datasetEntry.input = entry['input'];
          datasetEntry.predictedLabel = entry['label'];
          this.state.datasetResponse.push(datasetEntry);
          this.setState({
              "datasetResponse" : [...this.state.datasetResponse],
          });
      }
      }
    });
}

  

    render() {
        return (
            
<div className="mt-5">

<div className="row">
    <p>In this section you can try out ClimateCognize - the web interface that utilizes the latest state-of-the-art climate models that process texts and aims to battle misinformation about climate change that appears due to the rising prevalence of climate change information available to the public as well as AI generated content that everyone is using to attract attention to the text, regardless of whether it is a news article, a social media post, a blog post or any other written form</p>
</div>
<div className="row">
    <p>Using the buttons below select the task of interest first and after that select the model that you would like to use for the execution of the selected task</p>
</div>
<h3 id="#climate-tasks-input" className="h3 mt-5 mb-5">Select the task of interest</h3>
{/* Selection of task */}
<div className="grid-radio">

<div class="form-check form-check-inline">
<label className="card">
  <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio1Task" value="climate_detection" checked={this.state.selectedTask === "climate_detection"} onChange={this.changeTaskType}></input>
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Climate Topic Detection</span>
      <span className="mt-2">detection of the presence of climate-related topics in a given text</span>
    </span>
</label>
  {/* <label class="form-check-label" for="inlineRadio1Task">Climate Detection</label> */}
  
</div>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="taskRadioOptions" id="inlineRadio2Task" value="climate_sentiment" checked={this.state.selectedTask === "climate_sentiment"} onChange={this.changeTaskType}></input>
  <label class="form-check-label" for="inlineRadio2Task">Climate Sentiment</label>
</div> */}
<label className="card">
  {/* <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio1Task" value="climate_detection" checked={this.state.selectedTask === "climate_detection"} onChange={this.changeTaskType}></input> */}
  <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio2Task" value="climate_sentiment" checked={this.state.selectedTask === "climate_sentiment"} onChange={this.changeTaskType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Sentiment Analysis</span>
      <span className="mt-2">classification of climate-related sentiment in a given text</span>
    </span>
</label>
<label className="card">
  <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio3Task" value="climate_specificity" checked={this.state.selectedTask === "climate_specificity"} onChange={this.changeTaskType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Determination of specificity</span>
      <span className="mt-2">determining whether a given climate-related paragraph is specific or not</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="taskRadioOptions" id="inlineRadio3Task" value="climate_specificity" checked={this.state.selectedTask === "climate_specificity"} onChange={this.changeTaskType}></input>
  <label class="form-check-label" for="inlineRadio3Task">Climate Specificity</label>
</div> */}
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="taskRadioOptions" id="inlineRadio4Task" value="climate_commitments_and_actions" checked={this.state.selectedTask === "climate_commitments_and_actions"} onChange={this.changeTaskType}></input>
  <label class="form-check-label" for="inlineRadio4Task">Climate Commitments and Actions</label>
</div> */}
<label className="card h-100">
  <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio4Task" value="climate_commitments_and_actions" checked={this.state.selectedTask === "climate_commitments_and_actions"} onChange={this.changeTaskType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Identification of Climate Commitments and Actions</span>
      <span className="mt-2">identification of whether a given paragraph is about climate-related commitments and actions or not</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="taskRadioOptions" id="inlineRadio5Task" value="climate_tcfd_recommendations" checked={this.state.selectedTask === "climate_tcfd_recommendations"} onChange={this.changeTaskType}></input>
  <label class="form-check-label" for="inlineRadio5Task">Climate Classification on TCFD Recommendations</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="taskRadioOptions" id="inlineRadio5Task" value="climate_tcfd_recommendations" checked={this.state.selectedTask === "climate_tcfd_recommendations"} onChange={this.changeTaskType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Assignment of a climate disclosure category</span>
      <span className="mt-2">assigning a climate disclosure category to climate-related paragraphs based on the four categories of the recommendations of the Task Force on Climate-related Financial Disclosures (TCFD)</span>
    </span>
</label>
</div>

{/* 
Selection of model for the task */}
{/* Climate Detection */}
{this.state.selectedTask === "climate_detection" && <div>
<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
<div className="grid-radio-4">
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="auto-detect" checked={this.state.selectedModel === "auto-detect"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">Auto-detect</span>
      <span className="mt-2">Auto-detect which model is best for the task, depending on whether the input is one sentence only or one or more paragraphs</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="auto-detect" checked={this.state.selectedModel === "auto-detect"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio1">Auto-detect</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Detector</span>
      <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for detecting climate-related paragraphs</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio2">ClimateBert Climate Detector</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="our-model" checked={this.state.selectedModel === "our-model"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateCognize Detector - Our model</span>
      <span className="mt-2">Our own fine-tuned model for detecting climate-related topics in sentences</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="our-model" checked={this.state.selectedModel === "our-model"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio3">Our model for detecting climate-related topics</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="chatgpt" checked={this.state.selectedModel === "chatgpt"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg></span> ChatGPT</span>
      <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
    </span>
</label>
</div>
</div>}


{/* Climate Sentiment */}
{this.state.selectedTask === "climate_sentiment" && <div>
<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
<div className="grid-radio-2">

<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Sentiment</span>
      <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into the climate-related sentiment classes opportunity, neutral, or risk.</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio2">ClimateBert Climate Detector</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="chatgpt" checked={this.state.selectedModel === "chatgpt"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg></span> ChatGPT</span>
      <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
    </span>
</label>
</div>
</div>}

{/* Climate Specificity */}
{this.state.selectedTask === "climate_specificity" && <div>
<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
<div className="grid-radio-2">

<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Specificity</span>
      <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into specific and non-specific paragraphs.</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio2">ClimateBert Climate Detector</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="chatgpt" checked={this.state.selectedModel === "chatgpt"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg></span> ChatGPT</span>
      <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
    </span>
</label>
</div>
</div>}

{/* Climate Commitments and actions */}
{this.state.selectedTask === "climate_commitments_and_actions" && <div>
<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
<div className="grid-radio-2">

<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateBERT Climate-Commitments and Actions</span>
      <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into paragraphs being about climate commitments and actions and paragraphs not being about climate commitments and actions.</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio2">ClimateBert Climate Detector</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="chatgpt" checked={this.state.selectedModel === "chatgpt"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg></span> ChatGPT</span>
      <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
    </span>
</label>
</div>
</div>}

{/* Climate TCFD Recommendations */}
{this.state.selectedTask === "climate_tcfd_recommendations" && <div>
<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Select which model to use</h3>
<div className="grid-radio-2">

<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap">ClimateBERT TCFD Recommendations Classifier</span>
      <span className="mt-2">Fine-tuned ClimateBERT language model with a classification head for classifying climate-related paragraphs into the four TCFD recommendation categories (fsb-tcfd.org).</span>
    </span>
</label>
{/* <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="climatebert" checked={this.state.selectedModel === "climatebert"} onChange={this.changeModelType}></input>
  <label class="form-check-label" for="inlineRadio2">ClimateBert Climate Detector</label>
</div> */}
<label className="card">
  <input class="radio" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="chatgpt" checked={this.state.selectedModel === "chatgpt"} onChange={this.changeModelType}></input>
  
  <span class="plan-details">
      <span class="plan-cost fw-bold text-wrap"><span class="badge badge-sm fs-6 position-absolute top-0 start-25 translate-middle text-bg-success">NEW <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
</svg></span> ChatGPT</span>
      <span className="mt-2">OpenAI's state-of-the-art Large Language Model with tailored prompts for the climate topics</span>
    </span>
</label>
</div>
</div>}

<h3 id="#climate-models-input" className="h3 mt-5 mb-5">Input your data</h3>

<form onSubmit={this.handleSubmit} id="models-form">
<div className="mt-3 mb-3">
<label htmlFor="inputData" className="form-label">In the text area below enter your input (you can enter just some words, a sentence or whole paragraphs and texts, the text area is adaptable to all sizes)</label>
<textarea rows="1" placeholder="Enter the text that you want to validate here" class="form-control" type="text" name="inputData" onChange={this.handleChange}></textarea>


</div>

<button type="submit" className="btn btn-app app-alternate-bg-color text-white">Compute</button>
</form>

<h6 className="h6 text-center mt-4">or</h6>

<h4 className="h4 text-center mt-3 mb-5">Import a whole dataset to predict</h4>

<form onSubmit={(e) => this.importFromCsv(e)} enctype="multipart/form-data">


<div className="mb-3 input-group">
<input className="form-control w-50" type="file" id="import-dataset-input"/>
</div>
<div className="mb-3 input-group">
<input className="form-control" type="number" id="import-dataset-input-position" placeholder="Enter the position of the dataset cells that contain the input here such that the inputs can be appropriatelly loaded. Use a 0-based integer for the position." />
</div>
<input className="btn btn-primary" type="submit"></input>
</form>

{this.state.datasetResponse.length > 0 && 
  <div className='col table-responsive mt-5'>

<table className="table table-striped table-hover">
    <thead className='table-success'>
    <tr>
        <th>Input</th>
        <th>Predicted Label</th>
        </tr>
    </thead>
    <tbody>
        {this.state.datasetResponse.map((resp, index) => {
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
{this.state.response.label.length > 0 && <div>
<h2>Response from the model</h2> 
<h4>Label: <span className="fw-normal">{this.state.response.label}</span></h4>
<h4>Score: <span className="fw-normal">{this.state.response.score}</span></h4>


{(this.state.dataConsent == null || this.state.dataConsent) && <div className="row mt-5 mb-5"><p>Do you want to contribute to the development of better NLP models for solving climate change-related misinformation?</p>
<p>Help us by providing your input as data we can use to further train and fine-tune our models on. Data provided and annotated by the users will be used in a community-provided dataset that will be incorporated in training and testing of our models.</p>
<p>All that you need to do to help us is give consent so that your data can be used in this dataset and annotate the correct label in case the model predicted the wrong label.</p>

{(this.state.dataConsent == null) && <div className="row d-flex flex-row"><a onClick={this.handleConsent} data-consent="yes" role="button" className="pe-auto app-success-color me-3 text-underline d-inline">Yes, I consent</a> <a onClick={this.handleConsent} role="button" data-consent="no" className="pe-auto text-danger me-3 text-underline d-inline">No, I do not consent</a></div>}
{(this.state.dataConsent) && <div>
  <p>Please select the correct label for your input</p>
  <div className="row">Real label:</div>
  <form onSubmit={this.handleSubmitToDataset}>
  { (() => {
    if(this.state.selectedTask === "climate_detection" || this.state.selectedTask === "climate_commitments_and_actions") {
      return (
  <select onChange={this.changeTrueLabel} class="form-select" aria-label="Default select example">

        <option selected={this.state.trueLabel === "yes"} value="yes">Yes</option>
        <option selected={this.state.trueLabel === "no"} value="no">No</option>
</select>

      );
    }
    else if(this.state.selectedTask === "climate_sentiment") {
      return (
  <select onChange={this.changeTrueLabel} class="form-select" aria-label="Default select example">

        <option selected={this.state.trueLabel === "neutral"} value="neutral">Neutral</option>
        <option selected={this.state.trueLabel === "opportunity"} value="opportunity">Opportunity</option>
        <option selected={this.state.trueLabel === "risk"} value="risk">Risk</option>
</select>

      );
    }
    else if(this.state.selectedTask === "climate_specificity") {
      return (
  <select onChange={this.changeTrueLabel} class="form-select" aria-label="Default select example">

        <option selected={this.state.trueLabel === "specific"} value="specific">Specific</option>
        <option selected={this.state.trueLabel === "non-specific"} value="non-specific">Non-Specific</option>
</select>

      );
    }
    else if(this.state.selectedTask === "climate_tcfd_recommendations") {
      return (
  <select onChange={this.changeTrueLabel} class="form-select" aria-label="Default select example">

        <option selected={this.state.trueLabel === "none"} value="none">None</option>
        <option selected={this.state.trueLabel === "metrics"} value="metrics">Metrics</option>
        <option selected={this.state.trueLabel === "strategy"} value="strategy">Strategy</option>
        <option selected={this.state.trueLabel === "risk"} value="risk">Risk</option>
        <option selected={this.state.trueLabel === "governance"} value="governance">Governance</option>
</select>

      );
    }
  })()}


  <button className="btn btn-app app-success-bg-color mt-2" type="submit">Submit to dataset</button>
  </form>
</div>}
</div>

}


</div>}
</div>


</div>
        );

    }

    changeModelType = (e) => {
        this.setState({
            selectedModel : e.target.value
        });
    }

    changeTaskType = (e) => {
      let defaultTrueLabel = "yes";
      let selectedModel = "auto-detect";
      if(e.target.value === "climate_sentiment") {
        defaultTrueLabel = "neutral";
        selectedModel = "climatebert";
      }
      else if(e.target.value === "climate_specificity") {
        defaultTrueLabel = "specific";
        selectedModel = "climatebert";
      }
      else if(e.target.value === "climate_tcfd_recommendations") {
        defaultTrueLabel = "none";
        selectedModel = "climatebert";
      }
      else if(e.target.value === "climate_commitments_and_actions") {
        selectedModel = "climatebert";
      }
      this.setState({
          selectedTask : e.target.value,
          trueLabel : defaultTrueLabel,
          selectedModel: selectedModel
      });
  }

    changeTrueLabel = (e) => {
      this.setState({
          trueLabel : e.target.value
      });
  }


}





export default ClimateModelsInput;