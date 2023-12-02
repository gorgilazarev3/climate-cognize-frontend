class ClassificationDatasetEntry {
    constructor() {
        this.id = 0;

        this.input = "";
    
        this.predictedLabel= "";
    
        this.trueLabel = "";
    
        this.score = 0.0;
    
        this.submittedBy = "";
    
        this.model = "";
    
        this.task = "";
    }
}

export default ClassificationDatasetEntry;