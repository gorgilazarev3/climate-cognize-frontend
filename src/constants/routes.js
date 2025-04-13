export const PublicRoutes = {
    DEFAULT: "/",
    HOME: "/home",
    ABOUT: "/about",
    CONTACT: "/contact",
    PRICING: "/pricing",

};

export const AuthRoutes = {
    LOGIN: "/login",
    REGISTER: "/register"
};

export const UserRoutes = {
    USER_SETTINGS: "/userSettings",
    USER_PROFILE: "/userProfile"
};

export const AppRoutes = {
    DATASETS: "/datasets",
    DATASET_DETAILS: "/dataset/:id",
    DATASET_CREATOR: "/datasetCreator",
    DATASET_ENTRIES: "/datasetEntries",
    CLIMATE_MODELS: "/climateModels",
};

export const ApiRoutes = {
    IMPORT_DATASET: "/climate/import",
    TRAINING: {
       DETECT: "/climate/train/detect",
       SENTIMENT: "/climate/train/sentiment",
       SPECIFICITY: "/climate/train/specificity",
       PERSONAL_MODEL: "/climate/train/our",
       COMMITMENTS_AND_ACTIONS: "/climate/train/commitments",
       TCFD: "/climate/train/tcfd",
    },
    EVALUATION: {
        DETECT: "/climate/evaluate/detect",
        SENTIMENT: "/climate/evaluate/sentiment",
        SPECIFICITY: "/climate/evaluate/specificity",
        PERSONAL_MODEL: "/climate/evaluate/our",
        COMMITMENTS_AND_ACTIONS: "/climate/evaluate/commitments",
        TCFD: "/climate/evaluate/tcfd",
     },
    GET_ALL_MODELS: "/climate/models",
    EXECUTE_TASK: {
        DETECT: "/climate/detect",
        SENTIMENT: "/climate/sentiment",
        SPECIFICITY: "/climate/specificity",
        COMMITMENTS_AND_ACTIONS: "/climate/commitments-actions",
        TCFD: "/climate/tcfd",
    },
    DATASET: {
        DATASET_PREFIX: "datasets",
        GET_ALL: "getAll",
        GET_BY_ID: "getById",
        GET_FOR_USER: "getForUser",
        LIKE: "likeDataset",
        DOWNLOAD: "downloadDataset",
        DELETE: "deleteDataset",
        CREATE: "createNewDataset",
        GET_ENTRIES: "/climate/dataset",
        ADD_TO_DATASET: "add-to-dataset",
        EXPORT_TO_CSV: "http://localhost:9090/api/climate/dataset/export",
    },
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        CHANGE_PASSWORD: "/auth/changePassword"
    },
    USER: {
        GET_INFO: "/users/getUserInfo",
        CHANGE_PROFILE_INFO: "/users/changeProfileInfo",
        SUBSCRIBE_TO_PRO: "/users/subscribeToPro",
    },
    PAYMENT: {
        CHARGE: "http://localhost:9090/api/payment/charge"
    },
}