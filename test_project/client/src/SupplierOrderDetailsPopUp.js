import React, { Component } from "react";
import "./AddIngredientPopUp.css";;

/**
 * Class component for displaying supplier order details in a popup.
 * @component
 */
class SupplierOrderDetailsPopUp extends Component {
    /**
     * Constructor for SupplierOrderDetailsPopUp component.
     * @constructor
     * @param {Object} props - The props passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            popupPosition: { top: 0}
        };
    }

    /**
     * Lifecycle method called after the component has been mounted.
     */
    componentDidMount() {
        this.setState({popupPosition: {top: window.scrollY}})
        
    }

    /**
     * Renders the SupplierOrderDetailsPopUp component.
     * @returns {JSX.Element} - The JSX element representing the SupplierOrderDetailsPopUp component.
     */
    render() {
        const { onClose, order, orderNumber, orderTime, orderDate, supplierName } = this.props;

        const dateStr = orderDate;
        const dateObj = new Date(dateStr);

        // Format the date as "MM-DD-YYYY"
        const formattedDate = `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear()}`;

        const timeStr = orderTime;
        const timeParts = timeStr.split(":"); // Split the time string by ":"

        // Extract hours, minutes, and seconds
        const hours = parseInt(timeParts[0]); // Parse the hours part to an integer
        const minutes = parseInt(timeParts[1]); // Parse the minutes part to an integer
        const seconds = parseInt(timeParts[2].split(".")[0]); // Parse the seconds part to an integer

        // Format the time string
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        return (
            <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className="popup-content" style={{ top: this.state.popupPosition.top}}>
                    <h2>Supplier Order Details</h2>
                    <div className="category-price-container">
                    <h3>
                        Supplier Name: 
                    </h3>
                    <p>{supplierName}</p>
                    </div>
                    <div className="category-price-container">
                    <h3>Order Number: </h3><p>{orderNumber}</p>
                    </div>

                    <div className="category-price-container">
                    <h3>Order Date: </h3><p>{formattedDate}</p>
                    </div>

                    <div className="category-price-container">
                    <h3>Order Time: </h3><p>{formattedTime}</p>
                    </div>

                    <h3>Ingredients</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.map((ingredient, index) => (
                                <tr key={index}>
                                    <td>{ingredient.name}</td>
                                    <td>{ingredient.quantityOrdered}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Close button */}
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default SupplierOrderDetailsPopUp