//neccesary imports
import React, { Component } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

//class for the popup
/**
 * Component for rendering a popup to add or edit a menu item.
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.onClose - Callback function to close the popup.
 * @param {Function} props.onAddIngredient - Callback function to add an ingredient to the menu item.
 * @param {Object[]} props.availableIngredients - Array of available ingredients.
 * @param {Object} props.menuItem - Object representing the menu item.
 * @param {Function} props.onDeleteIngredient - Callback function to delete an ingredient from the menu item.
 * @param {Function} props.onChange - Callback function to handle changes in input fields.
 * @param {Function} props.onSubmitChanges - Callback function to submit changes made to the menu item.
 * @param {Function} props.onEditChange - Callback function to handle changes in ingredient quantity.
 * @author Keeley Mahoney
 * @returns {JSX.Element} - The JSX element representing the AddMenuItemPopup component.
 */
class AddMenuItemPopup extends Component {
    /**
     * Constructs a new AddMenuItemPopup component.
     * @constructor
     * @param {Object} props - The props passed to the component.
     */
    constructor(props) {
        super(props);
        /**
         * State representing the selected ingredient and image link for the menu item, and the popup position.
         * @type {Object}
         * @property {string} selectedIngredient - The name of the selected ingredient.
         * @property {string} imageLink - The image link for the menu item.
         * @property {Object} popupPosition - The position of the popup relative to the viewport.
         * @property {number} popupPosition.top - The top position of the popup relative to the viewport.
         */
        this.state = {
            selectedIngredient: "", // Initialize selected ingredient state
            imageLink: "",
            popupPosition: { top: window.scrollY}

        };
    }

    /**
     * Lifecycle method called after the component mounts.
     * Sets the initial state of imageLink to the menuItem.picture.
     * @returns {void}
     */
    componentDidMount() {
        // Set the initial state of imageLink to menuItem.picture
        const { menuItem } = this.props;
        this.setState({ imageLink: menuItem.picture });
    }

    /**
     * Handles the change in the image link input field.
     * Updates the state with the new image link and calls the onChange callback.
     * @param {Object} event - The event object.
     * @returns {void}
     */
    handleImageLinkChange = (event) => {
        const newImageLink = event.target.value;
        this.setState({ imageLink: newImageLink });
        this.props.onChange({ target: { value: newImageLink } }, "picture");
    };

    /**
     * Handles the change in an ingredient's quantity.
     * Calls the onEditChange callback to update the ingredient's quantity.
     * @param {Object} event - The event object.
     * @param {string} ingredientName - The name of the ingredient.
     * @returns {void}
     */
    handleIngredientChange = (event, ingredientName) => {
        const { onEditChange } = this.props;
        const { value } = event.target; // Get the new quantity
        console.log(value);
        onEditChange(ingredientName, value); // Call handleEditIngredient with the ingredient name and new quantity
    };

    /**
     * Handles the change in the selected ingredient.
     * Updates the state with the selected ingredient.
     * @param {Object} event - The event object.
     * @returns {void}
     */
    handleIngredientNameChange = (event) => {
        this.setState({ selectedIngredient: event.target.value });
    };
  

     /**
     * Handles the addition of an ingredient to the menu item.
     * Calls the onAddIngredient callback to add the selected ingredient to the menu item.
     * Clears the selected ingredient after adding.
     * @returns {void}
     */
    handleAddIngredient = () => {
        const { selectedIngredient } = this.state;
        if (selectedIngredient) {
            this.props.onAddIngredient(selectedIngredient, 1);
            this.setState({ selectedIngredient: "" }); // Clear selected ingredient after adding
        }
    };
    
     /**
     * Renders the AddMenuItemPopup component.
     * @returns {JSX.Element} - The JSX element representing the AddMenuItemPopup component.
     */
    render() {
        const { onClose, availableIngredients, onSubmitChanges, menuItem, onDeleteIngredient, onChange } = this.props;
        console.log("this is the menu item");
        console.log(menuItem.Ingredients);
        const categoryOptions = ["Entree", "Side", "Beverage", "Seasonal", "Dessert"];
        //html details. essentially has the label and the input for the text with buttons for close and for adding the ingredient
        const filteredIngredients = availableIngredients.filter(
            ingredient => ingredient.quantity > 0 && !menuItem.Ingredients.some(
                existingIngredient => existingIngredient.ingredient_name === ingredient.ingredient_name && existingIngredient.quantity > 0
            )
        );
        
        return (
            <div className="popup-overlay">
                <div className="popup-content-menu" style={{ top: `${this.state.popupPosition.top}px` }}>
                    <div className="category-price-container">
                    <h2>Menu Item Name: </h2>
                    <input type="text" value={menuItem.item_name} onChange={(e) => onChange(e, "item_name")} />
                    </div>
                    <div className="category-price-container">
                    <h3>Category:</h3>
                    <select value={menuItem.menu_category} onChange={(e) => onChange(e, "menu_category")}>
                        {categoryOptions.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div className="category-price-container">
                    <h3>Price:</h3>
                    <input type="number" min="0" step="0.01"  value={Math.max(0, menuItem.price)} onChange={(e) => onChange(e, "price")} />
                    </div>
                    <div className="category-price-container">
                        <h3>Description:</h3>
                        <textarea value={menuItem.descript} onChange={(e) => onChange(e, "descript")} />
                    </div>
                    <div className="category-price-container">
                        <h3>Vegetarian:</h3>
                        <p>{menuItem.vegetarian ? "Yes" : "No"}</p> {/* Conditional rendering for vegetarian */}
                    </div>
                    <div className="category-price-container">
                        <h3>Gluten-Free:</h3>
                        <p>{menuItem.glutenfree ? "Yes" : "No"}</p> {/* Conditional rendering for gluten-free */}
                    </div>
                    <div className="category-price-container">
                        <h3>Promoted in Menu Board:</h3>
                        <select value={menuItem.promoted} onChange={(e) => onChange(e, "promoted")}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    <div className="category-price-container">
                        <h3>Image Link:</h3>
                        <textarea value={this.state.imageLink} onChange={this.handleImageLinkChange}/>
                    </div>
                    <h3>Actual Image:</h3>
                    <img
                        src={this.state.imageLink}
                        id="menuItemImage"
                        alt={"Image for " + menuItem.item_name}
                        style={{ width: "100px", height: "100px" }}
                    />
                    <h3>Ingredients:</h3>
                    {menuItem.Ingredients
                        .filter(ingredient => ingredient.quantity > 0) // Filter out ingredients with quantity <= 0
                        .map((ingredient, index) => (
                            <div key={index} className="ingredient-container">
                                <label>{ingredient.ingredient_name}:</label>
                                <input
                                    className="input-label"
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) => this.handleIngredientChange(e, ingredient.ingredient_name)}
                                />
                                <button onClick={() => onDeleteIngredient(ingredient.ingredient_name)}>Delete</button>
                            </div>
                        ))
                    }
                    
                    <div className="add-ingredient-container">
                    <select value={this.state.selectedIngredient} onChange={this.handleIngredientNameChange}>
                        <option value="">Select Ingredient</option>
                        {filteredIngredients.map((ingredient, index) => (
                            <option key={index} value={ingredient.ingredient_name}>
                            {ingredient.ingredient_name}
                            </option>
                        ))}
                        </select>
                        <button onClick={this.handleAddIngredient}>Add Ingredient</button>
                    </div>
                    <button onClick={onSubmitChanges}>Submit Changes</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default AddMenuItemPopup;