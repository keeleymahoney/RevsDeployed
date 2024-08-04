import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";
//import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
//import Ingredients from './Ingredients';
import ConfirmationPopup from "./ConfirmationPopup";

/**
 * Represents the Kitchen component responsible for displaying and managing current orders.
 * @extends Component
 */
class Kitchen extends Component {
    /**
     * Creates an instance of Kitchen.
     * @param {object} props - The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = { orders: [],
            isConfirmationPopupOpen: false,
            message: ""}
    }

    /**
 * Fetches the current orders from the API.
 * @returns {Promise} A Promise that resolves when the orders are fetched and updated in the component's state.
 * @method
 */
    async callAPI() {
        try {
            const res = await fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/currentOrders");
            const latestOrders = await res.json();
            this.setState({ orders: latestOrders }, () => {
                console.log("All orders details fetched successfully");
                console.log(this.state.orders);
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    // async callAPI() {
    //     try {
    //         const res = await fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrdersCurrent");
    //         const latestOrders = await res.json();
    
    //         // Update the state with the latest orders
    //         this.setState({ orders: latestOrders }, async () => {
    //             // Fetch order details and customizations for each order
    //             await Promise.all(this.state.orders.map(order => this.getOrderDetails(order.order_number)));
    
    //             console.log("All orders details fetched successfully");
    //             console.log(this.state.orders);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    
     /**
     * Fetches the current orders from the API when the component mounts.
     * @method
     */
    componentDidMount() {
        // Call callAPI() initially
        this.callAPI();
        // Set interval to call callAPI() every minute (60 seconds)
        this.refreshInterval = setInterval(() => {
            this.callAPI();
        }, 60000); // 60000 milliseconds = 1 minute
        // Initialize Google Translate
        this.initializeGoogleTranslate();
    }
    
    /**
     * Clears the refresh interval when the component unmounts to prevent memory leaks.
     * @method
     */
    componentWillUnmount() {
        // Clear the interval when the component is unmounted to prevent memory leaks
        clearInterval(this.refreshInterval);
    }

     /**
     * Initializes the Google Translate element when it's not already initialized.
     * @method
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
     * @method
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }

    /**
     * Toggles the confirmation popup's visibility.
     * @method
     */
    toggleConfirmationPopup = () => {
        this.setState(prevState => ({ isConfirmationPopupOpen: !prevState.isConfirmationPopupOpen }));
    };

    /**
     * Fetches the details of a specific order.
     * @param {number} orderNumber - The order number.
     * @method
     * @returns {Promise} A Promise that resolves when the order details are fetched.
     */
    getOrderDetails = async (orderNumber) => {
        try {
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrderDetails/${orderNumber}`);
            const orderDetails = await response.json();
    
            // Merge orderDetails with existing order details
            const updatedOrders = this.state.orders.map(order => {
                if (order.order_number === orderNumber) {
                    return { ...order, orderDetails }; // Assuming orderDetails is an array
                }
                return order;
            });
    
            // Update state with the updated orders
            await new Promise(resolve => {
                this.setState(prevState => ({
                    orders: updatedOrders.map(order => ({
                        ...order,
                        orderDetails: order.orderDetails || [] // Ensure orderDetails is initialized
                    }))
                }), resolve);
            });

            this.state.orders.forEach(order => {
                order.orderDetails.forEach(detail => {
                    detail.customizations = [];
                });
            });
    
            // Fetch customizations for each order detail if customized is true
            const promises = orderDetails
                .filter(detail => detail.customized)
                .map(detail => this.getOrderCustomizations(detail.id));
            return Promise.all(promises);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    /**
     * Fetches the customizations for a specific order detail.
     * @param {number} orderDetailId - The order detail ID.
     * @method
     * @returns {Promise} A Promise that resolves when the customizations are fetched.
     */
    getOrderCustomizations = async (orderDetailId) => {
        console.log("hello");
        try {
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrderCustomizations/${orderDetailId}`);
            const customizations = await response.json();
    
            // Update orderDetails with customizations
            await new Promise(resolve => {
                this.setState(prevState => ({
                    orders: prevState.orders.map(order => ({
                        ...order,
                        orderDetails: order.orderDetails.map(detail => {
                            if (detail.id === orderDetailId) {
                                return { ...detail, customizations };
                            }
                            return detail;
                        })
                    }))
                }), resolve);
            });
    
            // Log everything after customizations
            console.log("Customizations applied for orderDetailId:", orderDetailId);
            console.log("Updated orders:", this.state.orders);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Sets a message in the component's state.
     * @param {string} message - The message to set.
     * @method
     */
    setMessage(message)
    {
        this.setState({message: message});
    }

   /**
     * Handles the completion of an order.
     * @param {number} order_number - The order number.
     * @method
     */
    handleComplete = (order_number) => {
        // Handle completion logic
        const order_status = 0; // Assuming 0 represents completed status

    // Prepare the request body
        const requestBody = {
            order_number: order_number,
            order_status: order_status
        };
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.text())
            .then(data => {
                this.callAPI();
                this.setMessage(`Order Number: ${order_number} has been successfully marked as complete.`);
                this.toggleConfirmationPopup();
                
            })
            .catch(err => console.error(err));

    };

    /**
     * Handles the cancellation of an order.
     * @param {number} order_number - The order number.
     * @method
     */
    handleCancel = (order_number) => {
        // Handle completion logic
        const order_status = -1; // Assuming 0 represents completed status

        // Prepare the request body
        const requestBody = {
            order_number: order_number,
            order_status: order_status
        };
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.text())
            .then(data => {
                this.callAPI();
                this.setMessage(`Order Number: ${order_number} has been successfully cancelled.`);
                this.toggleConfirmationPopup();
                
            })
            .catch(err => console.error(err));

    };

    
   
/**
     * Renders the table of current orders.
     * @returns {JSX.Element} The JSX element representing the table of orders.
     * @method
     */
    renderTable() {
        const { orders } = this.state;
    
        // Check if orders and their details are available
        const ordersReady = orders.every(order =>
            typeof order.orderDetails !== 'undefined' && // Check if orderDetails is defined
            order.orderDetails.length > 0 && 
            order.orderDetails.every(detail =>
                typeof detail.customizations !== 'undefined' && 
                (!detail.customized || (detail.customized && detail.customizations.length > 0))
            )
        );
        
    
        // Split orders into groups of three
        const rows = [];
        for (let i = 0; i < orders.length; i += 3) {
            rows.push(orders.slice(i, i + 3));
        }
    
        return (
            <div>
                {ordersReady && rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="order-row">
                        {row.map((order, index) => (
                            <div key={index} className="order-container">
                                <div className="order-details" style={{ border: "1px solid black", marginBottom: "20px", padding: "10px" }}>
                                    <h2>Order Number: {order.order_number}</h2>
                                    <h3>Date: {order.order_date.split('T')[0]}</h3>
                                    <h3>Time: {order.order_time}</h3>
                                    <h3>Notes: {order.notes ? order.notes : '-'}</h3>
                                    <div>
                                        {order.orderDetails.map((detail, idx) => (
                                           <div key={idx} style={{ border: "2px solid maroon", borderRadius: "5px", padding: "10px", marginBottom: "10px", textAlign: "left" }} className="order-detail">
                                                <h4>{detail.menu_item} - Quantity: {detail.quantity}</h4>
                                                <h5 style={{ marginLeft: "20px" }}>Customizations:</h5>
                                                {detail.customized ? (
                                                        <div>
                                                        <ul style={{marginLeft: "20px"}}>
                                                            {detail.customizations.map((customization, cIdx) => (
                                                                <li key={cIdx}>{customization.ingredient} - {customization.quantity_change}</li>
                                                            ))}
                                                        </ul>
                                                        </div>

                                                ) : (
                                                    <ul style={{marginLeft: "20px"}}><li>None</li></ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => this.handleComplete(order.order_number)}>Complete</button>
                                    <button onClick={() => this.handleCancel(order.order_number)}>Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
    /**
     * Renders the Kitchen component.
     * @returns {JSX.Element} The JSX element representing the Kitchen component.
     * @method
     */

    render() {
        // console.log(this.state.orders);
        const { orders } = this.state;

    // // Check if orders and their details are available
    // const ordersReady = orders.every(order => 
    //     order.orderDetails && 
    //     order.orderDetails.every(detail => 
    //         typeof detail.customizations !== 'undefined' && 
    //         (!detail.customized || (detail.customized && detail.customizations.length > 0))
    //     )
    // );
    
        return (
                <div className="OrderDisplay" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
                    <button id="refreshbutton" onClick={() => this.callAPI()}>Refresh</button>
                    <header className="Employee-header">
                        <h1 className="Employee-title">Kitchen</h1>
                    </header>
                    <div className="navigation-buttons">
                            {/* Navigation Buttons */}
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button>Inventory</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button >Employee List</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button  >Previous Orders</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button id = "selected">Kitchen</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                        </div>
                    <div>
                        <h2>Current Orders:</h2>
                        {this.renderTable()}
                    </div>

                    {this.state.isConfirmationPopupOpen && (
                <   ConfirmationPopup
                        onClose={this.toggleConfirmationPopup}
                        message={this.state.message}
                />
            )}
                    <div id="google_translate_element"></div>
                </div>
        );
    }
}

export default Kitchen;



