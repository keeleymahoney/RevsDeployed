/**
 * @module Trends
 * @author Alyan A. Tharani
 */


import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all components used in your charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Formats a column name from snake_case or special cases to readable format.
 * @param {string} columnName - The original column name in snake_case or a special format.
 * @returns {string} The formatted column name in readable text.
 *  @method formatColumnName
 */
const formatColumnName = (columnName) => {
  const specialCases = {
    'totalsales': 'Total Sales',
    'totalunitssold': 'Total Units Sold',
    'menuitemname': 'Menu Item Name'
  };
  if (specialCases[columnName.toLowerCase()]) {
    return specialCases[columnName.toLowerCase()];
  }
  return columnName.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats a date string into a more readable form 'MM/DD/YYYY'.
 * @method formatDate
 * @param {string} dateString - The ISO string of the date to be formatted.
 * @returns {string} The formatted date string.
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const Trends = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [ingredientName, setIngredientName] = useState('');
  const [apiResponse, setApiResponse] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/ingredientsAPI")
      .then(response => response.json())
      .then(data => setApiResponse(data))
      .catch(error => {
        console.error('Error fetching ingredients:', error);
        setErrorMessage('Failed to fetch data');
      });
      initializeGoogleTranslate();
  }, []);

  /**
   * Initializes the Google Translate widget by injecting the necessary script into the document.
   * This function is bound to the component instance to maintain the correct context for 'this'.
   */
  const initializeGoogleTranslate = () => {
      if (!window.googleTranslateElementInit) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
          script.async = true;
          document.body.appendChild(script);
          window.googleTranslateElementInit = googleTranslateElementInit.bind(this);
      }
  }

  /**
   * Callback function to initialize the Google Translate Element on the page.
   * This function is intended to be called after the Google Translate script has loaded.
   * @method googleTranslateElementInit
   */
  const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
  }


  /**
   * Fetches report data from the server based on the selected report type and date range.
   * The URL and query parameters are dynamically constructed based on the report type and input values.
   * Handles various validation checks such as date validation and constructs appropriate error messages.
   * @method fetchReportData
   */
  const fetchReportData = async () => {
    let requestUrl = `https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/trendsAPI/${selectedReport}`;
    // let requestUrl = `http://localhost:9000/trendsAPI/${selectedReport}`;

    if (selectedReport === 'z-report') {
      const today = new Date().toISOString().split('T')[0];
      if (new Date(today) > new Date()) {
        setErrorMessage('You cannot select a future date for the Z report.');
        return;
      }
      requestUrl += `?reportDate=${encodeURIComponent(today)}`;
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > new Date() || end > new Date()) {
        setErrorMessage('Future dates are not allowed. Please select a valid date range.');
        return;
      } else if (start > end) {
        setErrorMessage('Start date cannot be later than end date.');
        return;
      }
      requestUrl += `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    }

    if (selectedReport === 'ingredient-usage-report' && ingredientName) {
      requestUrl += `&ingredientName=${encodeURIComponent(ingredientName)}`;
    }

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData(null);
    }
  };


/**
 * Renders the content based on the current report data and selected report type.
 * Determines the appropriate rendering logic for various report types including tables and charts.
 * Returns JSX elements that visually represent the data or informative messages if no data is available.
 * @method renderContent
 * @returns {JSX.Element} The content to be displayed based on the selected report and data available.
 */
const renderContent = () => {
  if (!reportData || reportData.length === 0) {
    return <p>No data to display</p>;
  }

  switch (selectedReport) {
    case 'ingredient-usage-report':
      const ingredientUsageChartData = {
        labels: reportData.map(item => formatDate(item.order_date)),
        datasets: [{
          label: 'Total Used',
          data: reportData.map(item => item.totalused),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
      return <Line data={ingredientUsageChartData} options={{ responsive: true, scales: { y: { beginAtZero: true }, x: { title: { display: true, text: 'Date' } } } }} />;
      case 'double-order-report':
        if (reportData.length === 0) {
          return <p>No double order data available for the selected dates.</p>;
        }
        return (
          <table style={{ width: '70%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Item 1</th>
                <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Item 2</th>
                <th style={{ border: '1px solid black', backgroundColor: '#500000', color: 'white' }}>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black' }}>{item.item1}</td>
                  <td style={{ border: '1px solid black' }}>{item.item2}</td>
                  <td style={{ border: '1px solid black' }}>{item.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      

        case 'sales-report':
          if (reportData.length === 0) {
            return <p>No sales data available for the selected dates.</p>;
          }
          return (
            <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Menu Item Name</th>
                  <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.menuitemname}</td>
                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.totalunitssold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        
          case 'x-report':
            if (reportData.length === 0) {
              return <p>No X report data available for the selected dates.</p>;
            }
            return (
              <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Menu Item Name or Category</th>
                    <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Units Sold or Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.MenuItemName || item.category}</td>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.TotalUnitsSold || item.totalsales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          
            case 'excess-report':
              if (reportData.length === 0) {
                return <p>No excess inventory data available for the selected dates.</p>;
              }
              return (
                <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Ingredient Name</th>
                      <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Quantity Available</th>
                      <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Quantity Used</th>
                      <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Excess Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.ingredient_name}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.total_quantity_available}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.total_quantity_used}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.excess_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            

              case 'restock-report':
                if (reportData.length === 0) {
                  return <p>No restock data available for the selected dates.</p>;
                }
                return (
                  <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Ingredient Name</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Quantity Warning Level</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Current Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.ingredient_name}</td>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.quantity_warning}</td>
                          <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              

                case 'z-report':
                  if (reportData.length === 0) {
                    return <p>No Z report data available for the selected date.</p>;
                  }
                  return (
                    <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Category</th>
                          <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.category}</td>
                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.totalsales}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                
                  case 'weather-menu-trends':
                    if (reportData.length === 0) {
                      return <p>No weather menu trends data available for the selected dates.</p>;
                    }
                    return (
                      <table style={{ width: '70%', margin: 'auto', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Date</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Weather</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Top Menu Item</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#500000', color: 'white', textAlign: 'center' }}>Total Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, index) => (
                            <tr key={index}>
                              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{formatDate(item.date)}</td>
                              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.weather}</td>
                              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.topMenuItem ? item.topMenuItem.MenuItem : 'No data'}</td>
                              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{item.topMenuItem ? item.topMenuItem.TotalQuantity : 'No data'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  
  }
};


  return (
    <div className="App">
      <div className="OrderDisplay" style={{ fontSize: (localStorage.getItem('textsize') * 16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})` }}>
        <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
        <header className="Employee-header">
          <h1 className="Employee-title">Trends</h1>
        </header>
        <div className="navigation-buttons">
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Ingredients"><button>Inventory</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Trends"><button id="selected">Trends</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/Suppliers"><button>Supplier Order</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/MenuManager"><button>Edit Menu</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/employees"><button>Employee List</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/OrderDisplays"><button>Previous Orders</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/kitchen"><button>Kitchen</button></a>
          <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/managerOrders"> <button >Order</button></a>
        </div>
        {errorMessage && <div style={{ color: 'red', margin: '10px 0' }}>{errorMessage}</div>}
        <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}>
          <option value="">Select Report Type</option>
          <option value="sales-report">Sales Report</option>
          <option value="excess-report">Excess Report</option>
          <option value="restock-report">Restock Report</option>
          <option value="double-order-report">Double Order Report</option>
          <option value="ingredient-usage-report">Ingredient Usage Report</option>
          <option value="x-report">X Report - Any Day/time</option>
          <option value="z-report">Z Report - EofD</option>
          <option value="weather-menu-trends">Weather Menu Trends</option>
        </select>
        {selectedReport !== 'restock-report' && selectedReport !== 'z-report' && (
          <>
            <label htmlFor="startDate">Start Date:</label>
            <input id="startDate" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label htmlFor="endDate">End Date:</label>
            <input id="endDate" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </>
        )}
        {selectedReport === 'ingredient-usage-report' && (
          <select value={ingredientName} onChange={(e) => setIngredientName(e.target.value)}>
            <option value="">Select an Ingredient</option>
            {apiResponse.map((ingredient) => (
              <option key={ingredient.ingredient_name} value={ingredient.ingredient_name}>
                {ingredient.ingredient_name}
              </option>
            ))}
          </select>
        )}
        <button onClick={fetchReportData}>Load Report</button>
        <div>{renderContent()}</div>
      </div>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default Trends;
