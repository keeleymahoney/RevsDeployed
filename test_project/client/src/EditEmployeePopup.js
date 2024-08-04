
// EditIngredientPopup.js

import { useState, useEffect } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

/**
 * Component for editing employee details in a popup.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the employee edit popup.
 * @param {Function} props.onSubmit - Callback function to submit the edited employee details.
 * @param {Object} props.employee - The employee object containing details to be edited.
 * @param {Function} props.onInputChange - Callback function to handle input changes.
 * @author Keeley Mahoney
 * @module EditEmployeePopup
 * @returns {JSX.Element} - The JSX element representing the EditEmployeePopup component.
 */
const EditEmployeePopup = ({ onClose, onSubmit, employee, onInputChange }) => {

    const [popupPosition, setPopupPosition] = useState({ top: 0});

    /**
     * Effect hook to calculate the initial popup position relative to the clicked button.
     * Adds event listener to capture the initial click event for positioning.
     */
    useEffect(() => {
        // Function to calculate the initial popup position relative to the clicked button
        const calculateInitialPosition = (e) => {
            // Calculate the X position in the middle of the page

            // Calculate the Y position of the clicked button relative to the viewport
            const top = window.scrollY
            // Set the popup position
            setPopupPosition({ top,});
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
     * Renders the EditEmployeePopup component.
     * @returns {JSX.Element} - The JSX element representing the EditEmployeePopup component.
     */
    return (
        <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
            <div className="popup-content-menu" style={{ top: popupPosition.top}}>
                <h2>Edit Employee</h2>
                <div className="category-price-container">
                <label>Employee ID:</label>
                <input type="text" value={employee.employee_id} disabled />
                </div>

                <div className="category-price-container">
                <label>Employee Name:</label>
                <input type="text" value={employee.employee_name} onChange={(e) => onInputChange(e, "employee_name")} />
                </div>

                <div className="category-price-container">
                <label>Password:</label>
                <input type="text" value={employee.pswd} onChange={(e) => onInputChange(e, "pswd")} />
                </div>

                <div className="category-price-container">
                <label>Manager Status:</label>
                <select value={employee.manager} onChange={(e) => onInputChange(e, "manager")}>
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

export default EditEmployeePopup