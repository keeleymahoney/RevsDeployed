import React, { Component } from "react";
import "./MenuBoard.css";
// import { Link } from 'react-router-dom';

/**
 * @author Joanne Liu
 * Component for displaying images of promoted items and information for sides, beverages, and seasonal items.
 */
class MenuBoardImages extends Component {
    /**
     * Constructor for MenuBoardImages component.
     * Initializes state and fetches data.
     * 
     * @param {object} props - The props object passed to this component.
     */
    constructor(props) {
        super(props);
        this.state = {
            entrees: [], 
            sides: [],
            desserts: [],
            beverages: [], 
            seasonals: [],
            promotions: [],
            currentSlideIndex: 0,
            intervalId: null
        };
        this.fetchSidesData();
        this.fetchBeveragesData();
        this.fetchSeasonalsData();
        this.fetchPromotions();
    }
    
    /**
     * Fetches promoted items data from the API.
     */
    fetchPromotions() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/promotions")
        // fetch("http://localhost:9000/menuItemsAPI/promotions")
            .then(res => res.json())
            .then(res => this.setState({ promotions: res }))       
            .catch(err => console.error(err));
    }

    /**
     * Fetches beverage items data from the API.
     */
    fetchBeveragesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/beverages")
            .then(res => res.json())
            .then(res => this.setState({ beverages: res}))
            .catch(err => console.error(err));
    }

    /**
     * Fetches sides items data from the API.
     */
    fetchSidesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/sides")
            .then(res => res.json())
            .then(res => this.setState({ sides: res}))            
            .catch(err => console.error(err));
    }

    /**
     * Fetches seasonal items data from the API.
     */
    fetchSeasonalsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/seasonals")
            .then(res => res.json())
            .then(res => this.setState({ seasonals: res }))            
            .catch(err => console.error(err));
    }

    /**
     * Sets the current slide index for the promotion slideshow.
     * 
     * @param {number} newIndex The index of the new slide.
     */
    setIndex = newIndex => {
        this.setState({currentSlideIndex: newIndex}, this.startTimeout);
    }

    /**
     * Lifecycle method called after the component mounts.
     * Starts autoplay for the slideshow when the component mounts.
     */
    componentDidMount() {
        // Start autoplay when component mounts
        this.startAutoplay();
    }


    /**
     * Lifecycle method called before the component unmounts.
     * Clears the interval used for autoplay when the component is about to unmount.
     */
    componentWillUnmount() {
        // Clear interval when component unmounts
        clearInterval(this.state.intervalId);
    }

    /**
     * Starts the autoplay for the promotion slideshow.
     */
    startAutoplay = () => {
        const intervalId = setInterval(this.nextSlide, 3000); // Change slide every 3 seconds
        this.setState({ intervalId });
    }

    /**
     * Moves to the next slide in the promotion slideshow.
     */
    nextSlide = () => {
        const { promotions, currentSlideIndex } = this.state;
        const nextIndex = (currentSlideIndex + 1) % promotions.length;
        this.setState({ currentSlideIndex: nextIndex });
    }


    /**
     * Renders images of promoted menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing promoted menu items.
     */
    renderPromotions() {
        const { promotions, currentSlideIndex } = this.state;

        console.log(promotions);
        return (
            <div className="menuboard-image-slideshow">
                <div className="slideshowSlider" style={{ transform: `translate3d(${-currentSlideIndex * 100}%, 0, 0)` }}>
                    {promotions.map((promotion, index) => (
                        <div key={index} className = "slide">
                            <img className="menuboard-image" src={promotion.picture} alt={promotion.item_name} />
                            <p><span class="category-caption">{promotion.menu_category}</span>: {promotion.item_name}&nbsp;&nbsp;&nbsp;&nbsp;${promotion.price}</p>
                        </div>
                    ))}
                </div>
                <div className="slideshowDots">
                    {promotions.map((_, idx) => (
                        <div key={idx} className={`slideshowDot ${idx === currentSlideIndex ? 'active' : ''}`}></div>
                    ))}
                </div>
            </div>
        );
    }


    /**
     * Renders sides menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing side menu items.
     */
    renderSides()
    {
        const { sides } = this.state;
        return sides.map(item => ( item.price > 0 && 
            <div key={item.item_name}>
                <div className = "menu-item-box">
                    <div className = "header-row">
                        <span>{item.item_name} </span> | {item.price} &emsp; 
                        {item.vegetarian && 'V'} &nbsp;&nbsp; {item.glutenfree && 'GF'}
                    </div>
                    <p>&nbsp;&nbsp; {item.descript}</p>
                </div>
            </div>
        ));
    }


    /**
     * Renders beverage menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing beverage menu items.
     */
    renderBeverages()
    {
        const { beverages } = this.state;
        return beverages.map(item => ( item.price > 0 && 
            <tr key={item.item_name}>
                <div className = "menu-item-box">
                    <div className = "header-row">
                        <span>{item.item_name} </span> | {item.price} &emsp; 
                        {item.vegetarian && 'V'} &nbsp;&nbsp; {item.glutenfree && 'GF'}
                    </div>
                    <p>&nbsp;&nbsp; {item.descript}</p>
                </div>
            </tr>
        ));
    }


    /**
     * Renders seasonal menu items.
     * @returns {JSX.Element[]} Array of JSX elements representing seasonal menu items.
     */
    renderSeasonals()
    {
        const { seasonals } = this.state;
        return seasonals.map(item => ( item.price > 0 && 
            <tr key={item.item_name}>
                <div className = "menu-item-box">
                    <div className = "header-row">
                        <span>{item.item_name} </span> | {item.price} &emsp; 
                        {item.vegetarian && 'V'} {item.glutenfree && 'GF'}
                    </div>
                    <p>&nbsp;&nbsp; {item.descript}</p>
                </div>
            </tr>
        ));
    }

     /**
     * Renders the MenuBoardImages component.
     * 
     * @returns {JSX.Element} JSX Element representing the MenuBoardImages component.
     */
    render() {
        return (
            <div>
                <div className = "menuboard-container">
                    <div className = "menuboard-image-column">
                        <div>{this.renderPromotions()}</div>
                    </div>
                    <div className = "image-right-column">
                        <div className = "header">Seasonals</div>
                        <div className = "category-box">
                            {this.renderSeasonals()}
                        </div>
                        <div className = "header">Sides</div>
                        <div className = "category-box">
                            {this.renderSides()}
                        </div>
                        <div className = "header">Beverages</div>
                        <div className = "category-box">
                            {this.renderBeverages()}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default MenuBoardImages;
