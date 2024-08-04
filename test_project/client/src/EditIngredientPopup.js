
// EditIngredientPopup.js
import { useState, useEffect } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * Component for editing ingredient details in a popup.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the ingredient edit popup.
 * @param {Function} props.onSubmit - Callback function to submit the edited ingredient details.
 * @param {Function} props.onDelete - Callback function to delete the ingredient.
 * @param {Object} props.ingredient - The ingredient object containing details to be edited.
 * @param {Function} props.onInputChange - Callback function to handle input changes.
 * @author Keeley Mahoney
 * @module EditIngredientPopup
 * @returns {JSX.Element} - The JSX element representing the EditIngredientPopup component.
 */
const EditIngredientPopup = ({ onClose, onSubmit, onDelete, ingredient, onInputChange }) => {

    /**
     * State representing the position of the popup.
     * @type {Object}
     * @property {number} popupPosition.top - The top position of the popup relative to the viewport.
     */
    const [popupPosition, setPopupPosition] = useState({ top: 0 });

    /**
     * Effect hook to calculate the initial popup position relative to the clicked button.
     * Adds event listener to capture the initial click event for positioning.
     */
    useEffect(() => {
        // Function to calculate the initial popup position relative to the clicked button
        const calculateInitialPosition = (e) => {
            // Calculate the X position in the middle of the page
            
            // Calculate the Y position of the clicked button relative to the viewport
            const top = window.scrollY;
            // Set the popup position
            setPopupPosition({ top});
        };


        // Add event listener to capture the initial click event for positioning
        const handleClick = (e) => {
            calculateInitialPosition(e);
            // Remove the event listener after the initial positioning
            document.removeEventListener("click", handleClick);
        };

        // Add event listener to the document to capture the initial click event
        document.addEventListener("click", handleClick);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []); 

    /**
     * Renders the EditIngredientPopup component.
     * @returns {JSX.Element} - The JSX element representing the EditIngredientPopup component.
     */
    return (
        <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
            <div className="popup-content-menu" style={{ top: window.scrollY}}>
            
                <h2>Edit Ingredient</h2>
                <div className="category-price-container">
                <label>Ingredient Name:</label>
                <input type="text" value={ingredient.ingredient_name} disabled />
                </div>

                <div className="category-price-container">
                <label>Quantity:</label>
                <input type="number" min="0" step="1" value={Math.max(0, ingredient.quantity)} onChange={(e) => onInputChange(e, "quantity")} />
                </div>

                <div className="category-price-container">
                <label>Minimum Quantity:</label>
                <input type="number" min="0" step="1" value={Math.max(0, ingredient.quantity_warning)} onChange={(e) => onInputChange(e, "quantity_warning")} />
                </div>

                <div className="category-price-container">
                <label>Unit:</label>
                <input type="text" value={ingredient.unit} onChange={(e) => onInputChange(e, "unit")} />
                </div>

                <div className="category-price-container">
                <label>Storage Location:</label>
                <input type="text" value={ingredient.storage_location} onChange={(e) => onInputChange(e, "storage_location")} />
                </div>

                <div className="category-price-container">
                <label>Vegetarian:</label>
                <select value={ingredient.vegetarian} onChange={(e) => onInputChange(e, "vegetarian")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    </div>
                
                <div className="category-price-container">
                <label>Gluten-Free::</label>
                <select value={ingredient.glutenfree} onChange={(e) => onInputChange(e, "glutenfree")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>

                <div className="category-price-container">
                <label>Customizable:</label>
                <select value={ingredient.customizable} onChange={(e) => onInputChange(e, "customizable")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    </div>

                <button onClick={onSubmit}>Submit Changes</button>
                <button onClick={onDelete}>Delete Ingredient</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EditIngredientPopup;