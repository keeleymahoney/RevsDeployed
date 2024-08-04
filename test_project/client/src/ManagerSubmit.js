import React, { Component } from "react";
import { Link, Navigate } from 'react-router-dom';
import "./App.css";
import OrderCompletePopUp from "./OrderCompletePopUp";

/**
 * @author Joanne Liu
 * Component for customer order submission on manager view.
 */
class ManagerSubmit extends Component {

    /**
    * Constructs a new ManagerSubmit component.
    * 
    * @param {Object} props - The props passed to the ManagerSubmit component.
    */
    constructor(props) {
        super(props);
        this.state = {
            menuData: {},
            selectedItems: {},
            ingredientData: {},
            total: 0,
            orderNumInput: [],
            isConfirmationOpen: false,
            notes: "",
            totalIngredients: {},
            errorQuantity: false,
        };
        this.orderNum = 0;
        this.fetchOrderNum();
        this.fetchMenuData();
    }

    /**
     * Executes when the component is mounted.
     * Calls methods to fetch ingredient data, fetch saved data, and initialize Google Translate.
     * This lifecycle method is invoked immediately after a component is mounted.
     */
    componentDidMount() {
        this.fetchIngredientData();
        this.fetchSavedData();
        this.initializeGoogleTranslate();
    }

    /**
     * Initializes Google Translate.
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
     * Initializes Google Translate element.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    /**
     * Fetches the latest order number from the server.
     */
    fetchOrderNum() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/orderNum")
        // fetch("http://localhost:9000/customerOrdersAPI/orderNum") 
            .then(res => res.json())
            .then(res => this.setState({ orderNumInput: res }))            
            .catch(err => console.error(err));
    }

    /**
     * Fetches saved data from the server.
     */
    fetchSavedData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/savedData")
        // fetch("http://localhost:9000/customerOrdersAPI/savedData") 
            .then(res => res.json())
            .then(res => {
                if (res && Object.keys(res).length > 0) {
                    this.setState({ selectedItems: res }, this.calculateTotal);
                } else {
                    this.setState({ selectedItems: {} });
                }
            })          
            .catch(err => console.error(err));
    }

    /**
     * Fetches menu data from the server.
     */
    fetchMenuData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI") 
        // fetch("http://localhost:9000/menuItemsAPI") 
            .then(res => res.json())
            .then(res => {
                const menuDataMap = {};
                res.forEach(item => {
                    menuDataMap[item.item_name] = {price: item.price, descript: item.descript, picture: item.picture, veg: item.vegetarian, gf: item.glutenfree} ;
                });
                this.setState({ menuData: menuDataMap });
            })
            .catch(err => console.error(err));
    }

    /**
     * Fetches ingredient data from the server.
     */
    fetchIngredientData() {
        // console.log("in locations");
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/ingredientData")
        // fetch("http://localhost:9000/customerOrdersAPI/ingredientData") 
            .then(res => res.json())
            .then(res => {
                const ingredientMap = {};
                res.forEach(item => {
                    ingredientMap[item.ingredient_name] = {location: item.storage_location, custom: item.customizable} ;
                });
                this.setState({ ingredientData: ingredientMap });
                // console.log(ingredientMap);
            })
            .catch(err => console.error(err));
    }

    /**
     * Calculates the total price of selected items.
     */
    calculateTotal() {
        const { selectedItems } = this.state;
        let total = 0;
        Object.values(selectedItems).forEach(selectedItem => {
            total += selectedItem.quantity * selectedItem.price;
        });
        this.setState({ total });
    }

    /**
     * Toggles the confirmation pop-up state.
     */
    toggleConfirmationPopUp = () => {
        this.setState(prevState => ({ isConfirmationOpen: !prevState.isConfirmationOpen }));
    };

    /**
     * Reloads the page after handling back action.
     */
    reloadPage = () => {
        this.handleBack();
        this.setState({selectedItems: {}, total: 0, isConfirmationOpen: false, submitted: true});
    };

     /**
     * Handles changes in the quantity of a selected item.
     * 
     * @param {string} itemName - The name of the item whose quantity is changing.
     * @param {string} type - The type of change ('increase' or 'decrease').
     */
    handleQuantityChange(itemName, type) {
        const { selectedItems } = this.state;
        const updatedItems = { ...selectedItems };
        switch (type) {
            case 'increase':
                // make deep copy of first instance
                const newItemIngredients = updatedItems[itemName].ingredients[0].map(ingredient => ({ ...ingredient }));
                updatedItems[itemName].ingredients.push(newItemIngredients);
                updatedItems[itemName].quantity++;
                break;
            case 'decrease':
                if (updatedItems[itemName].quantity > 1) {
                    updatedItems[itemName].ingredients.pop();
                    updatedItems[itemName].quantity--;
                } else {
                    // remove item if quantity < 1
                    delete updatedItems[itemName];
                }
                break;
            default:
                break;
        }
        this.setState({ selectedItems: updatedItems }, this.calculateTotal);
    }

    /**
    * Handles changes in the quantity of an ingredient of a selected item.
    * 
    * @param {string} itemName - The name of the item whose ingredient quantity is changing.
    * @param {number} index - The index of the ingredient list.
    * @param {string} ingredientName - The name of the ingredient whose quantity is changing.
    * @param {string} type - The type of change ('increase' or 'decrease').
    */
    handleIngredientQuantityChange(itemName, index, ingredientName, type) {
        const { selectedItems } = this.state;
        const updatedItems = { ...selectedItems };
        this.setState({errorQuantity: false});
        // console.log(selectedItems);
        // console.log("here in handle: ", updatedItems[itemName].ingredients[index][ingIndex].quantity, " index: ", index);
        
        switch (type) {
            case 'increase':
                updatedItems[itemName].ingredients[index].find(ingredient => ingredient.name === ingredientName).quantity++;
                break;
            case 'decrease':
                const ingredient = updatedItems[itemName].ingredients[index].find(ingredient => ingredient.name === ingredientName);
                if (ingredient && ingredient.quantity > 0) {
                    ingredient.quantity--;
                } else {
                    this.setState({ errorQuantity: true });
                }
                break;
            default:
                break;
        }
        this.setState({selectedItems: updatedItems});
    }

    /**
     * Handles the back action.
     * 
     * Saves the selected items to the server.
     */
    handleBack = () => {
        const { selectedItems } = this.state;
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/save", {
        // fetch("http://localhost:9000/customerOrdersAPI/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({selectedItems})
        })
        .then(() => {
            console.log("data saved");
            console.log(selectedItems);
        })
        .catch(error => {
            console.error("Error saving order:", error);
            window.alert("Error loading check out screen. Please try again later.");
        });
    };

    /**
     * Handles the submission of the order.
     * 
     * It calculates order number, current date and time, and total ingredients.
     * Submits the order and its ingredients to the server.
     */
    handleSubmit() {
        const { total, orderNumInput, selectedItems, notes } = this.state;

        this.orderNum = orderNumInput[0].max + 1;
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const order_date = `${year}-${month}-${day}`;

        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const order_time = `${hours}:${minutes}:${seconds}`;

        const totalIngredients = {};
        for (const itemName in selectedItems) {
            const item = selectedItems[itemName];
            // console.log("Item:", item);
            item.ingredients.forEach(subList => { 
                subList.forEach(ingredient => { 
                    const { name, quantity } = ingredient; 
                    if (!totalIngredients[name]) {
                        totalIngredients[name] = quantity;
                    } else {
                        totalIngredients[name] += quantity;
                    }
                });
            });
        }

        // console.log(selectedItems);

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submit", {
        // fetch("http://localhost:9000/customerOrdersAPI/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({orderNum: this.orderNum, total, order_date, order_time, notes, selectedItems})
        })
        .then(() => {})
        .catch(error => {
            console.error("Error submitting order:", error);
            window.alert("Error submitting order. Please try again later.");
        })

        // //fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submitDetails", {
        // fetch("http://localhost:9000/customerOrdersAPI/submitDetails", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({orderNum: this.orderNum, selectedItems})
        // })
        // .then(() => {})
        // .catch(error => {
        //     console.error("Error submitting order:", error);
        //     window.alert("Error submitting order. Please try again later.");
        // })

        // console.log("submit handle total: ", total);
        // fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submitOrderAll", {
        // fetch("http://localhost:9000/customerOrdersAPI/submitOrderAll", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({orderNum: this.orderNum, total, order_time, order_date, notes, selectedItems})
        // })
        // .then(() => {
        //     this.setState({selectedItems: {}, notes: ""});
        //     this.toggleConfirmationPopUp();
        // })
        // .catch(error => {
        //     console.error("Error submitting order:", error);
        //     window.alert("Error submitting order. Please try again later.");
        // })

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submitIngredients", {
        // fetch("http://localhost:9000/customerOrdersAPI/submitIngredients", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({totalIngredients})
        })
        .then(() => {
            this.setState({selectedItems: {}, notes: ""});
            this.toggleConfirmationPopUp();
        })
        .catch(error => {
            console.error("Error submitting order ingredients:", error);
            window.alert("Error submitting order ingredients. Please try again later.");
        })
        
    }

     /**
     * Handles changes in the notes input field.
     * 
     * @param {Object} event - The event object representing the change in the input field.
    */
    handleNoteChange = (event) => {
        this.setState({ notes: event.target.value });
    }

    /**
     * Renders the selected items for checkout along with their quantities and prices.
     * 
     * @returns {JSX.Element} The JSX elements representing the selected items.
     */
    renderSelectedItems() {
        const { selectedItems, total, submitted, ingredientData} = this.state;
        return (
            <div>
                {submitted && (
                    <Navigate to="/ManagerOrders" replace={true} />
                )}
                {/* <h2>Order</h2> */}
                <div className="checkout-selected-items-container">
                    <div className="selected-items-list">
                    {Object.entries(selectedItems).map(([itemName, selectedItem]) => (
                        <div key={itemName} className="selected-item">
                            <div className="item-info">
                                <div className="quantity-buttons">
                                    <p>{selectedItem.quantity}</p>
                                    <div style={{ width: '10px' }}></div>
                                    <button className="quantity-button" onClick={() => this.handleQuantityChange(itemName, 'increase')}>+</button>
                                    <button className="quantity-button" onClick={() => this.handleQuantityChange(itemName, 'decrease')}>-</button>
                                </div>
                            </div>
                            <div className="item-name">
                                <p>{selectedItem.name}</p>
                            </div>
                            <p className="checkout-item-price">${(selectedItem.quantity * selectedItem.price).toFixed(2)}</p>
                            {selectedItem.ingredients && (
                                <div className="item-ingredients">
                                    <div>
                                        {selectedItem.ingredients.slice(1).map((ingredientList, index) => (
                                            <div key={index} className = "checkout-ingredient-box">
                                                {ingredientList
                                                    .filter(ingredient => ingredient.quantity >= 0)
                                                    .filter(ingredient => ingredientData[ingredient.name] && ingredientData[ingredient.name].location !== "Storage")
                                                    .filter(ingredient => !(ingredient.name.includes(" - ") && ingredient.quantity === 0))
                                                    .filter(ingredient  => ingredientData[ingredient.name].custom)
                                                    .map((ingredient, subIndex) => (
                                                        <div key={subIndex} className="ingredient-row">
                                                            <div className="quantity-buttons">
                                                                <p>{ingredient.quantity}</p>
                                                                <div style={{ width: '10px' }}></div>
                                                                <button className="quantity-button" onClick={() => this.handleIngredientQuantityChange(itemName, index + 1, ingredient.name, 'increase')}>+</button>
                                                                <button className="quantity-button" onClick={() => this.handleIngredientQuantityChange(itemName, index + 1, ingredient.name, 'decrease')}>-</button>
                                                                <p> &emsp; {ingredient.name}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                <div style={{ width: '100px' }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    ))}
                    </div>
                </div>
                <div className = "checkout-total-price">
                    <p>Total: ${total.toFixed(2)}</p>
                </div>
                
            </div>
        )
    }

    /**
     * Renders the check out screen component.
     * @returns {JSX.Element} The JSX element representing the check out screen.
     */
    render() {
        const { isConfirmationOpen, total, notes, errorQuantity } = this.state;
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        return (
            <div style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                <div className = "checkout">
                    <div className = "checkout-left">
                        <div className="customer-submit">
                            {this.renderSelectedItems()}
                        </div>
                    </div>
                    <div className = "checkout-right">
                        <div className = "checkout-notes">
                            <p>Notes</p>
                            <textarea
                                type="text"
                                value={notes}
                                onChange={this.handleNoteChange}
                                placeholder="Add notes..."
                            />
                             <div className = "error-message">
                                {errorQuantity && <h3>Quantity already 0!</h3>}
                            </div>
                        </div>
                        <div className = "checkout-footer">
                            <Link to="/ManagerOrders">
                                <button onClick={() => this.handleBack()}>Back</button>
                            </Link>
                            <button onClick={() => this.handleSubmit()}>Submit Order</button>
                        </div>
                    </div>
                </div>

                {isConfirmationOpen && (
                    <OrderCompletePopUp
                        onClose={this.reloadPage}
                        orderNumber = {this.orderNum}
                        totalPrice = {total}
                    />
                )}
                <div id="google_translate_element"></div>
            </div>
        );
    }
}

export default ManagerSubmit;
