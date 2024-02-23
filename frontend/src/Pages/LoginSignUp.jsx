import React from "react";
import './CSS/LoginSignUp.css'

const LoginSignUp = () => {
    return(
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>Sign Up</h1>
                <div className="loginsignup-fields">
                    <input type="text" placeholder="Your Name"/>
                    <input type="email" placeholder="Enter your email"/>
                    <input type="password" placeholder="Enter Password" />
                </div>
                <button>Continue</button>
                <p className="loginsiginup-login">Already Have an account? <span>Login here</span></p>
                <div className="loginsignup-agree">
                    <input type="checkbox" />
                    <p>By checking the box, I agree to the terms of User & Privacy Policy</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignUp