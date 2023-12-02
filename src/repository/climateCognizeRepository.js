import axios from "../custom-axios/axios"

const ClimateCognizeService = {
    // fetchCategories: () => {
    //     return axios.get("/category");
    // },
    // fetchBooks: () => {
    //     return axios.get("/book");
    // },
    // fetchAuthors: () => {
    //     return axios.get("/author");
    // },
    // deleteBook: (id) => {
    //     return axios.delete(`/book/${id}`);
    // },

    importDatasetFromCSV: (dataset_file, selectedModel, inputPosition) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post("/climate/import", {
            "dataset_file" : dataset_file,
            "selectedModel": selectedModel,
            "inputPosition": inputPosition
        }, config);
    },

    trainDetectModel: () => {
        return axios.post("/climate/train/detect", {
        });
    },

    trainSentimentModel: () => {
        return axios.post("/climate/train/sentiment", {
        });
    },

    trainSpecificityModel: () => {
        return axios.post("/climate/train/specificity", {
        });
    },

    trainOurModel: () => {
        return axios.post("/climate/train/our", {
        });
    },

    trainCommitmentsActionsModel: () => {
        return axios.post("/climate/train/commitments", {
        });
    },

    trainTCFDModel: () => {
        return axios.post("/climate/train/tcfd", {
        });
    },

    trainModel: (model) => {
        if(model.toLowerCase() === "climatebert-climate-detector")
        {
            ClimateCognizeService.trainDetectModel();
        }
        else if(model.toLowerCase() === "our-model-climate-detection")
        {
            ClimateCognizeService.trainOurModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-sentiment")
        {
            ClimateCognizeService.trainSentimentModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-specificity")
        {
            ClimateCognizeService.trainSpecificityModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-commitments-actions")
        {
            ClimateCognizeService.trainCommitmentsActionsModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-tcfd")
        {
            ClimateCognizeService.trainTCFDModel();
        }
        
    },

    getAllModels: () => {
        return axios.get("/climate/models");
    },

    sendToDetectModel: (inputData, selectedModel) => {
        return axios.post("/climate/detect", {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    sendToSentimentModel: (inputData) => {
        return axios.post("/climate/sentiment", {
            "input_data": inputData
        });
    },

    sendToSpecificityModel: (inputData) => {
        return axios.post("/climate/specificity", {
            "input_data": inputData
        });
    },

    sendToCommitmentsModel: (inputData) => {
        return axios.post("/climate/commitments-actions", {
            "input_data": inputData
        });
    },

    sendToTCFDModel: (inputData) => {
        return axios.post("/climate/tcfd", {
            "input_data": inputData
        });
    },

    getAllDatasetEntries: () => {
        return axios.get("/climate/dataset");
    },

    addEntryToDataset: (input, predictedLabel, trueLabel, score, model, submittedBy, task) => {
        return axios.post("/climate/dataset/add-to-dataset", {
            "input": input,
            "predictedLabel": predictedLabel,
            "trueLabel": trueLabel,
            "score": score,
            "model": model,
            "submittedBy": submittedBy,
            "task": task,
        });
    },
    
    login: (username, password) => {
        return axios.post("/auth/login", {
            "username": username,
            "password": password
        });
    },

    register: (username, password, confirmPassword, name, surname) => {
        return axios.post("/auth/register", {
            "username": username,
            "password": password,
            "confirmPassword": confirmPassword,
            "name": name,
            "surname": surname
        });
    },

    getEntryFromDataset: (id) => {
        return axios.get(`/climate/dataset/${id}`);
    },

    
    removeEntryFromDataset: (id) => {
        return axios.delete(`/climate/dataset/${id}`);
    },

    exportDatasetToCSV: () => {
        return axios.get({url: "http://localhost:9090/api/climate/dataset/export", responseType: 'blob'});
    },

    evaluateDetectModel: () => {
        return axios.post("/climate/evaluate/detect", {
        });
    },

    evaluateSentimentModel: () => {
        return axios.post("/climate/evaluate/sentiment", {
        });
    },

    evaluateSpecificityModel: () => {
        return axios.post("/climate/evaluate/specificity", {
        });
    },

    evaluateOurModel: () => {
        return axios.post("/climate/evaluate/our", {
        });
    },

    evaluateCommitmentsActionsModel: () => {
        return axios.post("/climate/evaluate/commitments", {
        });
    },

    evaluateTCFDModel: () => {
        return axios.post("/climate/evaluate/tcfd", {
        });
    },

    evaluateModel: (model) => {
        if(model.toLowerCase() === "climatebert-climate-detector")
        {
            return ClimateCognizeService.evaluateDetectModel();
        }
        else if(model.toLowerCase() === "our-model-climate-detection")
        {
            return ClimateCognizeService.evaluateOurModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-sentiment")
        {
            return ClimateCognizeService.evaluateSentimentModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-specificity")
        {
            return ClimateCognizeService.evaluateSpecificityModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-commitments-actions")
        {
            return ClimateCognizeService.evaluateCommitmentsActionsModel();
        }
        else if(model.toLowerCase() === "climatebert-climate-tcfd")
        {
            return ClimateCognizeService.evaluateTCFDModel();
        }
        
    },



    // editBook: (id, name, category, authorId, availableCopies) => {
    //     return axios.put(`/book/${id}`, {
    //         "name": name,
    //         "category": category,
    //         "authorId": authorId,
    //         "availableCopies": availableCopies
    //     });
    // },
    // getBook: (id) => {
    //     return axios.get(`/book/${id}`);
    // },

    // rentBook: (id) => {
    //     return axios.put(`/book/rent/${id}`);
    // }
};

export default ClimateCognizeService;