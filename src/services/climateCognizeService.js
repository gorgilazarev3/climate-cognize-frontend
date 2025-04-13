import { ClimateModels } from "../constants/climateModels";
import { ApiRoutes } from "../constants/routes";
import axios from "../custom-axios/axios"

const ClimateCognizeService = {
    importDatasetFromCSV: (dataset_file, selectedModel, inputPosition) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(ApiRoutes.IMPORT_DATASET, {
            "dataset_file": dataset_file,
            "selectedModel": selectedModel,
            "inputPosition": inputPosition
        }, config);
    },

    trainDetectModel: () => {
        return axios.post(ApiRoutes.TRAINING.DETECT, {
        });
    },

    trainSentimentModel: () => {
        return axios.post(ApiRoutes.TRAINING.SENTIMENT, {
        });
    },

    trainSpecificityModel: () => {
        return axios.post(ApiRoutes.TRAINING.SPECIFICITY, {
        });
    },

    trainOurModel: () => {
        return axios.post(ApiRoutes.TRAINING.PERSONAL_MODEL, {
        });
    },

    trainCommitmentsActionsModel: () => {
        return axios.post(ApiRoutes.TRAINING.COMMITMENTS_AND_ACTIONS, {
        });
    },

    trainTCFDModel: () => {
        return axios.post(ApiRoutes.TRAINING.TCFD, {
        });
    },

    trainModel: (model) => {
        if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_DETECTOR) {
            ClimateCognizeService.trainDetectModel();
        }
        else if (model.toLowerCase() === ClimateModels.PERSONAL_MODEL_CLIMATE_DETECTION) {
            ClimateCognizeService.trainOurModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_SENTIMENT) {
            ClimateCognizeService.trainSentimentModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_SPECIFICITY) {
            ClimateCognizeService.trainSpecificityModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_COMMITMENTS_AND_ACTIONS) {
            ClimateCognizeService.trainCommitmentsActionsModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_TCFD) {
            ClimateCognizeService.trainTCFDModel();
        }

    },

    getAllModels: () => {
        return axios.get(ApiRoutes.GET_ALL_MODELS);
    },

    sendToDetectModel: (inputData, selectedModel) => {
        return axios.post(ApiRoutes.EXECUTE_TASK.DETECT, {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    sendToSentimentModel: (inputData, selectedModel) => {
        return axios.post(ApiRoutes.EXECUTE_TASK.SENTIMENT, {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    sendToSpecificityModel: (inputData, selectedModel) => {
        return axios.post(ApiRoutes.EXECUTE_TASK.SPECIFICITY, {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    sendToCommitmentsModel: (inputData, selectedModel) => {
        return axios.post(ApiRoutes.EXECUTE_TASK.COMMITMENTS_AND_ACTIONS, {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    sendToTCFDModel: (inputData, selectedModel) => {
        return axios.post(ApiRoutes.EXECUTE_TASK.TCFD, {
            "input_data": inputData,
            "chosen_model": selectedModel
        });
    },

    getAllDatasetEntries: () => {
        return axios.get(ApiRoutes.DATASET.GET_ENTRIES);
    },

    addEntryToDataset: (input, predictedLabel, trueLabel, score, model, submittedBy, task) => {
        return axios.post(`${ApiRoutes.DATASET.GET_ENTRIES}/${ApiRoutes.DATASET.ADD_TO_DATASET}`, {
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
        return axios.post(ApiRoutes.AUTH.LOGIN, {
            "username": username,
            "password": password
        });
    },

    register: (username, password, confirmPassword, name, surname) => {
        return axios.post(ApiRoutes.AUTH.REGISTER, {
            "username": username,
            "password": password,
            "confirmPassword": confirmPassword,
            "name": name,
            "surname": surname
        });
    },

    getEntryFromDataset: (id) => {
        return axios.get(`${ApiRoutes.DATASET.GET_ENTRIES}/${id}`);
    },


    removeEntryFromDataset: (id) => {
        return axios.delete(`${ApiRoutes.DATASET.GET_ENTRIES}/${id}`);
    },

    exportDatasetToCSV: () => {
        return axios.get({ url: ApiRoutes.DATASET.EXPORT_TO_CSV, responseType: 'blob' });
    },

    evaluateDetectModel: () => {
        return axios.post(ApiRoutes.EVALUATION.DETECT, {
        });
    },

    evaluateSentimentModel: () => {
        return axios.post(ApiRoutes.EVALUATION.SENTIMENT, {
        });
    },

    evaluateSpecificityModel: () => {
        return axios.post(ApiRoutes.EVALUATION.SPECIFICITY, {
        });
    },

    evaluateOurModel: () => {
        return axios.post(ApiRoutes.EVALUATION.PERSONAL_MODEL, {
        });
    },

    evaluateCommitmentsActionsModel: () => {
        return axios.post(ApiRoutes.EVALUATION.COMMITMENTS_AND_ACTIONS, {
        });
    },

    evaluateTCFDModel: () => {
        return axios.post(ApiRoutes.EVALUATION.TCFD, {
        });
    },

    evaluateModel: (model) => {
        if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_DETECTOR) {
            return ClimateCognizeService.evaluateDetectModel();
        }
        else if (model.toLowerCase() === ClimateModels.PERSONAL_MODEL_CLIMATE_DETECTION) {
            return ClimateCognizeService.evaluateOurModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_SENTIMENT) {
            return ClimateCognizeService.evaluateSentimentModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_SPECIFICITY) {
            return ClimateCognizeService.evaluateSpecificityModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_COMMITMENTS_AND_ACTIONS) {
            return ClimateCognizeService.evaluateCommitmentsActionsModel();
        }
        else if (model.toLowerCase() === ClimateModels.CLIMATEBERT_CLIMATE_TCFD) {
            return ClimateCognizeService.evaluateTCFDModel();
        }

    },

    getUserInfo: (username) => {
        return axios.post(ApiRoutes.USER.GET_INFO, { "username": username });
    },

    changeProfileInfo: (username, name, surname) => {
        return axios.post(ApiRoutes.USER.CHANGE_PROFILE_INFO, { "username": username, "name": name, "surname": surname });
    },

    changePasswordSettings: (username, oldPassword, newPassword, confirmPassword) => {
        return axios.post(ApiRoutes.AUTH.CHANGE_PASSWORD, { "username": username, "old-password": oldPassword, "new-password": newPassword, "confirm-password": confirmPassword });
    },

    getAllDatasets: () => {
        return axios.get(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.GET_ALL}`);
    },

    getDatasetById: (id) => {
        return axios.get(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.GET_BY_ID}/${id}`);
    },

    getDatasetsByUser: (username) => {
        return axios.get(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.GET_FOR_USER}/${username}`);
    },

    likeDataset: (id) => {
        return axios.put(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.LIKE}/${id}`);
    },

    downloadDataset: (id) => {
        return axios.put(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.DOWNLOAD}/${id}`);
    },

    deleteDataset: (id) => {
        return axios.delete(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.DELETE}/${id}`);
    },

    createNewDataset: (author, name, description, isPrivate, language, task, split, columns, rows, tags, types) => {
        return axios.post(`${ApiRoutes.DATASET.DATASET_PREFIX}/${ApiRoutes.DATASET.CREATE}`, { "author": author, "name": name, "description": description, "isPrivate": isPrivate, "language": language, "task": task, "split": split, "columns": JSON.stringify(columns), "rows": JSON.stringify(rows), "tags": JSON.stringify(tags), "types": JSON.stringify(types) });
    },

    subscribeToPro: (username) => {
        return axios.put(ApiRoutes.USER.SUBSCRIBE_TO_PRO, { "username": username });
    },

    handleToken: async (token) => {
        await axios.post(ApiRoutes.PAYMENT.CHARGE, "", {
            headers: {
                token: token.id,
                amount: 9.99,
            },
        })
    }
};

export default ClimateCognizeService;