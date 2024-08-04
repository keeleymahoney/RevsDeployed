// MenuItemPopUp.js
import React, { Component } from "react";
import "./MenuItemPopUp.css";

/**
 * @author Joanne Liu
 * Represents a pop-up window for displaying menu item details and ingredient selection for menu item selected on order screen.
 */
class MenuItemPopUp extends Component {
     /**
     * Creates an instance of MenuItemPopUp.
     * @param {object} props - The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            errorQuantity: false,
            selectedIngredients: {}, // Track selected ingredients
            groupedIngredients: {}
        };
    }

     /**
     * Lifecycle method invoked immediately after the component is mounted.
     * Starts autoplay for the slideshow.
     */
    componentDidMount() {
        this.getGroupedIngredients();
    }


    /**
     * Lifecycle method invoked immediately after updating occurs.
     * Updates the grouped ingredients if the menu item changes.
     * @param {object} prevProps - The previous properties of the component.
     */
    componentDidUpdate(prevProps) {
        if (prevProps.menuItem !== this.props.menuItem) {
            this.getGroupedIngredients();
            // this.copyMenuItem();
        }
    }

     /**
     * Handles the change in quantity of a specific ingredient.
     * @param {string} name - The name of the ingredient.
     * @param {string} action - The action to perform ('increase' or 'decrease').
     */
    handleQuantityChange(name, action) {
        const { menuItem, update } = this.props;
        const updatedMenuItem = { ...menuItem };
        this.setState({errorQuantity: false});
        // switch (type) {
        //     case 'increase':
        //         updatedMenuItem.ingredients[key].quantity++;
        //         break;
        //     case 'decrease':
        //         if (updatedMenuItem.ingredients[key].quantity > 0) {
        //             updatedMenuItem.ingredients[key].quantity--;
        //         } else {
        //             this.setState({errorQuantity: true});
        //         }
        //         break;
        //     default:
        //         break;
        // }

        const updatedIngredients = updatedMenuItem.ingredients.map(ing => {
            if (ing.name === name) {
                // Update the quantity based on the action
                if (action === 'increase') {
                    return { ...ing, quantity: ing.quantity + 1 };
                } else if (action === 'decrease') {
                    if(ing.quantity === 0) {
                        this.setState({ errorQuantity: true });
                        return ing;
                    }
                    return { ...ing, quantity: ing.quantity - 1 }; // Ensure quantity doesn't go below 0
                }
            }
            return ing; // Return the original item if it doesn't match the name
        });

        updatedMenuItem.ingredients = updatedIngredients;

        console.log("quantity change: ", updatedMenuItem);
        update(updatedMenuItem);
    }

    /**
     * Handles the change in quantity of ingredients based on type.
     * @param {string} type - The type of ingredient.
     * @param {string} action - The action to perform ('increase' or 'decrease').
     */
    handleTypeQuantityChange(type, action) {
        const { menuItem, update } = this.props;
        const updatedMenuItem = { ...menuItem };
        // const {groupedIngredients} = this.state;
        this.setState({ errorQuantity: false });

        const ingredientName = this.findSelected(type);

        const updatedIngredients = updatedMenuItem.ingredients.map(ing => {
            if (ing.name === ingredientName) {
                // Update the quantity based on the action
                if (action === 'increase') {
                    return { ...ing, quantity: ing.quantity + 1 };
                } else if (action === 'decrease') {
                    if(ing.quantity === 0) {
                        this.setState({ errorQuantity: true });
                        return ing;
                    }
                    return { ...ing, quantity: ing.quantity - 1 }; // Ensure quantity doesn't go below 0
                }
            }
            return ing; // Return the original item if it doesn't match the name
        });
        updatedMenuItem.ingredients = updatedIngredients;

        update(updatedMenuItem);
    }

     /**
     * Handles the change of selected ingredient within a group.
     * @param {string} group - The group of ingredients.
     * @param {number} index - The index of the selected ingredient.
     */
    handleTypeChange = (group, index) => {
        const updatedIngredients = { ...this.state.groupedIngredients };
        const { menuItem, update } = this.props;
        updatedIngredients[group].forEach((ingredient, i) => {
          if (i === index) {
            ingredient.isSelected = true; // Set the clicked ingredient to selected
          } else {
            ingredient.isSelected = false; // Set all other ingredients to not selected
          }
        });

        const updatedMenuItem = { ...menuItem };
        updatedMenuItem.ingredients.forEach(ingredient => {
            updatedIngredients[group].forEach(updatedIng => {
                if (ingredient.name === updatedIng.name) {
                    if (updatedIng.isSelected) {
                        ingredient.quantity = updatedIng.defaultQuantity;
                    } else {
                        ingredient.quantity = 0;
                    }
                }
            });
        });
    
        this.setState({ groupedIngredients: updatedIngredients });
        update(updatedMenuItem);
    };

