import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";
//import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
//import Ingredients from './Ingredients';
import EditEmployeePopup from "./EditEmployeePopup";
import AddEmployeePopup from "./AddEmployeePopup";
import ConfirmationPopup from "./ConfirmationPopup";

/**
 * Component for managing employee data.
 * @author Keeley Mahoney
 */
class Employees extends Component {
    /**
     * Constructor for Employees component.
     * @constructor
     * @param {Object} props - The component props
     */
    constructor(props) {
        super(props);
        this.state = { employees: [],
            isEditPopupOpen: false,
            isConfirmationPopupOpen: false,
            isAddPopupOpen: false,
            editedEmployee: [],
        newEmployee:  {
            employee_id: -1,
            manager: false,
            employee_name: "",
            pswd: "0000"
        },
        message: ""
         };
    }

    /**
 * Fetches employee data from the API and updates the state.
 * @function callAPI
 * @memberof Employees
 */
    callAPI() {
        console.log("hello");
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/employeesAPI")
            .then(res => res.json())
            .then(res => this.setState({ employees: res }))
            .catch(err => err);
    }

    /**
     * Calls the API to fetch employee data when the component mounts.
     */
    componentDidMount() {
        this.callAPI();
        this.initializeGoogleTranslate();
    }
    
    /**
     * Initializes Google Translate if not already initialized.
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
     * Opens the edit employee popup with the selected employee data.
     * @param {Object} employee - The employee object to be edited
     */
    openEditPopup(employee)
    {
        this.setState({editedEmployee: employee, isEditPopupOpen: true});
    }

    /**
     * Opens the add employee popup.
     */
    openAddPopup()
    {
        this.setState({isAddPopupOpen: true});
    }

     /**
     * Toggles the visibility of the confirmation popup.
     */
    toggleConfirmationPopup = () => {
        // Toggle confirmation popup
        this.setState(prevState => ({ isConfirmationPopupOpen: !prevState.isConfirmationPopupOpen }));
    };

    /**
     * Closes the edit employee popup.
     */
    closeEditPopup = () => {
        this.setState({ isEditPopupOpen: false, editedEmployee: null });
    }

    /**
     * Closes the add employee popup.
     */
    closeAddPopup = () => {
        this.setState({ isAddPopupOpen: false, newEmployee:  {
            employee_id: -1,
            manager: false,
            employee_name: "",
            pswd: "0000"
        } });
    }

    /**
     * Handles input change for existing employee in the edit employee popup.
     * @param {Event} e - The input change event
     * @param {string} key - The key of the input field being changed
     */
    handleExistingInputChange = (e, key) => {
        const { editedEmployee } = this.state;

        //shallow copy, and gets new ingredient
        this.setState({
            editedEmployee: {
                ...editedEmployee,
                [key]: e.target.value
            }
        });
    };

    /**
     * Handles input change for adding a new employee.
     * @param {Event} e - The input change event
     * @param {string} key - The key of the input field being changed
     */
    handleNewInputChange = (e, key) => {
        const { newEmployee } = this.state;

        //shallow copy, and gets new ingredient
        this.setState({
            newEmployee: {
                ...newEmployee,
                [key]: e.target.value
            }
        });
    };

     /**
     * Handles submission of new employee data.
     */
    handleNewSubmit = () => {
        const { newEmployee } = this.state;

        console.log(newEmployee);
        this.setState({ message: `Employee: ${this.state.newEmployee.employee_name} has been added as an employee.` });

        //calls the updateIngredients() function in the backend
        //
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/employeesAPI/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEmployee)
        })
        .then(res => res.text())
        .then(data => {
            //console.log(data); // Log the response from the server
            

            //update front end
            this.callAPI();
            this.closeAddPopup();
            this.toggleConfirmationPopup();
        })

        //catch any errors
        .catch(err => console.error(err));
    };

    /**
     * Handles submission of edited employee data.
     */
    handleSubmit = () => {
        const { editedEmployee } = this.state;

        console.log(editedEmployee);
        this.setState({ message: `Employee: ${this.state.editedEmployee.employee_name} has been successfully edited.` });

        //calls the updateIngredients() function in the backend
        //
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/employeesAPI/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedEmployee)
        })
        .then(res => res.text())
        .then(data => {
            //console.log(data); // Log the response from the server
            

            //update front end
            this.callAPI();
            this.closeEditPopup();
            this.toggleConfirmationPopup();
        })

        //catch any errors
        .catch(err => console.error(err));
    };

     /**
     * Handles deletion of an employee.
     * @param {Object} employee - The employee object to be deleted
     */
    handleEmployeeDelete = (employee) => {
        this.setState({ message: `Employee: ${employee.employee_name} has been successfully deleted.` });
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/employeesAPI/delete", {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ employee_id: employee.employee_id })
        })
        .then(res => res.text())
        .then(data => {
            //console.log(data); // Log the response from the server
            

            //update front end
            this.callAPI();
            this.toggleConfirmationPopup();
        })

        //catch error
        .catch(err => console.error(err));
    };


    /**
     * Renders the employee table.
     * @returns {JSX.Element} Employee table JSX
     */
    renderTable() {
        const { employees } = this.state;
        // Sort employees by employee_id
        const sortedEmployees = employees.slice().sort((a, b) => a.employee_id - b.employee_id);
    
        return (
            <div className="menu-items-grid">
                {sortedEmployees.map((item, index) => (
                    <div key={index} className="menu-item">
                        <div className="employee">
                            <div className = "menu-item-name">
                            <p>{item.employee_name}</p>
                            <p>ID: {item.employee_id}</p>
                            <p>{item.manager ? <span className="manager-label">Manager</span> : <span className="server-label">Server</span>}</p>
                            </div>
                            <div className="button-container">
                                <button onClick={() => this.openEditPopup(item)}>Edit</button>
                                <button onClick={() => this.handleEmployeeDelete(item)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    /**
     * Renders the Employees component.
     * @returns {JSX.Element} Employees component JSX
     */
    render() {
        console.log(this.state.apiResponse);
        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);
        return (
                <div className="Employee" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
                    <button id = "refreshbutton" onClick={this.callAPI}>Refresh</button>
                    <header className="Employee-header">
                        <h1 className="Employee-title">Employee Screen</h1>
                    </header>
                    <div className="navigation-buttons">
                            {/* Navigation Buttons */}
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button>Inventory</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button>Trends</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button> </a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"> <button id = "selected" >Employee List</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"> <button >Previous Orders</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"> <button >Kitchen</button></a>
                            <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
                        </div>
                    <div>
                        <button onClick={() => this.openAddPopup()}>Add New Employee</button>
                        <h2>Edit Current Employees</h2>
                        {this.renderTable()}
                    </div>

                    {this.state.isEditPopupOpen && (
                    <EditEmployeePopup
                        onClose={this.closeEditPopup}
                        onSubmit={this.handleSubmit}
                        onDelete={this.handleEmployeeDelete}
                        employee={this.state.editedEmployee}
                        onInputChange={this.handleExistingInputChange}
                    />
                )}

                    {this.state.isAddPopupOpen && (
                                        <AddEmployeePopup
                                            onClose={this.closeAddPopup}
                                            onSubmit={this.handleNewSubmit}
                                            employee={this.state.newEmployee}
                                            onNewChange={this.handleNewInputChange}
                                        />
                                    )}

                    {this.state.isConfirmationPopupOpen && (
                                            <ConfirmationPopup
                                                onClose={this.toggleConfirmationPopup}
                                                message= {this.state.message}
                                            />
                                        )}
                    <div id="google_translate_element"></div>
                </div>
        );
    }
}

export default Employees;
