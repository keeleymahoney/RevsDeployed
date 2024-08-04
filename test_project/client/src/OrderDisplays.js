import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";
//import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
//import Ingredients from './Ingredients';
import DisplayOrder from "./DisplayOrder";


/**
 * Class representing the OrderDisplays component.
 * @extends Component
 * @author Keeley Mahoney
 */
class OrderDisplays extends Component {
    /**
     * Constructs a new OrderDisplays component.
     * @param {object} props - The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = { orders: [],
            isDisplayPopupOpen: false,
            specificOrder: [],
            orderNumber: 0,
            filteredOrders: [],
            filterBy: "",
            priceSortOrder: "",
            startDate: "",
            endDate: "",
            status: "",
            menuItems: [],
            orderNumberFilter: -1}
    }

    /**
     * Fetches orders from the API and updates the component's state.
     */
    callAPI() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrders")
            .then(res => res.json())
            .then(res => {
                // Update orders state with the sorted orders
                this.setState({ orders: res, filteredOrders: res });
            })
            .catch(err => console.error(err));
    }

    /**
     * Toggles the display of the order details popup.
     */
    toggleDisplayPopup = () => {
        this.setState(prevState => ({ isDisplayPopupOpen: !prevState.isDisplayPopupOpen }));
      };

      /**
     * Fetches order details for a specific order number from the API.
     * @param {number} orderNumber - The order number for which details are to be fetched.
     */
      async getOrderDetails(orderNumber) {
        try {
            this.setState({ orderNumber: orderNumber });
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrderDetails/${orderNumber}`);
            const specificOrder = await response.json();
    
            // Update state with specificOrder
            this.setState({ specificOrder });
    
            // Fetch customizations for each order detail if customized is true
            console.log("this is the specificOrder");
            console.log(specificOrder);
            for (const item of specificOrder) {
                if (item.customized) {
                    await this.getOrderCustomizations(item.id);
                }
            }
            console.log("this should be the final specificOrder");
            console.log(this.state.specificOrder);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
     /**
     * Fetches customizations for a specific order detail from the API.
     * @param {number} orderDetailId - The ID of the order detail for which customizations are to be fetched.
     */
    async getOrderCustomizations(orderDetailId) {
        try {
            console.log("does this print??");
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/customerOrderCustomizations/${orderDetailId}`);
            const customizations = await response.json();
    
            // Find the item in specificOrder that matches the order_detail_id
            const updatedSpecificOrder = this.state.specificOrder.map(item => {
                if (item.id === orderDetailId) {
                    // Update the item with customizations
                    return { ...item, customizations };
                }
                return item;
            });
    
            // Update specificOrder with the updated item
            this.setState({ specificOrder: updatedSpecificOrder }, () => {
                // This callback function will be executed after the state is updated
                console.log(this.state.specificOrder);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    //   getOrderDetails(order_number) {
    //     return new Promise((resolve, reject) => {
    //         this.setState({ orderNumber: order_number });
    //         fetch(`http://localhost:9000/customerOrdersAPI/customerOrderDetails/${order_number}`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 console.log("this is the res");
    //                 console.log(res);
    //                 this.setState({ specificOrder: res });
    //                 resolve(); // Resolve the promise when the data is set in state
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //                 reject(err); // Reject the promise if there's an error
    //             });
    //     });
    // }

    // getOrderCustomizations(order_detail_id) {
    //     return new Promise((resolve, reject) => {
    //         fetch(`http://localhost:9000/customerOrdersAPI/customerOrderCustomizations/${order_detail_id}`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 console.log("second res");
    //                 console.log(res);
    //                 // Find the item in specificOrder that matches the order_detail_id
    //                 const updatedSpecificOrder = this.state.specificOrder.map(item => {
    //                     if (item.id === order_detail_id) {
    //                         // Update the item with customizations
    //                         return { ...item, customizations: res };
    //                     }
    //                     return item;
    //                 });
    
    //                 // Update specificOrder with the updated item
    //                 this.setState({ specificOrder: updatedSpecificOrder });
    
    //                 resolve(); // Resolve the promise when the data is set in state
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //                 reject(err); // Reject the promise if there's an error
    //             });
    //     });
    // }

    /**
     * Handles the component's mounting and initializes required data.
     */
    componentDidMount() {
        this.callAPI();
        this.initializeGoogleTranslate();
    }

    /**
     * Initializes Google Translate API for language translation.
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
     * Initializes Google Translate element for language translation.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }


    /**
     * Opens the order details popup for a specific order.
     * @param {object} order - The order object for which details are to be displayed.
     */
    openDisplayPopup = async (order) => {
        try {
            // First, call getOrderDetails
            await this.getOrderDetails(order.order_number);
        
            
            // Finally, toggle the display of the popup
            this.toggleDisplayPopup();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Closes the order details popup.
     */
    closeDisplayPopup = () => {
        this.setState({ isDisplayPopupOpen: false, specificOrder: [] });
    }

     /**
     * Handles form submission for applying filters.
     */
    handleSubmit = () => {
        const { filterBy, priceSortOrder, menuItem, startDate, endDate, status, orders } = this.state;
        
        // Filter orders based on selected filters
        let filteredOrders = [...orders];
    
        if (filterBy === "Price" && priceSortOrder) {
            filteredOrders.sort((a, b) => {
                if (priceSortOrder === "High to Low") {
                    return b.total_cost - a.total_cost;
                } else if (priceSortOrder === "Low to High") {
                    return a.total_cost - b.total_cost;
                }
                return 0;
            });
        }
        
    
        if (filterBy === "Date" && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > new Date() || end > new Date()) {
                alert('Future dates are not allowed. Please select a valid date range.');
                return;
            } else if (start > end) {
                alert('Start date cannot be later than end date.');
                return;
            }
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate >= start && orderDate <= end;
            });
        }
    
        if (filterBy === "Status" && status) {
            if (status === "Completed") {
                filteredOrders = filteredOrders.filter(order => order.order_status === 0);
            } else if (status === "In Progress") {
                filteredOrders = filteredOrders.filter(order => order.order_status === 1);
            } else if (status === "Cancelled") {
                filteredOrders = filteredOrders.filter(order => order.order_status === -1);
            }
        }

        if (filterBy === "Order Number" && this.state.orderNumberFilter !== -1) {
            // Filter orders based on order number
            const orderNumber = parseInt(this.state.orderNumberFilter);
            const filteredOrder = filteredOrders.find(order => order.order_number === orderNumber);
            if (filteredOrder) {
                // If order found, update filteredOrders with it
                filteredOrders = [filteredOrder];
            } else {
                // If no order found, reset filteredOrders
                alert("No order was found with that number.")
                return;
            }
        }
    
        // Update state with filtered orders
        this.setState({ filteredOrders });
    }

    /**
     * Renders the table displaying orders.
     * @returns {JSX.Element} - The JSX element representing the table.
     */
    renderTable() {
        const { filteredOrders, filterBy } = this.state;
    let ordersToDisplay = [...filteredOrders];

        if(this.state.filterBy == "" || this.state.filterBy == "Date")
        {
            ordersToDisplay = filteredOrders.slice().sort((a, b) => {
                // Parse dates
                const dateA = new Date(a.order_date);
                const dateB = new Date(b.order_date);
        
                // If dates are the same, compare times
                if (dateA.getTime() === dateB.getTime()) {
                    const timeA = new Date(`1970-01-01T${a.order_time}`);
                    const timeB = new Date(`1970-01-01T${b.order_time}`);
                    return timeB - timeA; // Change here: Latest time is the most recent
                }
        
                // Otherwise, compare dates
                return dateB - dateA;
            });

        }

    ordersToDisplay = ordersToDisplay.slice(0, 1000);
        
        return (
            <div style={{ padding: '0 40px' }}>
                <table style={{ width: 'calc(100% - 40px)', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Order Number</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Date</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Time</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Total Cost</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Details</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Status</th>
                            <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersToDisplay.map((order, index) => (
                            <tr key={index} className="order-item">
                                <td style={{ border: '1px solid black' }}>{order.order_number}</td>
                                <td style={{ border: '1px solid black' }}>{this.formatDate(order.order_date)}</td>
                                <td style={{ border: '1px solid black' }}>{(order.order_time)}</td>
                                <td style={{ border: '1px solid black' }}>${parseFloat(order.total_cost).toFixed(2)}</td>
                                <td style={{ border: '1px solid black' }}>
                                <button onClick={() => this.openDisplayPopup(order)}>Click to View Details</button>
                                </td>
                                <td style={{ border: '1px solid black' }}>{this.getStatusText(order.order_status)}</td>
                                <td style={{ border: '1px solid black' }}>{order.notes ? order.notes : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
    /**
     * Returns the text representation of an order status.
     * @param {number} status - The status code of the order.
     * @returns {string} - The text representation of the order status.
     */
    getStatusText(status) {
        switch (status) {
            case null:
                return "Completed"
            case -1:
                return "Cancelled";
            case 0:
                return "Completed";
            case 1:
                return "In Progress";
            default:
                return "Unknown";
        }
    }

    /**
     * Formats a date string to a specific format.
     * @param {string} dateString - The date string to format.
     * @returns {string} - The formatted date string.
     */
    formatDate(dateString) {
        // Parse the input date string
        const orderDate = new Date(dateString);
        
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
        
        return formattedDate;
    }
    
/**
     * Renders the OrderDisplays component.
     * @returns {JSX.Element} - The JSX element representing the component.
     */
    render() {
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        const { filterBy, priceSortOrder, menuItem, startDate, endDate, status } = this.state;
    
        return (
            <div className="OrderDisplay" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
                <button id="refreshbutton" onClick={() => this.callAPI()}>Refresh</button>
                <header className="Employee-header">
                    <h1 className="Employee-title">Previous Orders</h1>
                </header>
                <div className="navigation-buttons">
                    {/* Navigation Buttons */}
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button>Inventory</button> </a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button> </a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button> </a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button >Employee List</button></a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button id = "selected" >Previous Orders</button></a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button >Kitchen</button></a>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                </div>
                <div>
                    <h2>Filters:</h2>
                    <div>
                        <label htmlFor="filterBy">Filter By:</label>
                        <select id="filterBy" value={filterBy} onChange={(e) => this.setState({ filterBy: e.target.value })}>
                            <option value="">Select Filter</option>
                            <option value="Price">Price</option>
                            <option value="Date">Date</option>
                            <option value="Status">Status</option>
                            <option value="Order Number">Order Number</option> {/* Add new option */}
                        </select>
                    </div>
                    {filterBy === "Price" && (
                        <div>
                            <label htmlFor="priceSortOrder">Price Sort Order:</label>
                            <select id="priceSortOrder" value={priceSortOrder} onChange={(e) => this.setState({ priceSortOrder: e.target.value })}>
                                <option value="">Select Sort Order</option>
                                <option value="High to Low">High to Low</option>
                                <option value="Low to High">Low to High</option>
                            </select>
                        </div>
                    )}
                   
                    {filterBy === "Date" && (
                        <div>
                            <label htmlFor="startDate">Start Date:</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => this.setState({ startDate: e.target.value })} />
                            <label htmlFor="endDate">End Date:</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => this.setState({ endDate: e.target.value })} />
                        </div>
                    )}
                    {filterBy === "Status" && (
                        <div>
                            <label htmlFor="status">Status:</label>
                            <select id="status" value={status} onChange={(e) => this.setState({ status: e.target.value })}>
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}

                        {filterBy === "Order Number" && (
                                                    <div>
                                                        <label htmlFor="orderNumberFilter">Order Number:</label>
                                                        <input
                                                            id="orderNumberFilter"
                                                            type="number" // Change input type to "number"
                                                            value={this.state.orderNumberFilter}
                                                            onChange={(e) => this.setState({orderNumberFilter: parseInt(e.target.value, 10) })}
                                                        />
                                                    </div>
                                                )}

                    

                    
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
                {this.renderTable()}
                {this.state.isDisplayPopupOpen && (
                    <DisplayOrder
                        onClose={this.closeDisplayPopup}
                        order={this.state.specificOrder}
                        orderNumber = {this.state.orderNumber}
                    />
                )}
                <div id="google_translate_element"></div>
            </div>
        );
    }
}

export default OrderDisplays;
