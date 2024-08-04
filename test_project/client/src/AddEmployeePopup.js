
// EditIngredientPopup.js

import { useState, useEffect } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * Functional component for displaying a popup to add or edit employee information.
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the popup.
 * @param {Function} props.onSubmit - Callback function to submit changes.
 * @param {Object} props.employee - The employee object containing information.
 * @param {Function} props.onNewChange - Callback function to handle changes in employee information.
 * @author Keeley Mahoney
 * @module AddEmployeePopup
 * @returns {JSX.Element} - The JSX element representing the AddEmployeePopup component.
 */
const AddEmployeePopup = ({ onClose, onSubmit, employee, onNewChange }) => {
    const [popupPosition, setPopupPosition] = useState({ top: 0});

    useEffect(() => {
        // Function to calculate the initial popup position relative to the clicked button
       /**
         * Function to calculate the initial popup position relative to the clicked button.
         * @param {MouseEvent} e - The click event.
         * @returns {void}
         */
        const calculateInitialPosition = (e) => {
            // Calculate the X position in the middle of the page
            // Calculate the Y position of the clicked button relative to the viewport
            const top = window.scrollY
            // Set the popup position
            setPopupPosition({ top});
        };


        // Add event listener to capture the initial click event for positioning
        /**
         * Event handler for the initial click event to position the popup.
         * @param {MouseEvent} e - The click event.
         * @returns {void}
         */
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

    return (
        <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
            <div className="popup-content-menu" style={{ top: popupPosition.top}}>
                <h2>Add Employee</h2>

                <div className="category-price-container">
                <label>Employee Name:</label>
                <input type="text" value={employee.employee_name} onChange={(e) => onNewChange(e, "employee_name")} />
                </div>

                <div className="category-price-container">
                <label>Password:</label>
                <input type="text" value={employee.pswd} onChange={(e) => onNewChange(e, "pswd")} />
                </div>

                <div className="category-price-container">
                <label>Manager Status:</label>
                <select value={employee.manager} onChange={(e) => onNewChange(e, "manager")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>

                <button onClick={onSubmit}>Submit Changes</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddEmployeePopup