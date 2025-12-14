import React from "react";

import ClimateModelsInput from "../ClimateModelsInput/ClimateModelsInput";

const Home = () => {
  return (
    <div>
      <div className="climate-banner py-5 mb-5">
        <div class=" mx-auto py-5 my-5 text-center mt-5 w-50">
          <div className='app-primary-bg-color-opacity px-1 py-2 m-2 mx-3 rounded-4'>
            <h1 class="display-5 fw-bold">ClimateCognize</h1>
            <div class="col-lg-6 mx-auto">
              <p class="lead mb-4 app-dark-color fw-semibold">Battling misinformation about climate change in texts by utilizing the latest state-of-the-art climate NLP (Natural Language Processing) models.</p>
              <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <a onClick={() => window.scrollBy(0, 850)} type="button" class="btn btn-dark app-dark-bg-color rounded-3 py-2 link-app mx-auto">Try it out</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClimateModelsInput></ClimateModelsInput>
    </div>
  );
}





export default Home;