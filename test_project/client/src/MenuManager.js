import React, { Component } from "react";
import "./App.css";
import EditMenuItemPopup from "./EditMenuItemPopup";
import AddMenuItemPopup from "./AddMenuItemPopup";
import ConfirmationPopup from "./ConfirmationPopup";



/**
 * Manages the menu items for a restaurant, allowing for addition, deletion, and modification of menu items and their ingredients.
 * @class
 * @extends Component
 */
class MenuManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
      categories: [],
      selectedCategory: "",
      isEditPopupOpen: false,
      isAddPopupOpen: false,
      message: "",
      selectedItem: {},
      availableIngredients: [],
      specificIngredients: [],
      origItem: {},
      isConfirmationPopupOpen: false,
      newItem: {
        item_name: "BLANK",
        price: "0.00",
        menu_category: "Entree",
        Ingredients: [],
        descript: "",
        vegetarian: true,
        glutenfree: true,
        promoted: false,
        picture: ""
      }
    };
  }

  /**
   * Fetches available ingredients from the API and updates the state.
   */
  fetchAvailableIngredients() {
    //fetches the current ingredients
    //
    fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI")
      .then(res => res.json())
        .then(res => {
            this.setState({ availableIngredients: res }); // Set apiResponse first
        
          })
      .catch(err => console.error(err));
  }


  /**
   * Fetches menu items from the API and updates the state.
   */
  fetchMenuItems() {
    fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI")
      .then(res => res.json())
      .then(data => {
        this.setState({ menuItems: data});

        // Extract unique categories
        const categories = [...new Set(data.map(item => item.menu_category))];
        this.setState({ categories });
      })
      .catch(err => console.error(err))
  }



  /**
   * Fetches the ingredients of a specific menu item from the API.
   * @param {string} menuItemName - Name of the menu item to fetch ingredients for.
   * @param {function} [callback=null] - Optional callback function to execute after fetching.
   */  
  fetchMenuItemIngredients(menuItemName, callback = null) {
    console.log(menuItemName);
    fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/ingredients/${menuItemName}`, { // Fixed URL template literal
    // fetch(`https:///localhost:9000/ingredients/${menuItemName}`, { // Fixed URL template literal

    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched menu item ingredients:', data);
        this.setState(prevState => ({
          selectedItem: {
            ...prevState.selectedItem,
            Ingredients: data
          },
          origItem: { ...prevState.selectedItem, Ingredients: data }
        }))
        // Access and use the updated selectedItem.Ingredients here
        if(!this.state.isEditPopupOpen)
        {
          this.toggleEditPopup();
        }
        
      })
      .catch(error => console.error('Error fetching ingredients:', error));
      
  }


  /**
   * Fetches existing ingredients for a menu item and updates the state.
   * @param {string} menuItemName - Name of the menu item.
   * @param {function} [callback=null] - Optional callback function to execute after fetching.
   */
  fetchMenuItemIngredientsExisting(menuItemName, callback = null) {
    console.log(menuItemName);
    fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/ingredients/${menuItemName}`, { // Fixed URL template literal
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched menu item ingredients:', data);
        this.setState({
          specificIngredients: data // Fixed syntax error
        });
      })
      .catch(error => console.error('Error fetching ingredients:', error));
      
  }


  /**
   * Deletes a menu item and its associated ingredients.
   * @param {string} menuItemName - Name of the menu item to delete.
   */
  handleItemDelete = (menuItemName) => {
    this.setState({ message: `Menu Item: ${menuItemName} has been successfully deleted.` });
    fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/ingredients/${menuItemName}`)
    .then(res => res.json())
    .then(data => {
        // Loop through the ingredients and call deleteIngredient for each
        data.forEach(ingredient => {
            fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/delete", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item_name: menuItemName, ingredient_name: ingredient.ingredient_name })
            })
            .then(res => res.text())
            .then(data => {
                console.log(data); // Log the response from the server
            })
            .catch(err => console.error(err));
        });
        // After deleting all ingredients, delete the menu item itself
        this.deleteMenuItem(menuItemName);
    })
    .catch(err => console.error(err));
};

    /**
     * Deletes a menu item from the API and updates the state.
     * @param {string} menuItemName - Name of the menu item to delete.
     */
    deleteMenuItem = (menuItemName) => {
      this.setState({ message: `Menu Item: ${menuItemName} has been successfully deleted.` });
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/delete", {
          method: "put",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ item_name: menuItemName })
      })
      .then(res => res.text())
      .then(data => {
          console.log(data); // Log the response from the server
          

          //update front end
          this.fetchMenuItems();
          this.toggleConfirmationPopup();
      })

      //catch error
      .catch(err => console.error(err));
      };


    


  componentDidMount() {
    this.fetchMenuItems();
    this.fetchAvailableIngredients();
    this.initializeGoogleTranslate();
}


