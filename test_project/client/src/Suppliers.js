import React, { useState, useEffect } from "react";
import "./App.css";
import NewSupplierOrderForm from "./NewSupplierOrderPopup";
import SupplierOrderDetailsPopUp from "./SupplierOrderDetailsPopUp";
import ConfirmationPopup from "./ConfirmationPopup";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Functional component for managing supplier-related functionalities.
 * @returns {JSX.Element} - The JSX element representing the Suppliers component.
 * @module Suppliers
 * @author Keeley Mahoney, Alyan Tharani
 */
const Suppliers = () => {
    const navigate = useNavigate();
    const { ingredientName, quantityDifference } = useParams();
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
    const [isNewPopUpOpen, setIsNewPopUpOpen] = useState(false);
    const [isDisplayPopUpOpen, setIsDisplayPopUpOpen] = useState(false);
    const [ingredientsAvail, setIngredientsAvail] = useState([]);
    const [currentOrderIngredients, setCurrentOrderIngredients] = useState([]);
    const [orderNumber, setOrderNumber] = useState(0);
    const [supplierName, setSupplierName] = useState("");
    const [supplierOrders, setSupplierOrders] = useState([]);
    const [currSupplyOrder, setCurrSupplyOrder] = useState([]);
    const [currOrderNumber, setCurrOrderNumber] = useState(0);
    const [currOrderTime, setCurrOrderTime] = useState("");
    const [currOrderDate, setCurrOrderDate] = useState("");
    const [currSupplierName, setCurrSupplierName] = useState("");
    const [selectedIngredient, setSelectedIngredient] = useState('');

    /**
         * Cleanup function for the useEffect hook.
         * @returns {void}
         */
    useEffect(() => {
        callAPI();
        getSupplierOrders();
        if (ingredientName && quantityDifference) {
            addIngredientFromProps(ingredientName, quantityDifference);
        }
        initializeGoogleTranslate();
    }, []);

    /**
     * Fetches ingredients from the API.
     * @returns {void}
     * @method callAPI
     */
    const callAPI = () => {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI")
            .then(res => res.json())
            .then(res => {
                const ingredients = res.filter(ingredient => ingredient.quantity >= 0);
                setIngredientsAvail(ingredients);
            })
            .catch(err => console.error(err));
    };

    /**
     * Initializes Google Translate.
     * @returns {void}
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
 * Initializes the Google Translate widget.
 * @returns {void}
 * @method googleTranslateElementInit
 */
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    /**
     * Fetches supplier orders from the API.
     * @returns {void}
     * @method getSupplierOrders
     */
    const getSupplierOrders = () => {
        fetch('https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/suppliersAPI/orders')
            .then(res => res.json())
            .then(res => setSupplierOrders(res))
            .catch(err => console.error(err));
    };

    /**
     * Fetches details of a specific supplier order.
     * @param {number} orderNumber - The order number to retrieve details for.
     * @param {string} orderDate - The date of the order.
     * @param {string} orderTime - The time of the order.
     * @param {string} supplierName - The name of the supplier.
     * @method getSupplierOrderDetails
     * @returns {void}
     */
    const getSupplierOrderDetails = (orderNumber, orderDate, orderTime, supplierName) => {
        fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/suppliersAPI/order-details/${orderNumber}`)
            .then(res => res.json())
            .then(res => {
                setCurrSupplyOrder(res);
                console.log(res);
                setCurrOrderDate(orderDate);
                // console.log(orderDate);
                setCurrOrderNumber(orderNumber);
                // console.log(orderNumber);
                setCurrOrderTime(orderTime);
                // console.log(orderTime);
                setCurrSupplierName(supplierName);
                // console.log(supplierName);
                setIsDisplayPopUpOpen(true);
            })
            .catch(err => console.error(err));
    };

    /**
     * Adds an ingredient from props to the current order.
     * @param {string} ingredientName - The name of the ingredient to add.
     * @param {number} quantityDifference - The quantity of the ingredient to add.
     * @method addIngredientFromProps
     * @returns {void}
     */
    const addIngredientFromProps = (ingredientName, quantityDifference) => {
        const newIngredient = {
            name: ingredientName,
            quantityOrdered: quantityDifference,
            quantityReceived: quantityDifference,
            wholesalePrice: 0.5 // Adjust this as needed
        };
        setCurrentOrderIngredients([...currentOrderIngredients, newIngredient]);
        setIsNewPopUpOpen(true);
    };

    /**
     * Handles the change event for selecting an ingredient.
     * @param {Event} event - The change event object.
     * @returns {void}
     * @method handleIngredientChange
     */
    const handleIngredientChange = (event) => {
        setSelectedIngredient(event.target.value);
    };


    /**
 * Handles the change event for updating the quantity of an ingredient.
 * @param {string} name - The name of the ingredient.
 * @param {number} quantity - The new quantity of the ingredient.
 * @returns {void}
 * @method handleQuantityChange
 */
    const handleQuantityChange = (name, quantity) => {
        const digitPattern = /^\d+$/;
        if (digitPattern.test(quantity)) {
            setCurrentOrderIngredients(prevState => (
                prevState.map(ingredient => {
                    if (ingredient.name === name) {
                        return { ...ingredient, quantityOrdered: parseInt(quantity), quantityReceived: parseInt(quantity) };
                    }
                    return ingredient;
                })
            ));
        } else {
            alert("Please enter a valid quantity containing only digits.");
        }
    };

    /**
 * Handles the change event for updating the supplier name.
 * @param {Event} event - The change event object.
 * @returns {void}
 * @method handleSupplierNameChange
 */
    const handleSupplierNameChange = (event) => {
        setSupplierName(event.target.value);
    };

    /**
 * Handles the change event for updating the order number.
 * @param {Event} event - The change event object.
 * @returns {void}
 * @method handleOrderNumberChange
 */
    const handleOrderNumberChange = (event) => {
        setOrderNumber(event.target.value);
    };

    /**
 * Deletes an ingredient from the current order.
 * @param {string} name - The name of the ingredient to delete.
 * @returns {void}
 * @method handleDeleteIngredient
 */
    const handleDeleteIngredient = (name) => {
        setCurrentOrderIngredients(prevState => prevState.filter(ingredient => ingredient.name !== name));
    };

    /**
 * Sets the state to open the new supplier order popup.
 * @returns {void}
 * @method handleCreateNewOrder
 */
    const handleCreateNewOrder = () => {
        setIsNewPopUpOpen(true);
    };

    /**
 * Sets the state to open the display popup.
 * @returns {void}
 * @method handleCreateDisplay
 */
    const handleCreateDisplay = () => {
        setIsDisplayPopUpOpen(true);
    };

    /**
 * Closes the new supplier order popup and resets related state.
 * @returns {void}
 * @method handleClosePopup
 */
    const handleClosePopup = () => {
        setIsNewPopUpOpen(false);
        setCurrentOrderIngredients([]);
        setSelectedIngredient("");

    };

    /**
 * Toggles the state to open/close the confirmation popup.
 * @returns {void}
 * @method toggleConfirmationPopup
 */
    const toggleConfirmationPopup = () => {
        setIsConfirmationPopupOpen(prevState => !prevState);
    };

    /**
 * Closes the display popup.
 * @returns {void}
 * @method handleCloseDisplayPopup
 */
    const handleCloseDisplayPopup = () => {
        setIsDisplayPopUpOpen(false);
    };

    /**
 * Submits a new supplier order to the server.
 * @param {string} thisorderTime - The time of the order.
 * @param {string} thisorderDate - The date of the order.
 * @returns {void}
 * @method handleSubmitNewOrder
 */
    const handleSubmitNewOrder = async (thisorderTime, thisorderDate) => {
        console.log("order time");
        console.log(thisorderTime);
        console.log("order date");
        console.log(thisorderDate);
        const newOrder = {
            currentOrderIngredients,
            thisorderTime,
            thisorderDate,
            supplierName,
            orderNumber
        };

        const updatedIngredientsChange = ingredientsAvail.map(ingredient => {
            const matchingIngredient = currentOrderIngredients.find(item => item.name === ingredient.ingredient_name);
            if (matchingIngredient) {
                const quantity = parseInt(ingredient.quantity);
                const quantityOrdered = parseInt(matchingIngredient.quantityOrdered);
                return { ...ingredient, quantity: quantity + quantityOrdered };
            } else {
                return ingredient;
            }
        });

        await fetch('https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/suppliersAPI/new-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder)
        });

        console.log(updatedIngredientsChange);

        await fetch('https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI/updateMany', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedIngredientsChange)
        });

        getSupplierOrders();
        toggleConfirmationPopup();
        setIsNewPopUpOpen(false);
        setCurrentOrderIngredients([]);
        setOrderNumber('');
        setSupplierName('');
        navigate(`/suppliers`);
    };

   
        
/**
 * Adds an ingredient to the current order.
 * @param {Object} ingredient - The ingredient object to add.
 * @returns {void}
 * @method addIngredientToOrder
 */
    const addIngredientToOrder = (ingredient) => {
        setCurrentOrderIngredients(prevState => [...prevState, ingredient]);
        setSelectedIngredient("");
    };

    const penTextSize = localStorage.getItem('textsize');
    document.documentElement.style.setProperty('--text-size', penTextSize);
    const penTextWeight = localStorage.getItem('boldtext');
    document.documentElement.style.setProperty('--bold-text', penTextWeight);

    return (
        <div className="suppliers" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
            <button id = "refreshbutton" onClick={callAPI}>Refresh</button>
            <header>
                <h1>Supplier Order</h1>
            </header>
            <div className="navigation-buttons">
                            {/* Navigation Buttons */}
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button >Inventory</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button id = "selected">Supplier Order</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button >Employee List</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button >Previous Orders</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button >Kitchen</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                        </div>
            <div className="order-form">
                <button onClick={handleCreateNewOrder}>Create New Supplier Order</button>
            </div>
            <div>
                <h2>Previous Supplier Orders</h2>
                {supplierOrders
                    .sort((a, b) => new Date(a.order_date) - new Date(b.order_date)) // Sort orders by orderDate in ascending order
                    .map(order => {
                        const orderDate = new Date(order.order_date);
        
                        // Increment the date by one day
                        orderDate.setDate(orderDate.getDate() + 1);
                    
                        // Adjust the date to Central Time (UTC-6 hours)
                        orderDate.setHours(orderDate.getHours() - 6);
                        
                        // Extract day, month, and year
                        const day = orderDate.getDate();
                        const month = orderDate.getMonth() + 1;
                        const year = orderDate.getFullYear();
                        
                        // Format the date string as "MM-DD-YYYY"
                        const formattedDate = `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}-${year}`;
                        

                        return (
                            <button key={order.order_number} onClick={() => getSupplierOrderDetails(order.order_number, order.order_date, order.order_time, order.supplier)}>
                                <div>Order Date: {formattedDate}</div>
                                <div>Supplier Name: {order.supplier} </div>
                            </button>
                        );
                    })
                }
            </div>

            {isNewPopUpOpen && (
                <NewSupplierOrderForm
                    onClose={handleClosePopup}
                    ingredientsAvail={ingredientsAvail}
                    currentOrderIngredients={currentOrderIngredients}
                    selectedIngredient={selectedIngredient}
                    addIngredientToOrder={addIngredientToOrder}
                    submitOrder={handleSubmitNewOrder}
                    updateIngredientQuantity={handleQuantityChange}
                    handleOrderNumberChange={handleOrderNumberChange}
                    handleSupplierNameChange={handleSupplierNameChange}
                    handleIngredientChange={handleIngredientChange}
                    handleQuantityChange={handleQuantityChange}
                    handleDeleteIngredient={handleDeleteIngredient}
                />
            )}

            {isDisplayPopUpOpen && (
                <SupplierOrderDetailsPopUp
                    onClose={handleCloseDisplayPopup}
                    order={currSupplyOrder}
                    orderNumber={currOrderNumber}
                    orderTime={currOrderTime}
                    orderDate={currOrderDate}
                    supplierName={currSupplierName}
                />
            )}

            {isConfirmationPopupOpen && (
                <ConfirmationPopup
                    onClose={toggleConfirmationPopup}
                    message="New Supplier Order has been added."
                />
            )}

            {/* Render other UI elements */}
            <div id="google_translate_element"></div>
        </div>
    );
};

export default Suppliers;
