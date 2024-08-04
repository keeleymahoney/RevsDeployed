

import React, { useState, useEffect } from "react";
import "./App.css";
import AddIngredientPopup from "./AddIngredientPopUp";
import EditIngredientPopup from "./EditIngredientPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import { useNavigate } from "react-router-dom";


/**
 * Ingredients component for managing ingredients.
 * @module Ingredients
 * @author Keeley Mahoney
 * @returns {JSX.Element} Ingredients component JSX
 */
const Ingredients = () => {
    const navigate = useNavigate();

    const [apiResponse, setAPIResponse] = useState([]);
    const [updatedData, setUpdatedData] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        ingredient_name: "",
        quantity: "",
        quantity_warning: "",
        storage_location: "",
        unit: "",
        vegetarian: false,
        glutenfree: false,
        customizable: false
    });
    const [editedIngredient, setEditedIngredient] = useState({});
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [message, setMessage] = useState("");

    /**
     * Fetches data from the API and initializes Google Translate.
     * @method callAPI
     * @returns {void}
     */

    const callAPI = () => {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI")
            .then(res => res.json())
            .then(res => {
                setAPIResponse(res);
                setUpdatedData(res);
            })
            .catch(err => console.error(err));
    };

  /**
 * Calls the API and initializes Google Translate when the component mounts.
 * @callback useEffect
 * @method useEffect
 * @param {Function} effect - The effect function to be executed
 * @param {Array} dependencies - An array of dependencies for the effect
 */
    useEffect(() => {
        callAPI();
        initializeGoogleTranslate();
    }, []); 

    /**
     * Initializes Google Translate if not already initialized.
     * @method initializeGoogleTranslate
     */

    const initializeGoogleTranslate = () => {
        if (!window.googleTranslateElementInit) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
            window.googleTranslateElementInit = googleTranslateElementInit.bind(this);
        }
    }

    /**
     * Initializes Google Translate element.
     * @method googleTranslateElementInit
     */
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    
    /**
     * Toggles the visibility of the add ingredient popup.
     * @method togglePopup
     */
    const togglePopup = () => {
        setIsPopupOpen(prevState => !prevState);
        setNewIngredient ({
            ingredient_name: "",
            quantity: "",
            quantity_warning: "",
            storage_location: "",
            unit: "",
            vegetarian: false,
            glutenfree: false,
            customizable: false,
        });
    };

    /**
     * Toggles the visibility of the edit ingredient popup.
     * @method toggleEditPopup
     */
    const toggleEditPopup = () => {
        setIsEditPopupOpen(prevState => !prevState);
    };

    /**
     * Toggles the visibility of the confirmation popup.
     * @method toggleConfirmationPopup
     */
    const toggleConfirmationPopup = () => {
        setIsConfirmationPopupOpen(prevState => !prevState);
    };

    /**
     * Handles input change for existing ingredient in the edit ingredient popup.
     * @param {Event} e - The input change event
     * @method handleExistingInputChange
     * @param {string} key - The key of the input field being changed
     */
    const handleExistingInputChange = (e, key) => {
        const updatedIngredient = { ...editedIngredient };

        if (key === "quantity" || key === "quantity_warning") {
            if (/^\d+$/.test(e.target.value)) {
                updatedIngredient[key] = e.target.value;
                setEditedIngredient(updatedIngredient);
                console.log(updatedIngredient);
            } else {
                alert("Please enter a positive integer containing only digits for quantity or quantity warning.");
            }
        } else {
            updatedIngredient[key] = e.target.value;
            setEditedIngredient(updatedIngredient);
            console.log(updatedIngredient);
        }
    };


     /**
     * Handles edit button click to open edit ingredient popup.
     * @method handleEditButtonClick
     * @param {Object} ingredient - The ingredient object to be edited
     */
    const handleEditButtonClick = (ingredient) => {
        setEditedIngredient(ingredient);
        setSelectedIngredient(ingredient.ingredient_name);
        setIsEditPopupOpen(true);
    };

    /**
     * Handles input change for adding a new ingredient.
     * @param {Event} e - The input change event
     * @method handleInputChange
     * @param {string} key - The key of the input field being changed
     */
    const handleInputChange = (e, key) => {
       
        if (key === "quantity" || key === "quantity_warning") {
            if (/^\d+$/.test(e.target.value)) {
                setNewIngredient({
                    ...newIngredient,
                    [key]: e.target.value
                });
            } else {
                alert("Please enter a positive integer containing only digits for quantity or quantity warning.");
            }
        } else {
            setNewIngredient({
                ...newIngredient,
                [key]: e.target.value
            });
        }
    };

 /**
     * Handles adding a new ingredient to the database.
     * @method handleAddIngredient
     */
