//neccesary imports
import React, { Component } from "react";
import "./AddIngredientPopUp.css"; // Import CSS file for styling

//class for the popup
/**
 * Class component for editing menu item details in a popup.
 * @component
 * @author Keeley Mahoney
 */
class EditMenuItemPopup extends Component {
    /**
     * Constructor for EditMenuItemPopup component.
     * @constructor
     * @param {Object} props - The props passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            selectedIngredient: "",
            imageLink: "", // Initialize selected ingredient state
            popupPosition: { top: 0}
        };
    }

    /**
     * Lifecycle method called after the component has been mounted.
     */
    componentDidMount() {
        // Set the initial state of imageLink to menuItem.picture
        const { menuItem } = this.props;
        this.setState({ imageLink: menuItem.picture });
        const{editPopupYLocation} = this.props;
        console.log("this is the pop up position: " + editPopupYLocation);
        this.setState({popupPosition: {top: editPopupYLocation}})
        
    }


    /**
     * Event handler for changing the image link.
     * @param {Object} event - The event object.
     */
    handleImageLinkChange = (event) => {
        const newImageLink = event.target.value;
        this.setState({ imageLink: newImageLink });
        this.props.onChange({ target: { value: newImageLink } }, "picture");
    };

    /**
     * Event handler for changing ingredient quantity.
     * @param {Object} event - The event object.
     * @param {string} ingredientName - The name of the ingredient.
     */
    handleIngredientChange = (event, ingredientName) => {
        const { onEditChange } = this.props;
        const { value } = event.target; // Get the new quantity
        console.log(value);
        onEditChange(ingredientName, value); // Call handleEditIngredient with the ingredient name and new quantity
    };

     /**
     * Event handler for changing the selected ingredient name.
     * @param {Object} event - The event object.
     */
    handleIngredientNameChange = (event) => {
        this.setState({ selectedIngredient: event.target.value });
    };
  
 /**
     * Event handler for adding an ingredient.
     */
    handleAddIngredient = () => {
        const { selectedIngredient } = this.state;
        if (selectedIngredient) {
            this.props.onAddIngredient(selectedIngredient, 1);
            this.setState({ selectedIngredient: "" }); // Clear selected ingredient after adding
        }
    };
    
    /**
     * Renders the EditMenuItemPopup component.
     * @returns {JSX.Element} - The JSX element representing the EditMenuItemPopup component.
     */
    render() {
        const { onClose, availableIngredients, onSubmitChanges, menuItem, onDeleteIngredient, onChange } = this.props;
        const categoryOptions = ["Entree", "Side", "Beverage", "Seasonal", "Dessert"];
        //html details. essentially has the label and the input for the text with buttons for close and for adding the ingredient
        const filteredIngredients = availableIngredients.filter(
            ingredient => ingredient.quantity > 0 && !menuItem.Ingredients.some(
                existingIngredient => existingIngredient.ingredient_name === ingredient.ingredient_name && existingIngredient.quantity > 0
            )
        );
        
        return (
            <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className="popup-content-menu" style={{ top: this.state.popupPosition.top}}>
                    <h2>{menuItem.item_name}</h2>
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
                    <input type="number"  min="0" step="0.01"  value={Math.max(0, menuItem.price)} onChange={(e) => onChange(e, "price")} />
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
                    <div className="ingredient-container">
                        <h3>Image Link:</h3>
                        <textarea value={this.state.imageLink} onChange={this.handleImageLinkChange}/>
                    </div>
                    <h3>Actual Image:</h3>
                    <img
                        id="menuItemImage"
                        src={this.state.imageLink}
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

export default EditMenuItemPopup;