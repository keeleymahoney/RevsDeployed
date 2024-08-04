import React, { useState } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * Component for displaying the details of a specific order.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the order display popup.
 * @param {Object[]} props.order - The array of items included in the order.
 * @param {string} props.orderNumber - The number of the order being displayed.
 * @author Keeley Mahoney
 * @module DisplayOrder
 * @returns {JSX.Element} - The JSX element representing the DisplayOrder component.
 */
const DisplayOrder = ({ onClose, order, orderNumber }) => {
    /**
     * State representing the position of the popup.
     * @type {Object}
     * @property {number} popupPosition.top - The top position of the popup relative to the viewport.
     */
    const [popupPosition] = useState({ top: window.scrollY });

    console.log("This is the order");
    console.log(order);

    /**
     * Renders the DisplayOrder component.
     * @returns {JSX.Element} - The JSX element representing the DisplayOrder component.
     */
    return (
        <div className="popup-overlay">
            <div className="popup-content-menu" style={{ top: popupPosition.top, textAlign: "left" }}>
                <h1>Order Number: {orderNumber}</h1>
                {order.map((item, index) => (
                    <div key={index} style={{ border: "2px solid maroon", borderRadius: "5px", padding: "10px", marginBottom: "10px", textAlign: "left" }}>
                        <div className="category-price-container">
                            <h4>{item.menu_item} - Quantity: {item.quantity}</h4>
                        </div>
                        <div style={{ marginLeft: "40px" }}>
                            <p><strong>Customizations: </strong></p>
                            <ul>
                                {item.customized ? (
                                    item.customizations.map((customization, idx) => (
                                        <li key={idx}>{customization.ingredient} - {customization.quantity_change}</li>
                                    ))
                                ) : (
                                    <p>-</p>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
            </div>
            {/* Close button placed immediately after the last item */}
            
        </div>
    );
};

export default DisplayOrder;