/**
  * Initializes Google Translate script.
 */
initializeGoogleTranslate() {
    if (!window.googleTranslateElementInit) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
        window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
    }
}

/**
* Initializes Google Translate element.
*/
googleTranslateElementInit() {
    new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
}


  /**
   * Toggles the visibility of the edit popup.
   */
  toggleEditPopup = () => {
    this.setState(prevState => ({ isEditPopupOpen: !prevState.isEditPopupOpen }));
  };

  /**
   * Toggles the visibility of the add item popup.
   */
  toggleAddPopup = () => {
    this.setState(prevState => ({ isAddPopupOpen: !prevState.isAddPopupOpen }));
    this.setState({newItem: {
      item_name: "BLANK",
      price: "0.00",
      menu_category: "Entree",
      Ingredients: [],
      descript: "",
      picture: "",
      vegetarian: true,
      promoted: false,
      glutenfree: true
    }})
  };

   /**
   * Toggles the visibility of the confirmation popup.
   */
  toggleConfirmationPopup = () => {
    // Toggle confirmation popup
    this.setState(prevState => ({ isConfirmationPopupOpen: !prevState.isConfirmationPopupOpen }));
};

  /**
   * Opens the edit popup for a selected item.
   * @param {Object} item - The item to edit.
   */
  openEditPopup = (item) => {
    this.setState({ selectedItem: { ...item } });  // Set selected item first

    // Fetch ingredients and then update state with both selected item and ingredients
    this.fetchMenuItemIngredients(item.item_name);

    const popupYPosition = window.scrollY;

    // Pass the Y location to the EditMenuItemPopup component
    this.setState({ editPopupYLocation: popupYPosition });
  };

  /**
   * Opens the add item popup for adding a new item.
   * @param {Object} item - The new item to add.
   */
  openAddPopup = (item) => {
    this.setState({
      isAddPopupOpen: true,
      selectedItem: { ...item }
    }, () => {
      // After setting the selectedItem, fetch its ingredients
      this.fetchMenuItemIngredients(item.item_name);
    });
  };


  /**
   * Handles saving changes for a new menu item.
   */
  handleSaveChangesNew = () => {
    const { newItem, menuItems } = this.state;
    console.log(newItem);
    this.setState({ message: `Menu Item: ${newItem.item_name} has been successfully added.` });

    const requestBody = {
        price: newItem.price,
        menu_category: newItem.menu_category,
        item_name: newItem.item_name,
        descript: newItem.descript,
        promoted: newItem.promoted,
        picture: newItem.picture,
        vegetarian: newItem.vegetarian,
        glutenfree: newItem.glutenfree
    };

    console.log("these are the menu items");
    console.log(menuItems);

    const existingMenuItem = menuItems.find(
      menuItem => menuItem.item_name === newItem.item_name && parseFloat(menuItem.price) > 0
  );

  console.log(existingMenuItem);

  

  if (existingMenuItem) {
      alert("A menu item with the same name already exists with a positive price. Please choose a different name.");
      return;
  }
    // Check if the new item already exists in menuItems
    const existingItem = !!menuItems.find(item => item.item_name === newItem.item_name);
    console.log("this is existing item: " + existingItem);
    console.log(menuItems);

    if (existingItem) {
        // If the item already exists, update it instead of adding a new one
        // Send a PUT request to update the item in the database
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/edit", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
      })
      .then(res => res.text())
      .then(data => { 
          console.log(data); // Log the response from the server

          // Update the frontend after successful edit
          this.fetchMenuItems();

          // Loop through ingredients in selectedItem
          newItem.Ingredients.forEach(newIngredient => {
            const foundInOriginal = this.state.specificIngredients.some(
              origIngredient => origIngredient.ingredient_name === newIngredient.ingredient_name
            );

            if (!foundInOriginal) {
              // New ingredient, send a POST request to add it
              console.log(`Adding new ingredient ${newIngredient.ingredient_name} to ${newItem.item_name}`);
              fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  item_name: newItem.item_name,
                  ingredient_name: newIngredient.ingredient_name,
                  ingredient_quantity: newIngredient.quantity
                })
              })
              .then(res => res.text())
              .then(data => console.log(data)) // Log the response from the server
              .catch(err => console.error(err));
            } else {
              // Existing ingredient, send a PUT request to update quantity
              console.log(`Updating ingredient ${newIngredient.ingredient_name} quantity for ${newItem.item_name}`);
              fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/update", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  item_name: newItem.item_name,
                  ingredient_name: newIngredient.ingredient_name,
                  ingredient_quantity: newIngredient.quantity
                })
              })
              .then(res => res.text())
              .then(data => console.log(data)) // Log the response from the server
              .catch(err => console.error(err));
            }
          });

          // Toggle the popup after all saving logic is complete
          //this.fetchMenuItemIngredients();
            this.fetchMenuItems();
            this.toggleAddPopup();
            this.toggleConfirmationPopup();
        })
      .catch(err => console.error(err));
    } else {
        // If the item doesn't exist, add it as a new one
        // Send a POST request to add the new item in the database
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        .then(res => res.text())
        .then(data => { 
            console.log(data); // Log the response from the server

            // Update the frontend after successful addition
           

            // Loop through ingredients in newItem
            newItem.Ingredients.forEach(newIngredient => {
                fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        item_name: newItem.item_name,
                        ingredient_name: newIngredient.ingredient_name,
                        ingredient_quantity: newIngredient.quantity
                    })
                })
                .then(res => res.text())
                .then(data => console.log(data)) // Log the response from the server
                .catch(err => console.error(err));
            });
            this.fetchMenuItems();
            this.toggleAddPopup();
            this.toggleConfirmationPopup();
        })
        .catch(err => console.error(err));
        }
    };

  /**
   * Handles saving changes for an existing menu item.
   */
  handleSaveChanges = () => {
    console.log("inside of save changes");
    const { selectedItem } = this.state;
    const{origItem} = this.state;
    this.setState({ message: `Menu Item: ${this.state.selectedItem.item_name} has been successfully edited.` });

    const requestBody = {
      price: selectedItem.price,
      menu_category: selectedItem.menu_category,
      item_name: selectedItem.item_name,
      descript: selectedItem.descript,
      promoted: selectedItem.promoted,
      picture: selectedItem.picture,
      vegetarian: selectedItem.vegetarian,
      glutenfree: selectedItem.glutenfree
  };
  
    // Send a PUT request to update the item in the database
    fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/edit", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.text())
    .then(data => { 
        console.log(data); // Log the response from the server
  
        // Update the frontend after successful edit
        this.fetchMenuItems();
  
        // Loop through ingredients in selectedItem
        selectedItem.Ingredients.forEach(newIngredient => {
          const foundInOriginal = origItem.Ingredients.some(
            origIngredient => origIngredient.ingredient_name === newIngredient.ingredient_name
          );
  
          if (!foundInOriginal) {
            // New ingredient, send a POST request to add it
            console.log(`Adding new ingredient ${newIngredient.ingredient_name} to ${selectedItem.item_name}`);
            fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                item_name: selectedItem.item_name,
                ingredient_name: newIngredient.ingredient_name,
                ingredient_quantity: newIngredient.quantity
              })
            })
            .then(res => res.text())
            .then(data => console.log(data)) // Log the response from the server
            .catch(err => console.error(err));
          } else {
            // Existing ingredient, send a PUT request to update quantity
            console.log(`Updating ingredient ${newIngredient.ingredient_name} quantity for ${selectedItem.item_name}`);
            fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/update", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                item_name: selectedItem.item_name,
                ingredient_name: newIngredient.ingredient_name,
                ingredient_quantity: newIngredient.quantity
              })
            })
            .then(res => res.text())
            .then(data => console.log(data)) // Log the response from the server
            .catch(err => console.error(err));
          }
        });
  
        // Toggle the popup after all saving logic is complete
        //this.fetchMenuItemIngredients();
        this.fetchMenuItems();
        this.toggleEditPopup();
        this.toggleConfirmationPopup();
      })
    .catch(err => console.error(err));
  };

   /**
   * Updates the vegetarian and gluten-free status of the selected item based on its ingredients.
   */ 