const handleAddIngredient = () => {

    const posIngredientIndex = apiResponse.findIndex(
        ingredient => ingredient.ingredient_name === newIngredient.ingredient_name && parseInt(ingredient.quantity) > 0
    );

    if (posIngredientIndex !== -1) {
        alert("An ingredient with the same name already exists. Please choose a different name.");
        return;
    }
    // Check if the ingredient already exists with a negative quantity value
    const existingIngredientIndex = apiResponse.findIndex(
        ingredient => ingredient.ingredient_name === newIngredient.ingredient_name && parseInt(ingredient.quantity) < 0
    );

    if (existingIngredientIndex !== -1) {
        const updatedIngredient = { ...apiResponse[existingIngredientIndex], ...newIngredient };
        const updatedIngredientsArray = [updatedIngredient];

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedIngredientsArray)
        })
        .then(res => res.text())
        .then(data => {
            callAPI();
            togglePopup();
            toggleConfirmationPopup();
            setMessage(`Ingredient: ${newIngredient.ingredient_name} has been successfully added.`);
        })
        .catch(err => console.error(err));
    } else {
        console.log(newIngredient)
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newIngredient)
        })
        .then(res => res.text())
        .then(data => {
            callAPI();
            togglePopup();
            toggleConfirmationPopup();
            setMessage(`Ingredient: ${newIngredient.ingredient_name} has been successfully added.`);
        })
        .catch(err => console.error(err));
    }

   setNewIngredient ({
        ingredient_name: "",
        quantity: "",
        quantity_warning: "",
        storage_location: "",
        unit: "",
        vegetarian: false,
        glutenfree: false,
        customizable: false
    });
};

    /**
     * Handles submitting changes to an existing ingredient.
     * @method handleSubmit
     */
    const handleSubmit = () => {
        console.log(editedIngredient);
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedIngredient)
        })
            .then(res => res.text())
            .then(data => {
                callAPI();
                toggleEditPopup();
                setMessage(`Ingredient: ${editedIngredient.ingredient_name} has been successfully edited.`);
                toggleConfirmationPopup();
            })
            .catch(err => console.error(err));
    };

    /**
     * Handles deleting an existing ingredient.
     * @method handleIngredientDelete
     */
    const handleIngredientDelete = () => {
        if (!selectedIngredient) return;

        setMessage(`Ingredient: ${selectedIngredient} has been successfully deleted.`);

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI/delete", {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ingredient_name: selectedIngredient })
        })
            .then(res => res.text())
            .then(data => {
                callAPI();
                toggleEditPopup();
                toggleConfirmationPopup();
            })
            .catch(err => console.error(err));
    };

    /**
     * Handles creating a new order with a specific ingredient.
     * @param {Object} ingredient - The ingredient object for which a new order is to be created
     * @method handleCreateNewOrderWithIngredient
     */

    const handleCreateNewOrderWithIngredient = (ingredient) => {
        const quantityDifference = parseInt(ingredient.quantity_warning) - parseInt(ingredient.quantity);
        navigate(`/suppliers/${ingredient.ingredient_name}/${quantityDifference}`);
    };

    const penTextSize = localStorage.getItem('textsize');
    document.documentElement.style.setProperty('--text-size', penTextSize);
    const penTextWeight = localStorage.getItem('boldtext');
    document.documentElement.style.setProperty('--bold-text', penTextWeight);
    return (
        <div className="App" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings">
                <button id="settingsbutton">Settings</button>
            </a>
            <button id = "refreshbutton" onClick={callAPI}>Refresh</button>
            <header className="Ingredient-header">
                <h1 className="Ingredient-title">Ingredients</h1>
            </header>
            <div className="navigation-buttons">
                            {/* Navigation Buttons */}
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button id = "selected">Inventory</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button >Employee List</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button >Previous Orders</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button >Kitchen</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                        </div>
            
            <div>
                <button onClick={togglePopup}>Add Ingredient</button>
            </div>
            <h2>Ingredient List</h2>
            <div className="ingredient-grid">
                {apiResponse
                    .filter(ingredient => ingredient.quantity > 0)
                    .sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name)) // Sort alphabetically
                    .map(ingredient => (
                        <div key={ingredient.ingredient_name} className="ingredient-item">
                            <button onClick={() => handleEditButtonClick(ingredient)}>
                                <div>{ingredient.ingredient_name}</div>
                                <div>Quantity: {ingredient.quantity}</div>
                            </button>
                            {ingredient.quantity < ingredient.quantity_warning && (
                                <button onClick={() => handleCreateNewOrderWithIngredient(ingredient)} className="warning-button">
                                    <div>Low Quantity</div>
                                    <div>Click to Order More</div>
                                </button>
                            )}
                        </div>
                    ))}
            </div>
            {isPopupOpen && (
                <AddIngredientPopup
                    onClose={togglePopup}
                    onAddIngredient={handleAddIngredient}
                    newIngredient={newIngredient}
                    onChange={handleInputChange}
                />
            )}
            {isEditPopupOpen && (
                <EditIngredientPopup
                    onClose={toggleEditPopup}
                    onSubmit={handleSubmit}
                    onDelete={handleIngredientDelete}
                    ingredient={editedIngredient}
                    onInputChange={handleExistingInputChange}
                />
            )}
            {isConfirmationPopupOpen && (
                <ConfirmationPopup onClose={toggleConfirmationPopup} message={message} />
            )}
            <div id="google_translate_element"></div>
        </div>
    );
};

export default Ingredients;
