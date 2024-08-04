import React, { Component } from "react";
import "./MenuBoard.css";
import revsLogo from './revs-logo.png'

//import Ingredients from './Ingredients';


/**
 * @author Joanne Liu
 * MenuBoard2 component displays the menu items fetched from the server and initializes Google Translate.
 * 
 * It fetches entrees, sides, desserts, beverages, seasonals, and promotions data from the server.
 */
class MenuBoard2 extends Component {
    /**
     * Constructor for MenuBoard2 component.
     * Initializes the state to hold entrees, sides, desserts, beverages, seasonals, and promotions data.
     * Fetches data for entrees, sides, desserts, beverages, seasonals, and promotions.
     */
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
        this.fetchDessertsData();
    }
    
    /**
     * Lifecycle method invoked after the component is mounted.
     * Initializes Google Translate.
     */
    componentDidMount() {
        this.initializeGoogleTranslate();
    }

    /**
     * Initializes Google Translate script if not already loaded.
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
     * Initializes the Google Translate element.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    /**
     * Fetches desserts data from the server.
     */
    fetchDessertsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/desserts")
            .then(res => res.json())
            .then(res => this.setState({ desserts: res}))
            .catch(err => console.error(err));
    }

    /**
     * Renders dessert menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing dessert menu items.
     */
    renderDesserts() {
        const { desserts } = this.state;
        return desserts.map(item => ( item.price > 0 && 
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
     * Renders the MenuBoard component with information for desserts
     * @returns {JSX.Element} JSX Element representing the MenuBoard2 component.
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
                        <h1 className = "header">Desserts</h1>
                    </div>
                </div>
            </header>
                <div className = "menuboard-container">
                <div className = "left-column">
                        <div className = "category-box-columns">
                            <div className = "category-box">
                                {this.renderDesserts()}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="google_translate_element"></div>
            </div>
        );
    }
}

export default MenuBoard2;
