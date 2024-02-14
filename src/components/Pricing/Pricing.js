import { useNavigate } from "react-router-dom";
import ClimateCognizeService from "../../repository/climateCognizeRepository";
import Stripe from "react-stripe-checkout";
import { useState, useEffect } from "react";
import User from "../../models/User";

export default function Pricing(props) {

    const navigate = useNavigate();
    const [user, setUser] = useState(new User("","","",""));

    useEffect(() => {
        let username = localStorage.getItem("currentUser");
        if(username != null) {
          ClimateCognizeService.getUserInfo(username).then((resp) => {
            if(resp.status === 200) {
                let obj = resp.data;
                setUser({username: obj['username'], name: obj['name'], surname:  obj['surname'], role: obj['role'], isPremium: obj['premium']});
            }
        });
        }

    }, []);

    async function handleToken(token) {
        let t = await ClimateCognizeService.handleToken(token);
        ClimateCognizeService.subscribeToPro(localStorage.getItem("currentUser")).then((resp) => console.log(resp.data));
        return t;
    }

    return (

        <div className="mt-5">
            <div className="full-width">
                <div className="header-div">
                    <h1 className="h1">Pricing</h1>
                    <br></br>
                    <h2>The easiest way to access the state-of-the-art climate-related NLP models</h2>
                    
                </div>
            </div>
            <hr></hr>
            <h4 className="ms-3 me-3">We are enabling the access to the latest climate-related models, simply through this browser interface, without writing a single line of code, and we simplify the way for regular users to store models and datasets in a centralized place.</h4>

            <div className="row row-cols-2">
<div className="col">
<div onClick={() => { 
                localStorage.getItem("currentUser") == null &&
                navigate('/register')
            
            }} class="card mt-5 text-start" style={{cursor: "pointer"}}>
<div className="card-header bg-white">
    <h4 class="card-title">ClimateCognize Basic</h4>
  <h6 className="card-subtitle text-muted">Collaborate with Climate-related ML Models</h6>
</div>
  <div class="card-body">
        <ul style={{listStyleType: 'none'}}>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Host your datasets for free</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Access the latest state-of-the-art climate-related NLP models</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Community support</li>
        </ul>
  </div>
  <div className="card-footer bg-white">
    <h6 className="text-muted">Forever</h6>
    <h4 class="">Free</h4>
  </div>
</div>
</div>

<div className="col">
<div onClick={() => { 
                localStorage.getItem("currentUser") == null &&
                navigate('/register')
            
            }} class="card mt-5 text-start" style={{cursor: "pointer"}}>
<div  className="card-header bg-white dataset-card">
    <h4 class="card-title">ClimateCognize Pro</h4>
  <h6 className="card-subtitle text-muted">Contribute to the improvement of our services</h6>
</div>
  <div class="card-body">
        <ul style={{listStyleType: 'none'}}>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Early access to new features</li>
<li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Get a pro badge on your profile</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Private repositories for datasets</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
</svg> Advanced reports for your datasets</li>
        </ul>
  </div>
  <div className="card-footer bg-white">
    <h6 className="text-muted">Subscribe</h6>
    <h4 class="">$9.99</h4>

{ !user.isPremium && user.username != "" ?
    <Stripe
stripeKey="pk_test_51NGTdOC4i333N3s4vpyRmnMjUbfOwMp5i3lwWcHPiY4VOPw0NDJs3sC1AHqOtOOr73BXV1tbxA4TnEv6EGAGT3l700k7mHF2Zz"
token={handleToken}
description="Subscription for ClimateCognize Pro Memebership"
label="➞ Get PRO"
/> : user.isPremium && user.username != "" ? "You are subscribed to this plan" : null
}
  </div>
</div>
</div>


            </div>

        </div>
    );
}