updateVegetarianAndGlutenFreeSelected() {
  const { selectedItem, availableIngredients } = this.state;

  // Filter out ingredients with quantity > 0
  const ingredientsWithQuantity = selectedItem.Ingredients.filter(ingredient => ingredient.quantity > 0);

  // Check if any non-vegetarian or non-glutenfree ingredients exist
  const nonVegetarianIngredients = [];
  const nonGlutenFreeIngredients = [];

  ingredientsWithQuantity.forEach(ingredient => {
    const matchingIngredient = availableIngredients.find(item => item.ingredient_name === ingredient.ingredient_name);
    if (matchingIngredient) {
      if (!matchingIngredient.vegetarian) {
        nonVegetarianIngredients.push(matchingIngredient.ingredient_name);
      }
      if (!matchingIngredient.glutenfree) {
        nonGlutenFreeIngredients.push(matchingIngredient.ingredient_name);
      }
    }
  });

  // Log non-vegetarian and non-glutenfree ingredients
  console.log("Non-vegetarian ingredients:", nonVegetarianIngredients);
  console.log("Non-glutenfree ingredients:", nonGlutenFreeIngredients);

  // Update the vegetarian and glutenfree properties based on the presence of non-vegetarian or non-glutenfree ingredients
  this.setState(prevState => ({
    selectedItem: {
      ...prevState.selectedItem,
      vegetarian: !nonVegetarianIngredients.length,
      glutenfree: !nonGlutenFreeIngredients.length
    }
  }));
}
  /**
   * Updates the vegetarian and gluten-free status of the new item based on its ingredients.
   */
