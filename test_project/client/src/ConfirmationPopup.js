import { useState } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * Component for rendering a confirmation popup.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {string} props.message - The message to display in the confirmation popup.
 * @param {Function} props.onClose - Callback function to close the confirmation popup.
 * @module ConfirmationPopup
 * @returns {JSX.Element} - The JSX element representing the ConfirmationPopup component.
 */
const ConfirmationPopup = ({ message, onClose }) => {
    /**
     * State representing the position of the popup.
     * @type {Object}
     * @property {number} popupPosition.top - The top position of the popup relative to the viewport.
     */
    const [popupPosition] = useState({ top: window.scrollY});


    /**
     * Renders the ConfirmationPopup component.
     * @returns {JSX.Element} - The JSX element representing the ConfirmationPopup component.
     */
    return (
        <div className = "popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
            <div className="popup-content-menu" style={{ top: popupPosition.top}}>
                <h1>{message}</h1>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ConfirmationPopup;