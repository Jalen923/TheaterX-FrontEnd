import Navbar from "./Navbar"
import Footer from './Footer'
import '../stylesheets/dining.css'
import { useEffect, useState } from "react"

const Dining = () => {
    //types
    type DiningFeature = {
        title: string
        description: string
    }

    type DiningMenu = {
        item: string
        description: string
        price: string
        calories: string
        category: string
        background: string
    }

    //states
    const [diningFeatures, setDiningFeatures] = useState<DiningFeature[]>([])
    const [diningMenu, setDiningMenu] = useState<DiningMenu[]>([])
    const [diningMenuCategories, setDiningMenuCategories] = useState<string[]>([])


    //effects
    useEffect(() => {
        (async () => {
            setDiningFeatures(await getDiningFeatures())
            let results = await getDiningMenu()
            setDiningMenu(results)
            setDiningMenuCategories(Array.from(new Set(results.map((dm: DiningMenu) => dm.category))))
        })()
    }, [])

    //functions
    const getDiningFeatures = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        diningFeatures {
                            title
                            description
                        }
                    }
                `
              })
        }

        const response = await fetch("http://localhost:4000/graphql", options)
        const results = await response.json()
        return results.data.diningFeatures
    }

    const getDiningMenu = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        diningMenuItems {
                            item
                            description
                            price
                            calories
                            category
                            background
                        }
                    }
                `
              })
        }

        const response = await fetch("http://localhost:4000/graphql", options)
        const results = await response.json()
        return results.data.diningMenuItems
    }

    const getDiningMenuByCategory = (category: string) => {
        return diningMenu.filter((dm) => dm.category === category)
    }

    return (
        <div style={{height: '100vh', backgroundColor: "rgb(20,20,20)"}}>
            <Navbar></Navbar>
            <div className="dining-hero" style={{backgroundImage: `url(https://theaterx.s3.us-east-2.amazonaws.com/img/truffle.jpeg)`}}>
                <h1 className="dining-hero-header">Exquisite Eats</h1>
                <h2 className="dining-hero-subheader">Elevate Your Palate With Every Bite</h2>
                <button className='dining-hero-btn'>Order Now</button>
            </div>
            <div className="dining-features-container">
                <ul className="dining-features-list">
                    {
                        diningFeatures.map((feature) => 
                            <li className="dining-features-list-item">
                                <h1>{feature.title}</h1>
                                <p>{feature.description}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            {
                diningMenuCategories.map((category) => 
                    <div className='menu-container'>
                        <div className='menu-title-container' style={{backgroundImage: `url(${getDiningMenuByCategory(category)[1].background})`}}>
                            <h1>{category}</h1>
                        </div>
                        <div className='menu-items-container'>
                            {
                                getDiningMenuByCategory(category).map((menuItem) => 
                                    <button className="menu-item-inner-btn">
                                        <div className="menu-item-inner">
                                            <div className="menu-item front">
                                                <label className="menu-item-title">{menuItem.item}</label>
                                                <label className="menu-item-desc">{menuItem.description}</label>
                                                <label className="menu-item-price">{menuItem.price}</label>
                                                <label className="menu-item-cal">{menuItem.calories}</label>
                                            </div>
                                            <div className="menu-item back" style={{backgroundImage: `url(${menuItem.background})`}}></div>
                                        </div>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                diningMenuCategories.map((category) =>
                    <div className='menu-container-mobile'>
                        <div className='menu-title-container-mobile' style={{backgroundImage: `url(${getDiningMenuByCategory(category)[1].background})`}}>
                            <h1>{category}</h1>
                        </div>
                            <div className='menu-items-container-mobile'>
                                {
                                    getDiningMenuByCategory(category).map((menuItem) => 
                                        <button className="menu-item-inner-btn" style={category === "Classics" ? {display: "grid", gridColumn: "1 / 3"} : {}}>
                                            <div className="menu-item-inner">
                                                <div className="menu-item front">
                                                    <label className="menu-item-title">{menuItem.item} {category}</label>
                                                    <label className="menu-item-desc">{menuItem.description}</label>
                                                    <label className="menu-item-price">{menuItem.price}</label>
                                                    <label className="menu-item-cal">{menuItem.calories}</label>
                                                    <label className="menu-item-cal">(Tap Me)</label>
                                                </div>
                                                <div className="menu-item back" style={{backgroundImage: `url(${menuItem.background})`}}></div>
                                            </div>
                                        </button>
                                    )
                                }
                                
                            </div>
                    </div>
                )
            }
            <Footer></Footer>
        </div>
    )
}

export default Dining

