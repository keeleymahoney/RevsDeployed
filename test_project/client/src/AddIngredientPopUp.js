
//neccesary imports
import React, { Component } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

//class for the popup
/**
 * Component for rendering a popup to add a new ingredient.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the popup.
 * @param {Function} props.onAddIngredient - Callback function to add a new ingredient.
 * @param {Object} props.newIngredient - Object representing the new ingredient.
 * @param {Function} props.onChange - Callback function to handle changes in input fields.
 * @author Keeley Mahoney
 * @returns {JSX.Element} - The JSX element representing the AddIngredientPopup component.
 */
class AddIngredientPopup extends Component {
    /**
     * Constructs a new AddIngredientPopup component.
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
     * Lifecycle method called after the component mounts.
     * Sets the initial position of the popup relative to the viewport.
     * @returns {void}
     */
    componentDidMount() {
        this.setState({popupPosition: {top: window.scrollY}})
    }

    /**
     * Lifecycle method called before the component unmounts.
     * Removes the event listener for opening the popup.
     * @returns {void}
     */
    componentWillUnmount() {
        document.removeEventListener("click", this.handleOpenPopup);
    }
    
    /**
     * Renders the AddIngredientPopup component.
     * @returns {JSX.Element} - The JSX element representing the AddIngredientPopup component.
     */
    render() {
        const { onClose, onAddIngredient, newIngredient, onChange } = this.props;
        

        //html details. essentially has the label and the input for the text with buttons for close and for adding the ingredient
        return (
            <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className="popup-content-menu" style={{ top: this.state.popupPosition.top}}>
                    <h2>Add New Ingredient</h2>
                    <div className="category-price-container">
                    <label>Ingredient Name:</label>
                    <input type="text" value={newIngredient.ingredient_name} onChange={(e) => onChange(e, "ingredient_name")} />
                    </div>

                    <div className="category-price-container">
                    <label>Quantity:</label>
                    <input type="number" min="0" step="1" value={Math.max(0, newIngredient.quantity)} onChange={(e) => onChange(e, "quantity")} />
                    </div>
                    
                    <div className="category-price-container">
                    <label>Minimum Quantity:</label>
                    <input type="number" min="0" step="1" value={Math.max(0, newIngredient.quantity_warning)} onChange={(e) => onChange(e, "quantity_warning")} />
                    </div>
                    
                    <div className="category-price-container">
                    <label>Storage Location:</label>
                    <input type="text" value={newIngredient.storage_location} onChange={(e) => onChange(e, "storage_location")} />
                    </div>
                    
                    <div className="category-price-container">
                    <label>Unit:</label>
                    <input type="text" value={newIngredient.unit} onChange={(e) => onChange(e, "unit")} />
                    </div>

                    <div className="category-price-container">
                    <label>Vegetarian:</label>
                    <select value={newIngredient.vegetarian} onChange={(e) => onChange(e, "vegetarian")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    </div>

                    <div className="category-price-container">
                    <label>Gluten Free:</label>
                    <select value={newIngredient.glutenfree} onChange={(e) => onChange(e, "glutenfree")}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                    </div>

                    <div className="category-price-container">
                        <label>Customizable:</label>
                        <select value={newIngredient.customizable} onChange={(e) => onChange(e, "customizable")}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                            </div>
                    <button onClick={onAddIngredient}>Add Ingredient</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default AddIngredientPopup;