updateVegetarianAndGlutenFreeNew() {
  const { newItem, availableIngredients } = this.state;

  // Filter out ingredients with quantity > 0
  const ingredientsWithQuantity = newItem.Ingredients.filter(ingredient => ingredient.quantity > 0);

  // Check if any non-vegetarian or non-glutenfree ingredients exist
  const nonVegetarianIngredients = [];
  const nonGlutenFreeIngredients = [];

  ingredientsWithQuantity.forEach(ingredient => {
    const matchingIngredient = availableIngredients.find(item => item.ingredient_name === ingredient.ingredient_name);
    if (matchingIngredient) {
      if (!matchingIngredient.vegetarian) {
        nonVegetarianIngredients.push(matchingIngredient.ingredient_name);
      }
      if (!matchingIngredient.glutenfree) {
        nonGlutenFreeIngredients.push(matchingIngredient.ingredient_name);
      }
    }
  });

  // Log non-vegetarian and non-glutenfree ingredients
  console.log("Non-vegetarian ingredients:", nonVegetarianIngredients);
  console.log("Non-glutenfree ingredients:", nonGlutenFreeIngredients);

  // Update the vegetarian and glutenfree properties based on the presence of non-vegetarian or non-glutenfree ingredients
  this.setState(prevState => ({
    newItem: {
      ...prevState.newItem,
      vegetarian: !nonVegetarianIngredients.length,
      glutenfree: !nonGlutenFreeIngredients.length
    }
  }));
}

  /**
   * Handles adding a new ingredient to the selected item.
   * @param {string} ingredient_name - Name of the ingredient.
   * @param {number} quantity - Quantity of the ingredient.
   */
  handleAddIngredient = (ingredient_name, quantity) => {
    // Check if the ingredient already exists
    const existingIngredientIndex = this.state.selectedItem.Ingredients.findIndex(ingredient => ingredient.ingredient_name === ingredient_name);

    if (existingIngredientIndex === -1) {
        // If the ingredient doesn't exist, add it to the array
        this.setState(prevState => ({
            selectedItem: {
                ...prevState.selectedItem,
                Ingredients: [
                    ...prevState.selectedItem.Ingredients,
                    { ingredient_name: ingredient_name, quantity: quantity }
                ]
            }
          }), () => {
            // Update vegetarian and glutenfree properties based on the new ingredient
            this.updateVegetarianAndGlutenFreeSelected();
        });
    } else {
        // If the ingredient already exists, update its quantity
        this.setState(prevState => ({
            selectedItem: {
                ...prevState.selectedItem,
                Ingredients: prevState.selectedItem.Ingredients.map((ingredient, index) => {
                    if (index === existingIngredientIndex) {
                        return { ...ingredient, quantity: quantity };
                    }
                    return ingredient;
                })
            }
          }), () => {
            // Update vegetarian and glutenfree properties based on the new ingredient
            this.updateVegetarianAndGlutenFreeSelected();
        });
    }
};


  /**
   * Handles adding a new ingredient to the new item.
   * @param {string} ingredient_name - Name of the ingredient.
   * @param {number} quantity - Quantity of the ingredient.
   */
handleAddIngredientNew = (ingredient_name, quantity) => {
  // Check if the ingredient already exists
  
  const existingIngredientIndex = this.state.newItem.Ingredients.findIndex(ingredient => ingredient.ingredient_name === ingredient_name);

  console.log("this is the existnig index: " + existingIngredientIndex);
  if (existingIngredientIndex === -1) {
      // If the ingredient doesn't exist, add it to the array
      this.setState(prevState => ({
          newItem: {
              ...prevState.newItem,
              Ingredients: [
                  ...prevState.newItem.Ingredients,
                  { ingredient_name: ingredient_name, quantity: quantity }
              ]
          }
            }), () => {
              // Update vegetarian and glutenfree properties based on the new ingredient
              this.updateVegetarianAndGlutenFreeNew();
          });
  } else {
      // If the ingredient already exists, update its quantity
      this.setState(prevState => ({
          newItem: {
              ...prevState.newItem,
              Ingredients: prevState.newItem.Ingredients.map((ingredient, index) => {
                  if (index === existingIngredientIndex) {
                    console.log("does this print?");
                    console.log("this is the quantity: " + quantity);
                      return { ...ingredient, quantity: quantity };
                  }
                  return ingredient;
              })
          }
        }), () => {
          // Update vegetarian and glutenfree properties based on the new ingredient
          this.updateVegetarianAndGlutenFreeNew();
      });
      console.log("updated ingredients: ");
      console.log(this.state.newItem.Ingredients);
  }
};


  /**
   * Handles editing an ingredient of the selected item.
   * @param {string} ingredientName - Name of the ingredient to edit.
   * @param {number} newQuantity - New quantity for the ingredient.
   */
  handleEditIngredient = (ingredientName, newQuantity) => {
    const digitPattern = /^\d+$/;
    
  if (digitPattern.test(newQuantity)) {
  
    this.setState(prevState => ({
        selectedItem: {
            ...prevState.selectedItem,
            Ingredients: prevState.selectedItem.Ingredients.map(ingredient => {
                if (ingredient.ingredient_name === ingredientName) {
                    return { ...ingredient, quantity: newQuantity };
                }
                return ingredient;
            })
        }
    }), () => {
        console.log("Updated selectedItem ingredients:", this.state.selectedItem.Ingredients);
    });
  }
  else {
    // Display a warning message when the input contains invalid characters
    alert("Please enter a valid quantity containing only digits.");
}
};


  /**
   * Handles editing an ingredient of the new item.
   * @param {string} ingredientName - Name of the ingredient to edit.
   * @param {number} newQuantity - New quantity for the ingredient.
   */
handleEditIngredientNew = (ingredientName, newQuantity) => {
  const digitPattern = /^\d+$/;
      if (digitPattern.test(newQuantity)) {
      this.setState(prevState => ({
          newItem: {
              ...prevState.newItem,
              Ingredients: prevState.newItem.Ingredients.map(ingredient => {
                  if (ingredient.ingredient_name === ingredientName) {
                      return { ...ingredient, quantity: newQuantity };
                  }
                  return ingredient;
              })
          }
      }), () => {
          console.log("Updated selectedItem ingredients:", this.state.newItem.Ingredients);
      });
    }
    else {
      // Display a warning message when the input contains invalid characters
      alert("Please enter a valid quantity containing only digits.");
  }
};


  /**
   * Handles deleting an ingredient from the selected item.
   * @param {string} ingredientName - Name of the ingredient to delete.
   */
handleDeleteIngredient = (ingredientName) => {
  this.setState(prevState => ({
      selectedItem: {
          ...prevState.selectedItem,
          Ingredients: prevState.selectedItem.Ingredients.map(ingredient => {
              if (ingredient.ingredient_name === ingredientName) {
                  return { ...ingredient, quantity: -1 };
              }
              return ingredient;
          })
      }
  }), () => {
      // Update vegetarian and glutenfree properties based on the updated ingredients
      this.updateVegetarianAndGlutenFreeSelected();
  });
};

  /**
   * Handles deleting an ingredient from the new item.
   * @param {string} ingredientName - Name of the ingredient to delete.
   */
handleDeleteIngredientNew = (ingredientName) => {
  this.setState(prevState => ({
    newItem: {
      ...prevState.newItem,
      Ingredients: prevState.newItem.Ingredients.map(ingredient => {
        if (ingredient.ingredient_name === ingredientName) {
          return { ...ingredient, quantity: -1 };
        }
        return ingredient;
      })
    }
  }), () => {
    // Update vegetarian and glutenfree properties based on the updated ingredients
    this.updateVegetarianAndGlutenFreeNew();
  });
};


  /**
   * Handles changes to new item fields.
   * @param {Event} e - The event object.
   * @param {string} field - The field in the item object to update.
   */
