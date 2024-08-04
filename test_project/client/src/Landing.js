import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./Landing.css";

/**
 * @author Brandon Cisneros
 * Component for Landing screen
 */
class Landing extends Component {
    /**
     * Constructs a new instance of the Landing screen component
     * 
     * @param {object} props The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = { apiResponse: [] };
    }

    /**
     * Calls API to test API connection
     */
    callAPI() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/testapi")
            .then(res => res.json())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    /**
     * Executes when the component is mounted.
     * Calls methods to fetch test data and initialize Google Translate.
     * This lifecycle method is invoked immediately after a component is mounted.
     */
    componentDidMount() {
        this.callAPI();
        this.initializeGoogleTranslate();
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
     * Renders the landing screen component.
     * @returns {JSX.Element} The JSX element representing the landing screen.
     */
    render() {
        // Checks for accessibility data, or defaults it
        if (!localStorage.getItem('textsize')) {
            localStorage.setItem('textsize', 1);
        }
        if (!localStorage.getItem('boldtext')) {
            localStorage.setItem('boldtext', 'normal');
        }
        if (!localStorage.getItem('colorinv')) {
            localStorage.setItem('colorinv', '0');
        }

        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        // console.log(this.state.apiResponse);
        // console.log(localStorage.getItem('textsize'));
        return (
                // Redirect buttons for settings or customer ordering
                <div id="Landing" className="App"style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
                    <div className="Landing-header">
                        <img src={logo} className="Landing-logo" alt="logo" />
                        <h1 className="Landing-title">Welcome to Rev's American Grill!</h1>
                        <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/customerOrders"><button id='beginbutton'>Click to Begin</button></a>
                    </div>
                    <div id="google_translate_element"></div>
                </div>
        );
    }
}

export default Landing;
