
//neccesary imports
import React, { Component } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * @author Joanne Liu
 * Represents a popup component for displaying order completion details.
 */
class OrderCompletePopUp extends Component {

    /**
     * Renders the OrderCompletePopUp component.
     * 
     * @returns {JSX.Element} JSX representation of the popup.
     */
    render() {
        const { onClose, orderNumber, totalPrice } = this.props;
        const totalRoundedPrice = totalPrice.toFixed(2);

        //html details. essentially has the label and the input for the text with buttons for close and for adding the ingredient
        return (
            <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className="popup-content">
                    <h2>Order #{orderNumber} Placed!</h2>
                    <h2>Total was: ${totalRoundedPrice}</h2>
                    <h1>Enjoy!</h1>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default OrderCompletePopUp;