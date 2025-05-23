const Footer = () => {
    return (
<footer class="footer-20192">
    <div class="site-section">
        <div class="container">
            <div class="cta d-block d-md-flex align-items-center px-5">
                <div>
                    <h4 class="mb-0">Have questions or ideas?</h4>
                    <h5 class="text-dark">Let's get in touch!</h5>
                </div>
                <div class="ms-auto">
                    <a href="/contact" class="btn btn-dark rounded-3 py-2 px-2 link-app">Contact us</a>
                </div>
            </div>
            <div class="row" style={{marginTop: '-5em'}}>
                <div class="col-sm">
                    <img src='images\climate-change.png' className='me-2' width={20}></img>
                    <a href="/" class="footer-logo">ClimateCognize</a>
                    <p class="copyright">
                        <small>&copy; {new Date().getFullYear()}</small>
                    </p>
                </div>
                <div class="col-sm">
                    <ul class="list-unstyled links">
                        <li><a href="/about">About us</a></li>
                    </ul>
                </div>
                <div class="col-sm">
                    <ul class="list-unstyled links">
                        <li><a href="/">Try the models out</a></li>
                    </ul>
                </div>
                <div class="col-sm">
                    <ul class="list-unstyled links">
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>
    );
}

export default Footer;