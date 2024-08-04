import React, { Component } from "react";
import "./App.css";
import "./Settings.css";

/**
 * @author Brandon Cisneros
 * Component for Settings screen
 */
class Settings extends Component {
    /**
     * Constructs a new instance of the settings screen component
     * 
     * @param {object} props The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = { 
            apiResponse: [],
            employeeId: "",
            password: "",
            isGoogleTranslateInitialized: false
};
        this.setTextSize = this.setTextSize.bind(this);
        this.toggleBoldText = this.toggleBoldText.bind(this);
    }

    /**
     * Calls API to retrieve employee information
     */
    callAPI() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/employeesAPI")
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    /**
     * Executes when the component is mounted.
     * Calls methods to fetch employee data and initialize Google Translate.
     * This lifecycle method is invoked immediately after a component is mounted.
     */
    componentDidMount() {
        this.callAPI();
        if (!this.state.isGoogleTranslateInitialized) {
            this.initializeGoogleTranslate();
            this.setState({ isGoogleTranslateInitialized: true });
        }
    }

    /**
     * Initializes Google Translate API if not already initialized.
     * Adds a script tag to the document body to load the necessary Google Translate script asynchronously.
     * Sets up the callback function to initialize Google Translate when the script is loaded.
     */
    initializeGoogleTranslate() {
        if (!window.googleTranslateElementInit) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
            window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
        }
    }

    /**
     * Callback function to initialize Google Translate once the script is loaded.
     * Creates a new Google Translate element with English as the page language.
     * @param {string} id - The id of the HTML element where the translation widget should be placed.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }


    /**
    * Sets text size settings and rerenders
    * @param {decimal} size Relative size desired from 1 to 2
    */
    setTextSize = (size) => {
        localStorage.setItem('textsize', size);
        this.forceUpdate();
        // console.log("changed size to " + size);
    }

    /**
    * Toggles bold text settings and rerenders
    */
    toggleBoldText = () => {
        if (localStorage.getItem('boldtext') == 'normal') {
            localStorage.setItem('boldtext', 'bold');
        }
        else {
            localStorage.setItem('boldtext', 'normal');
        }
        this.forceUpdate();
    }

    /**
    * Toggles color inversion setting and rerenders
    */
    invertColor = () => {
        if (localStorage.getItem('colorinv') == 1) {
            localStorage.setItem('colorinv', 0);
        }
        else {
            localStorage.setItem('colorinv', 1);
        }
        this.forceUpdate();
    }


    /**
     * Attempts traditional login, routing to a page if the user matches expected values
     */
    attemptLogin = () => {
        const { employeeId, password, apiResponse } = this.state;
        if (!apiResponse || !Array.isArray(apiResponse)) {
            return null; // Or handle the case when the array is not present or not valid
        }
        const userMatch = apiResponse.find(user => user.employee_id == employeeId && user.pswd == password);
        console.log(userMatch);
        if (userMatch) {
            // Redirect to a different page if login is successful
            if (userMatch.manager) {
                window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/ingredients";
            }
            else if (userMatch.employee_name == "KITCHEN") {
                window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/RegularKitchen";
            }
            else if (userMatch.employee_name == "MENUBOARD") {
                window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/menuBoard";
            }
            else {
                window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/cashierOrders";
            }
        } else {
            // Display a login error message
            alert('Login Error: Invalid employee ID or password');
        }

    }

    /**
     * Routes user to HandleOAuth to attempt Google Login
     */
    attemptGoogleLogin = () => {
        localStorage.setItem('oauth2-test-params', '{}');
        window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/handleOAuth"
    }

    /**
     * Routes user to Landing Page and clears OAuth login
     */
    exitLogout = () => {
        localStorage.setItem('oauth2-test-params', '{}');
        window.location.href = "https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/"
    }

    /**
     * Changes state values of monitored event
     * @param {*} event Event to be handled
     */
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    /**
     * Renders the settings screen component.
     * @returns {JSX.Element} The JSX element representing the settings screen.
     */
    render() {
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        const x1Selected = (localStorage.getItem('textsize') == 1) ? 'selected' : '';
        const x15Selected = (localStorage.getItem('textsize') == 1.5) ? 'selected' : '';
        const x175Selected = (localStorage.getItem('textsize') == 1.75) ? 'selected' : '';
        const x2Selected = (localStorage.getItem('textsize') == 2) ? 'selected' : '';
        const boldSelected = (localStorage.getItem('boldtext') == 'bold') ? 'selected' : '';

        return (
                <div className="App" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                    <header className="Settings-header">
                    <a href="javascript:history.back()"><button id="backbutton">Back</button></a>
                    <button id="exitbutton" onClick={() => this.exitLogout()}>Exit/Logout</button>
                    <h1 className="Settings-title">Settings</h1>
                    </header>
                    <h2>Text Customization</h2>
                    <button id={x1Selected} onClick={() => this.setTextSize(1)}>1x</button>
                    <button id={x15Selected} onClick={() => this.setTextSize(1.5)}>1.5x</button>
                    <button id={x175Selected} onClick={() => this.setTextSize(1.75)}>1.75x</button>
                    <button id={x2Selected} onClick={() => this.setTextSize(2)}>2x</button>
                    <button id={boldSelected} onClick={() => this.toggleBoldText()}>Toggle Bold Text</button>
                    <h2>Color Customization</h2>
                    <button onClick={() => this.invertColor()}>Toggle Color Inversion</button>
                    <h2>Employee Login</h2>
                    <table>
                    <tbody>
                        <tr>
                                <input
                                    type="text"
                                    name="employeeId"
                                    placeholder="Employee ID"
                                    value={this.state.employeeId}
                                    onChange={this.handleInputChange}
                                />
                        </tr>
                        <tr>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => this.attemptLogin()}>Login</button>
                <button onClick={() => this.attemptGoogleLogin()}>Login with Google</button>
                <div id="google_translate_element"></div>
                </div>
        );
    }
}

export default Settings;