handleNewChange = (e, field) => {
  const { newItem, menuItems } = this.state;
  const updatedItem = { ...newItem };

  // Update the corresponding field in the newItem object
  updatedItem[field] = e.target.value;

  
  this.setState({ newItem: updatedItem });

  
}
  

  /**
   * Handles changes to existing item fields.
   * @param {Event} e - The event object.
   * @param {string} field - The field in the item object to update.
   */
  handleExistingChange = (e, field) => {
    const { selectedItem } = this.state;
    const updatedItem = { ...selectedItem };

    // Update the corresponding field in the selectedItem object
    updatedItem[field] = e.target.value;
    console.log("for the menu item the cateogry is now " + e.target.value);

    // Update the state with the modified selectedItem
    this.setState({ selectedItem: updatedItem });
  };


   /**
   * Selects a category to filter the menu items.
   * @param {string} category - The category to select.
   */ 
  selectCategory = (category) => {
    this.setState({ selectedCategory: category });
  };


  /**
   * Renders category selection buttons.
   * @returns {JSX.Element} - The rendered buttons for category selection.
   */
  renderCategoryButtons = () => {
    const categories = ["Entree", "Side", "Dessert", "Seasonal", "Beverage"];
    return categories.map((category, index) => (
      <button
        key={index}
        id={category === this.state.selectedCategory ? "selected" : ""}
        onClick={() => this.selectCategory(category)}
      >
        {category}
      </button>
    ));
  };
  

   /**
   * Renders menu items filtered by the selected category.
   * @returns {JSX.Element} - The rendered grid of menu items.
   */ 
  renderMenuItems = () => {
    // Filtered items based on selected category
    const filteredItems = this.state.menuItems.filter(
      item => item.menu_category === this.state.selectedCategory && item.price > 0
    );
  
    // Sort the filtered items alphabetically by item name
    const sortedItems = filteredItems.sort((a, b) => {
      return a.item_name.localeCompare(b.item_name);
    });
  
    return (
      <div className="menu-items-grid">
        {sortedItems.map((item, index) => (
          <div key={index} className="menu-item">
            <p className="menu-item-name">{item.item_name} - ${item.price}</p>
            {/* <div className = "spacer"></div> */}
            <div className="button-container">
              <button onClick={(e) => this.openEditPopup(item)}>Edit</button>
              <button onClick={() => this.handleItemDelete(item.item_name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  /**
   * Renders the component.
   * @returns {JSX.Element} - The rendered component.
   */
  render() {
    const penTextSize = localStorage.getItem('textsize');
    document.documentElement.style.setProperty('--text-size', penTextSize);
    const penTextWeight = localStorage.getItem('boldtext');
    document.documentElement.style.setProperty('--bold-text', penTextWeight);
    return (
      <div className="App" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
        <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
        <button id = "refreshbutton" onClick={this.callAPI}>Refresh</button>
        <header>
          <h1>Menu Manager</h1>
          </header>
          <div className="navigation-buttons">
                            {/* Navigation Buttons */}
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button >Inventory</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button id = "selected">Edit Menu</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button >Employee List</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button >Previous Orders</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button >Kitchen</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                        </div>
       
        <button onClick={this.toggleAddPopup} style={{ marginRight: "10px" }}> 
          Add New Item </button>
  
        {/* Place the Add New Item button here, above or alongside category buttons */}
        <div className="container">
          <div className="category-container">
          {/* Render Category Selection Buttons */}
            {this.renderCategoryButtons()}
           
          </div>
  
        {/* Render Menu Items for Selected Category */}
          <div className="menu-items-container">
            {this.renderMenuItems()}
          </div>
        </div>

        <div>
        
        
        </div>
  
        {/* Conditionally Render the Add/Edit Item Popup */}
        {this.state.isEditPopupOpen && (
          <EditMenuItemPopup
            onClose={this.toggleEditPopup}
            menuItem={this.state.selectedItem}
            onSubmitChanges = {this.handleSaveChanges}
            onAddIngredient = {this.handleAddIngredient}
            onDeleteIngredient = {this.handleDeleteIngredient}
            availableIngredients = {this.state.availableIngredients}
            onChange = {this.handleExistingChange}
            onEditChange = {this.handleEditIngredient}
            editPopupYLocation = {this.state.editPopupYLocation}

          />
        )}

        {/* Conditionally Render the Add/Edit Item Popup */}
        {this.state.isAddPopupOpen && (
          <AddMenuItemPopup
            onClose={this.toggleAddPopup}
            menuItem={this.state.newItem}
            onSubmitChanges = {this.handleSaveChangesNew}
            onAddIngredient = {this.handleAddIngredientNew}
            onDeleteIngredient = {this.handleDeleteIngredientNew}
            availableIngredients = {this.state.availableIngredients}
            onChange = {this.handleNewChange}
            onEditChange = {this.handleEditIngredientNew}

          />
        )}
        {this.state.isConfirmationPopupOpen && (
                    <ConfirmationPopup
                        onClose={this.toggleConfirmationPopup}
                        message={this.state.message}
                    />
                )}
        <div id="google_translate_element"></div>
      </div>
    );
  }
}  

export default MenuManager;
