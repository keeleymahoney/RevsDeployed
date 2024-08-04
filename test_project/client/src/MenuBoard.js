import React, { Component } from "react";
import "./MenuBoard.css";
import revsLogo from './revs-logo.png'

/**
 * @author Joanne Liu
 * MenuBoard component displays menu items categorized into entrees, sides, beverages, and seasonals.
 * It fetches data from external APIs for each category of menu items and renders them.
 */
class MenuBoard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            entrees: [], // State to hold entrees data
            sides: [],
            desserts: [],
            beverages: [], 
            seasonals: [],
            promotions: []
        };
        this.fetchEntreesData();
    }
    
    /**
     * Invoked immediately after a component is mounted.
     * Initializes Google Translate.
     */
    componentDidMount() {
        this.initializeGoogleTranslate();
    }

    /**
     * Initializes Google Translate if it's not already initialized.
     * Adds a script element to the document body to load the Google Translate API asynchronously.
     * Sets the callback function to handle Google Translate initialization.
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
     * Callback function to initialize Google Translate.
     * Creates a new Google Translate element with English as the page language.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    /**
     * Fetches entrees data from the external API.
     */
    fetchEntreesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/entrees")
            .then(res => res.json())
            .then(res => this.setState({ entrees: res}))
            .catch(err => console.error(err));
    }

    /**
     * Renders entrees menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing entrees menu items.
     */
    renderEntrees() {
        const { entrees } = this.state;
        return entrees.map(item => ( item.price > 0 && 
            <tr key={item.item_name}>
                <div className = "menu-item-box">
                    <div className = "header-row">
                        <span>{item.item_name} </span> | {item.price} &emsp; 
                        {item.vegetarian && 'V'} &nbsp;&nbsp; {item.glutenfree && 'GF'}
                    </div>
                    <p>&nbsp;&nbsp; {item.descript}</p>
                </div>
            </tr>
        ));
    }

    /**
     * Renders the MenuBoard component with information for entrees
     * @returns {JSX.Element} JSX Element representing the MenuBoard component.
     */
    render() {
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        return (
            <div style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
            <header className = "menuboard-header">
                <div className = "header-content">
                    <img src={revsLogo} alt="Rev's American Grill Logo" className = "left-logo"/>
                    <div className = "middle-text">
                        <h1 className = "header">Entrees</h1>
                    </div>
                </div>
            </header>
                <div className = "menuboard-container">
                    <div className = "left-column">
                        <div className = "category-box-columns">
                            <div className = "category-box">
                                {this.renderEntrees()}
                            </div>
                        </div>
                    </div>
                    {/* <div className = "right-column">
                        <div className = "header">Seasonals</div>
                        <div className = "category-box">
                            {this.renderSeasonals()}
                        </div>
                        <div className = "header">Sides</div>
                        <div className = "category-box">
                            {this.renderSides()}
                        </div>
                        <div className = "header">Beverages</div>
                        <div className = "category-box">
                            {this.renderBeverages()}
                        </div>
                    </div> */}
                </div>
                <div id="google_translate_element"></div>
            </div>
        );
    }
}

export default MenuBoard;
