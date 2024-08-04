import React, { Component } from "react";
import "./AddIngredientPopUp.css";

/**
 * Class component for a form to create a new supplier order.
 * @component
 */
class NewSupplierOrderForm extends Component {
    /**
     * Constructor for NewSupplierOrderForm component.
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
     * Lifecycle method called after the component has been mounted.
     */
    componentDidMount() {
        this.setState({popupPosition: {top: window.scrollY}})
        
    }

    /**
     * Event handler for adding an ingredient to the order.
     */
    handleAddIngredient = () => {
        const { selectedIngredient } = this.props;
        if (selectedIngredient) {
            const ingredient = {
                name: selectedIngredient,
                quantityOrdered: 0,
                quantityReceived: 0,
                wholesalePrice: 0.5
            };
            this.props.addIngredientToOrder(ingredient);
        }
    };

    /**
     * Event handler for submitting the order.
     */
    handleSubmitOrder = () => {
        // Get today's date
        const today = new Date();

        // Format the date as MM-DD-YYYY
        const orderDate = today.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        
        // Format the time as HH:MM:SS
        const orderTime = today.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    
        // Submit the order
        this.props.submitOrder(orderTime, orderDate);
        // Close the form
        this.props.onClose();
    };

    /**
     * Renders the list of added ingredients.
     * @returns {JSX.Element} - The JSX element representing the table of added ingredients.
     */
    renderAddedIngredients() {
        const { currentOrderIngredients, handleQuantityChange, handleDeleteIngredient } = this.props;

    
        return (
            <table>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Quantity Ordered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrderIngredients.map(ingredient => (
                        <tr key={ingredient.name}>
                            <td>{ingredient.name}</td>
                            <td>
                                <input
                                    type="number"
                                    value={ingredient.quantityOrdered}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(ingredient.name, e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleDeleteIngredient(ingredient.name)}>X</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    /**
     * Renders the NewSupplierOrderForm component.
     * @returns {JSX.Element} - The JSX element representing the NewSupplierOrderForm component.
     */
    render() {
        const { onClose, ingredientsAvail, currentOrderIngredients, selectedIngredient, handleIngredientChange, supplierName, orderNumber, handleSupplierNameChange, handleOrderNumberChange } = this.props;
    
        // Filter out ingredients available that are not in the current order
        const availableIngredients = ingredientsAvail.filter(ingredient => (
            !currentOrderIngredients.some(orderIngredient => orderIngredient.ingredient_name === ingredient.ingredient_name)
        ));
    
        return (
            <div className="popup-overlay" /*style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}*/>
                <div className="popup-content" style={{ top: this.state.popupPosition.top}}>
                    <h2>New Supplier Order</h2>
                    <div className="category-price-container">
                    <h3>Supplier Name: </h3>
                <input
                        type="text"
                        value={supplierName}
                        onChange={handleSupplierNameChange}
                        placeholder="Supplier Name"
                    />
                    </div>
                    {/* Order number input */}
                    <div className="category-price-container">
                    <h3>Order Number: </h3>
                    <input
                        type="number"
                        value={orderNumber}
                        onChange={handleOrderNumberChange}
                    />
                    </div>

                    <div className="low-quantity-warning">
                    <h3 style={{ color: 'red' }}>Ingredients with Low Quanties:</h3>
                    {ingredientsAvail.filter(ingredient => ingredient.quantity < ingredient.quantity_warning).map((ingredient, index) => (
                        <p key={index}>
                            <strong>Name:</strong> {ingredient.ingredient_name} &nbsp;   
                            <strong>   Quantity:</strong> {ingredient.quantity}&nbsp;
                            <strong>   Min-Quantity:  </strong> {ingredient.quantity_warning}
                        </p>
                    ))}
                </div>
                    {/* Ingredient selection */}
                    <h3>Ingredients</h3>
                    {this.renderAddedIngredients()}
                    <div className="add-ingredient-container">
                    <select onChange={handleIngredientChange} value={selectedIngredient}>
                        <option value="">Select an Ingredient</option>
                        {availableIngredients.map((ingredient, index) => (
                            <option key={index} value={ingredient.ingredient_name}>
                                {ingredient.ingredient_name}
                            </option>
                        ))}
                    </select>
                    {/* Submit button */}
                    <button onClick={this.handleAddIngredient}>Add Ingredient to Order</button>
                    </div>
                    <button onClick={this.handleSubmitOrder}>Submit Order</button>
                    {/* Close button */}
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default NewSupplierOrderForm;