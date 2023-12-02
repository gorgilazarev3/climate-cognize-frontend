import React, { Component } from "react";
import ClimateModelsInput from "../ClimateModelsInput/ClimateModelsInput";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
<div className="climate-banner py-5 mb-5">
<div class=" mx-auto py-5 my-5 text-center mt-5 w-50">
    <h1 class="display-5 fw-bold">ClimateCognize</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4 app-dark-color fw-semibold">Battling misinformation about climate change in texts by utilizing the latest state-of-the-art climate NLP (Natural Language Processing) models.</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <a href="#climate-models-input" type="button" class="btn btn-app app-success-bg-color text-white btn-lg px-4 gap-3">Try it out</a>
      </div>
    </div>
  </div>
</div>

<ClimateModelsInput></ClimateModelsInput>
</div>
        );

    }



}





export default Home;