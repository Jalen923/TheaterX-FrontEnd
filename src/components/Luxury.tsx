import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import LuxuryModal from "./LuxuryModal"
import '../stylesheets/luxury.css'
import Footer from "./Footer"

const Luxury = () => {
    //types
    type LuxuryFeature = {
      title: string
      description: string
    }

    type LuxuryGalleryImage = {
      url: string
      label: string
      size: string
    }
    //useStates
    const [luxuryFeatures, setLuxuryFeatures] = useState<LuxuryFeature[]>([])
    const [luxuryGalleryImages, setLuxuryGalleryImages] = useState<LuxuryGalleryImage[]>([])
    const [showModal, setShowModal] = useState(false)
    const [currentModalImage, setCurrentModalImage] = useState<LuxuryGalleryImage | null>(null)

    //effects
    useEffect(() => {
      (async () => {
          setLuxuryFeatures(await getLuxuryFeatures())
          setLuxuryGalleryImages(await getLuxuryGalleryImages())
      })()
    }, [])

    //functions
    const getLuxuryFeatures = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        luxuryFeatures {
                            title
                            description
                        }
                    }
                `
              })
        }

        const response = await fetch("http://localhost:4000/graphql", options)
        const results = await response.json()
        return results.data.luxuryFeatures
    }

    const getLuxuryGalleryImages = async() => {
      const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              query: `
                  query {
                      luxuryGalleryImages {
                          url
                          label
                          size
                      }
                  }
              `
            })
      }

      const response = await fetch("http://localhost:4000/graphql", options)
      const results = await response.json()
      return results.data.luxuryGalleryImages
  }

    const handleImageClick = (image: LuxuryGalleryImage) => {
      setShowModal(true)
      setCurrentModalImage(image)
    }

    return (
        <div style={{height: '100vh', backgroundColor: "rgb(20,20,20)"}}>
            <Navbar></Navbar>
            <div className="luxury-hero" style={{backgroundImage: `url(https://theaterx.s3.us-east-2.amazonaws.com/img/luxury.webp)`}}>
                <h1 className="luxury-hero-header">Luxurious Leisure</h1>
                <h2 className="luxury-hero-subheader">Where Innovation Knows No Limits</h2>
                <button className='luxury-hero-btn'>Get Tickets</button>
            </div>
            <div className="luxury-features-container">
                <ul className="luxury-features-list">
                  {
                    luxuryFeatures.map((feature, index) =>
                      <li key={index} className="luxury-features-list-item">
                        <h1>{feature.title}</h1>
                        <p>{feature.description}</p>
                      </li>
                    )
                  }
                </ul>
            </div>
            <div className="gallery-container">
              {
                luxuryGalleryImages.map((image, index) => 
                  <div 
                    key={index}
                    className={`gallery-image-container ${image.size}`} 
                    style={{backgroundImage: `url(${image.url})`}} 
                    onClick={() => handleImageClick(image)}
                  >
                  </div>
                )
              }
            </div>        
            <LuxuryModal isOpen={showModal} setIsOpen={setShowModal} image={currentModalImage}></LuxuryModal>
            <Footer></Footer>
        </div>
    )
}

export default Luxury
//
