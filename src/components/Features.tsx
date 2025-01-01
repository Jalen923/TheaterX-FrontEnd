import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Features = () => {
    //types
    type HomeFeatureItem = {
        title: string
        subtitle: string
        background: string
        size: string
    }

    //states
    const [homeFeatureItems, setHomeFeatureItems] = useState<HomeFeatureItem[]>([])

    //effects
    useEffect(() => {
      (async () => {
        setHomeFeatureItems(await getHomeFeatureItems())
      })()
    }, [])

    //functions
    const getHomeFeatureItems = async () => {
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                query {
                    homeFeatureItems {
                        title
                        subtitle
                        background
                        size
                    }
                }
            `
        })
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
      const results = await response.json()
      return results.data.homeFeatureItems
    }

    return (
        <div className='features-container'>
            {
              homeFeatureItems.map((feature, index) =>
                <Link to={`/${feature.subtitle}`} key={index} className={`feature-box feature-box-${feature.size} ${feature.subtitle === "Luxury" ? "luxury-feature-box" : ""}`} style={{backgroundImage: `url(${feature.background})`, backgroundSize: 'cover'}}>
                    <h2 className='feature-box-label'>{feature.subtitle}</h2>
                    <h1 className='feature-box-title'>{feature.title}</h1>
                </Link>
              )
            }
        </div>
    )
}

export default Features