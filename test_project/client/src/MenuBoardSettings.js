import React, { Component } from "react";
import "./MenuBoard.css";
import { Navigate } from 'react-router-dom';
//import Ingredients from './Ingredients';

class MenuBoardSettings extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            entrees: [], // State to hold entrees data
            sides: [],
            desserts: [],
            beverages: [], 
            seasonals: [],
            promotions: [],
            selectedEntree: "",
            selectedSide: "",
            selectedDessert: "",
            selectedBeverage: "",
            selectedSeasonal: "",
            selectedItems: [],
            submitted: false
        };
        this.fetchEntreesData();
        this.fetchSidesData();
        this.fetchBeveragesData();
        this.fetchDessertsData();
        this.fetchSeasonalsData();
        this.fetchPromotions();
        this.initializePromotions();
    }
    
    
    componentDidMount() {
        this.initializeGoogleTranslate();
    }

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

    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }


    // Function to fetch entrees data
    fetchEntreesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/entrees")
            .then(res => res.json())
            .then(res => this.setState({ entrees: res}))
            .catch(err => console.error(err));
    }

    // Function to fetch beverages data
    fetchBeveragesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/beverages")
            .then(res => res.json())
            .then(res => this.setState({ beverages: res}))
            .catch(err => console.error(err));
    }

    // Function to fetch sides data
    fetchSidesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/sides")
            .then(res => res.json())
            .then(res => this.setState({ sides: res}))            
            .catch(err => console.error(err));
    }


    // Function to fetch desserts data
    fetchDessertsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/desserts")
            .then(res => res.json())
            .then(res => this.setState({ desserts: res}))
            .catch(err => console.error(err));
    }

    // Function to fetch seasonals data
    fetchSeasonalsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/seasonals")
            .then(res => res.json())
            .then(res => this.setState({ seasonals: res }))            
            .catch(err => console.error(err));
    }

    fetchPromotions() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/promotions")
        // fetch("http://localhost:9000/menuItemsAPI/promotions")
            .then(res => res.json())
            .then(res => {
                this.setState({ promotions: res }, () => {
                    this.initializePromotions(); // Call initializePromotions after setting state
                });
            })     
            .catch(err => console.error(err));
    }

    initializePromotions = () => {
        const{promotions} = this.state;
        console.log(promotions);
        promotions.forEach(promotion => {
            // Update selected items based on menu category
            switch (promotion.menu_category) {
                case "Entree":
                    this.setState({ selectedEntree: promotion.item_name });
                    break;
                case "Beverage":
                    this.setState({ selectedBeverage: promotion.item_name });
                    break;
                case "Side":
                    this.setState({ selectedSide: promotion.item_name });
                    break;
                case "Dessert":
                    this.setState({ selectedDessert: promotion.item_name });
                    break;
                case "Seasonal":
                    this.setState({ selectedSeasonal: promotion.item_name });
                    break;
                default:
                    break;
            }
        });
    }

    handleEntreeChange = (event) => {
        this.setState({ selectedEntree: event.target.value });
    };
    handleSideChange = (event) => {
        this.setState({ selectedSide: event.target.value });
    };
    handleBeverageChange = (event) => {
        this.setState({ selectedBeverage: event.target.value });
    };
    handleDessertChange = (event) => {
        this.setState({ selectedDessert: event.target.value });
    };
    handleSeasonalChange = (event) => {
        this.setState({ selectedSeasonal: event.target.value });
    };

    handleSubmit = () => {
        const {selectedEntree, selectedBeverage, selectedSide, selectedDessert, selectedSeasonal, selectedItems} = this.state;

        let currItems = [];
        // Check if each selected item is not null or an empty string, and add it to selectedItems if true
        if (selectedEntree) {
            currItems.push(selectedEntree);
        }
        if (selectedBeverage) {
            currItems.push(selectedBeverage);
        }
        if (selectedSide) {
            currItems.push(selectedSide);
        }
        if (selectedDessert) {
            currItems.push(selectedDessert);
        }
        if (selectedSeasonal) {
            currItems.push(selectedSeasonal);
        }

        console.log(currItems);


        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/savePromotions", {
        // fetch("http://localhost:9000/menuItemsAPI/savePromotions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({selectedItems: currItems})
        })
        .then(this.setState({ submitted: true }))  
    }



    render() {
        const { entrees, sides, beverages, desserts, seasonals, selectedEntree, selectedSide, selectedBeverage, selectedDessert, selectedSeasonal, selectedItems, submitted } = this.state;
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        return (
            <div className = "settings-container" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                {submitted && (
                    <Navigate to="/MenuBoard" replace={true} />
                )}
                <div>
                    <select value={selectedEntree} onChange={this.handleEntreeChange}>
                        <option value="">Select an entree</option>
                        {entrees.map(entree => (
                            <option key={entree.item_name} value={entree.item_name}>{entree.item_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedSide} onChange={this.handleSideChange}>
                        <option value="">Select a side</option>
                        {sides.map(entree => (
                            <option key={entree.item_name} value={entree.item_name}>{entree.item_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select value={selectedDessert} onChange={this.handleDessertChange}>
                        <option value="">Select a dessert</option>
                        {desserts.map(entree => (
                            <option key={entree.item_name} value={entree.item_name}>{entree.item_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedBeverage} onChange={this.handleBeverageChange}>
                        <option value="">Select a beverage</option>
                        {beverages.map(entree => (
                            <option key={entree.item_name} value={entree.item_name}>{entree.item_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select value={selectedSeasonal} onChange={this.handleSeasonalChange}>
                        <option value="">Select a seasonal</option>
                        {seasonals.map(entree => (
                            <option key={entree.item_name} value={entree.item_name}>{entree.item_name}</option>
                        ))}
                    </select>
                </div>


                <p>Selected entree: {selectedEntree}</p>
                <p>Selected Side: {selectedSide}</p>
                <p>Selected Dessert: {selectedDessert}</p>
                <p>Selected Beverage: {selectedBeverage}</p>
                <p>Selected Seasonal: {selectedSeasonal}</p>
                <p>Selected: {selectedItems}</p>
                <button onClick = {this.handleSubmit}>Submit</button>
                <div id="google_translate_element"></div>
            </div>
        );   
    }
}

export default MenuBoardSettings;