     /**
     * Retrieves and groups ingredients based on type.
     */
    getGroupedIngredients() {
        const { menuItem, ingredientData} = this.props;

        console.log("in grouped: ", menuItem);
    
        const newGroupedIngredients = menuItem.ingredients
            .filter(ingredient => ingredient.quantity >= 0)
            .filter(ingredient => ingredientData[ingredient.name].custom)
            .filter(ingredient => ingredient.name.includes(" - "))
            .reduce((acc, ingredient) => {
                const [type] = ingredient.name.split(" - ");
                if (!acc[type]) {
                    acc[type] = [];
                }
    
                // Find the first non-zero quantity ingredient within the same type
                const selectedItem = menuItem.ingredients.find(item => item.name.startsWith(type) && item.quantity > 0);
                const defaultQuantity = selectedItem ? selectedItem.quantity : 0;
    
                // Add a property to indicate if the ingredient is selected
                const isSelected = ingredient.quantity > 0;
    
                acc[type].push({ name: ingredient.name, isSelected, defaultQuantity });
    
                return acc;
            }, {});
    
        this.setState({ groupedIngredients: newGroupedIngredients }); 
    }

    /**
     * Finds the quantity of an ingredient by name.
     * @param {string} name - The name of the ingredient.
     * @returns {number} The quantity of the ingredient.
     */
    findQuantityByName(name) {
        const { menuItem } = this.props;
        const { ingredients } = menuItem;
    
        // Find the ingredient with the given name
        const ingredient = ingredients.find(ing => ing.name === name);
    
        // Return the quantity if the ingredient is found, otherwise return 0
        return ingredient ? ingredient.quantity : 0;
    }

    /**
     * Finds the selected ingredient within a group.
     * @param {string} type - The type of ingredient.
     * @returns {string} The name of the selected ingredient.
     */
    findSelected(type) {
        const { groupedIngredients } = this.state;
        const selectedIngredient = groupedIngredients[type].find(ing => ing.isSelected);
        const ingredientName = selectedIngredient ? selectedIngredient.name : '';
        return ingredientName;
    }

     /**
     * Renders the MenuItemPopUp component.
     * @returns {JSX.Element} The JSX representation of the component.
     */
    render() {
        const { onAdd, onRemove, menuItem, menuItemData, ingredientData} = this.props;
        const { errorQuantity, groupedIngredients} = this.state;

        return (
            <div className = "popup-window" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className = "info-row">
                    <img
                        id="menuItemImage"
                        src={menuItemData.picture}
                        alt={"Image for " + menuItem.item}
                    />
                    <h2>{menuItem.item}</h2>
                    <p>{menuItemData.descript}</p>
                    <p> Vegetarian: {menuItemData.veg ? 'Yes' : 'No'} </p>
                    <p> Gluten Free: {menuItemData.gf ? 'Yes' : 'No'} </p>
                </div>
                <div className = "ing-list-row">
                    <p>
                        <strong>Ingredients:</strong>{' '}
                        {menuItem.ingredients
                            .filter(ingredient => ingredientData[ingredient.name].location !== "Storage")
                            .filter(ingredient => ingredient.quantity > 0)
                            .map((ingredient, index, array) => (
                                <span key={index}>{ingredient.name}{index !== array.length - 1 ? ', ' : ''} </span>
                            ))
                        }
                    </p>
                </div>
                {menuItem.ingredients
                    .filter(ingredient => ingredient.quantity >= 0)
                    .filter(ingredient  => ingredientData[ingredient.name].custom)
                    .filter(ingredient => !ingredient.name.includes(" - "))
                    // .filter(ingredient => ingredientData[ingredient.name].location !== "Storage")
                    .map((ingredient, index) => (
                        <div key={index} className = "ing-row">
                            {/* <label>{ingredient.quantity} {ingredient.name}</label> */}
                            <p>{ingredient.quantity}</p>
                            <div style={{ width: '20px' }}></div>
                            <button className="quantity-button" onClick={() => this.handleQuantityChange(ingredient.name, 'increase')}>+</button>
                            <button className="quantity-button" onClick={() => this.handleQuantityChange(ingredient.name, 'decrease')}>-</button>
                            <div style={{ width: '30px' }}></div>
                            <p>{ingredient.name}</p>
                            <div style={{ width: '100px' }}></div>
                        </div>
                ))}
                {Object.keys(groupedIngredients).map((key) => (
                    <div key={key} className="grouped-ing-row">
                        <p>{this.findQuantityByName(this.findSelected(key))}</p>
                        <div style={{ width: '20px' }}></div>
                        <button className="quantity-button" onClick={() => this.handleTypeQuantityChange(key, 'increase')}>+</button>
                        <button className="quantity-button" onClick={() => this.handleTypeQuantityChange(key, 'decrease')}>-</button>
                        <div style={{ width: '30px' }}></div>
                        <p>{key}</p>
                        <div style={{ width: '30px' }}></div>
                        {groupedIngredients[key].map((ingredient, index) => (
                        <button
                            key={index}
                            onClick={() => this.handleTypeChange(key, index)}
                            className={ingredient.isSelected ? "grouped-ing-selected-button" : "grouped-ing-button"}
                        >
                            {ingredient.name.slice(ingredient.name.indexOf(" - ") + 3)} 
                        </button>
                        ))}
                    </div>
                ))}
                <div className = "error-message">
                    {errorQuantity && <h3>Quantity already 0!</h3>}
                </div>
                <div className="exit-button-container">
                    <button onClick={() => onRemove(menuItem.item)}>Cancel</button>
                    <button onClick={() => onAdd(menuItem)}>Add</button>
                </div>
            </div>
        );
    }
}

export default MenuItemPopUp;
