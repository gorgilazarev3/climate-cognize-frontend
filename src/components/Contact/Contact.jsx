export default function Contact() {
    return (
        <div>
            <div className="full-width">
                <div className="header-div">
                    <h1 className="h1">Contact Us</h1>
                </div>
            </div>
            <hr></hr>

            <div className="about-section mt-5">
                <div className="container row">
                    <div className="col-3">
                        <h3 className="h3">Email</h3>
                    </div>
                    <div className="col-9" style={{textAlign: "justify"}}>
                        <p className="word-wrap text-wrap text-dark fw-semibold fs-4">We constantly try to improve our services and exercise new ideas. If you have any ideas or questions, please contact us at <a href="mailto:climatecognize@consultant.com" className="text-dark redirect-link">climatecognize@consultant.com</a><br></br><span className="text-center">Or by using the form below.</span></p>
                    </div>
                    <hr></hr>
                    <div className="container row mt-3">
                        <div className="col-3">
                            <h3 className="h3">Contact Form</h3>
                        </div>
                        <div className="col-9" style={{textAlign: "justify"}}>
                            <div className="row">
                                <div className="col mb-4">
                                    <label htmlFor='name-contact' className='form-label fw-semibold'>Your Name</label>
                                    <input type='text' name='name-contact' id='name-contact' className='form-control' placeholder="Enter your name"></input>
                                </div>
                                <div className="col mb-4">
                                    <label htmlFor='email-contact' className='form-label fw-semibold'>Your Email</label>
                                    <input type='email' name='email-contact' id='email-contact' className='form-control' placeholder="Enter your email"></input>
                                </div>
                            </div>
                            <div className="row mb-4">
                                    <label htmlFor='message-contact' className='form-label fw-semibold'>Message</label>
                                    <textarea rows={3} name='message-contact' id='message-contact' className='form-control' placeholder="Your message here..."></textarea>
                            </div>
                            <button className="btn btn-app app-primary-bg-color text-light fw-bold">Send Message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}