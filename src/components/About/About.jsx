const About = () => {
    return (
        <div>
            <div className="full-width">
                <div className="header-div">
                    <h1 className="h1">About ClimateCognize</h1>
                </div>
            </div>
            <hr></hr>

            <div className="about-section mt-5">
                <div className="container row">
                    <div className="col-3">
                        <h3 className="h3">What is ClimateCognize?</h3>
                    </div>
                    <div className="col-9" style={{textAlign: "justify"}}>
                        <p className="word-wrap text-wrap text-dark fw-bold fs-2">ClimateCognize is a web interface that utilizes the latest state-of-the-art climate models that process texts and aims to battle misinformation about climate change that appears due to the rising prevalence of climate change information available to the public as well as AI generated content that everyone is using to attract attention to the text, regardless of whether it is a news article, a social media post, a blog post or any other written form</p>
                    </div>
                    <hr></hr>
                    <div className="container row mt-3">
                        <div className="col-3">
                            <h3 className="h3">Team</h3>
                        </div>
                        <div className="col-9" style={{textAlign: "justify"}}>
                            <p className="word-wrap text-wrap text-dark fw-semibold fs-4"><b>ClimateCognize</b>, both the interface and the model, were developed as a result of a research on comparison of the best climate-related classification models by the authors of the corresponding published papers <b>Gorgi Lazarev</b>, a student at the <b>Faculty of Computer Science and Engineering</b> in <b>Skopje</b> and <b>Prof. Dr. Dimitar Trajanov</b>, an experienced researcher and professor who was the first Dean at the <b>Faculty of Computer Science and Engineering</b> in <b>Skopje</b>.</p>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="container row mt-3">
                        <div className="col-3">
                            <h3 className="h3">Research</h3>
                        </div>
                        <div className="col-9" style={{textAlign: "justify"}}>
                            <p className="word-wrap text-wrap text-dark fw-semibold fs-4">The process of comparison and research about the available state-of-the-art climate-related NLP models can be found in our corresponding research papers:</p>
                            <ul className="text-start mt-5">
                                <li className="fs-6 mb-3">
                                    <p>Comparing the performance of Text Classification Models for climate change-related texts</p>
                                    <a className="fw-bold text-dark redirect-link" href="https://repository.ukim.mk/bitstream/20.500.12188/27406/1/CIIT2023_paper_31.pdf">https://repository.ukim.mk/bitstream/20.500.12188/27406/1/CIIT2023_paper_31.pdf</a>
                                </li>
                                <li className="fs-6 mb-3">
                                    <p>Comparing the performance of ChatGPT and state-of-the-art climate NLP models on climate-related text classification tasks</p>
                                    <a className="fw-bold text-dark redirect-link text-nowrap" href="https://www.e3s-conferences.org/articles/e3sconf/abs/2023/73/e3sconf_iced2023_02004/e3sconf_iced2023_02004.html">https://www.e3s-conferences.org/articles/e3sconf/abs/2023/73/e3sconf_iced2023_02004/e3sconf_iced2023_02004.html</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="container row mt-3 ps-5">
                        <div className="col-3">
                            <h3 className="h3">ClimateCognize - Climate Topic Detection Model card</h3>
                        </div>
                        <div className="col-9 " style={{textAlign: "justify"}}>
                            <p className="word-wrap text-wrap text-dark fw-semibold fs-4">Our climate topic detection model detects presence of climate-related topics in texts, specifically performs best on sentences and classifies them into binary categories. The ClimateCognize model uses the <a className="redirect-link text-dark fw-bold" href="https://huggingface.co/climatebert/distilroberta-base-climate-detector">ClimateBERT Climate Detector</a> as a base and has been fine-tuned using data from our hand-picked datasets that include climate news articles, different world news articles and environment Wikipedia articles.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;