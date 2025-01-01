import { useState, useRef, useEffect, TransitionEvent } from "react"

const Testimonial = () => {
    //types
    type Testimonial = {
        text: string
        author: string
    }
     //states
     const [testimonials, setTestimonials] = useState<Testimonial[]>([])
     const [testimonialCarouselIndex, setTestimonialCarouselIndex] = useState(0)
    
     //constants
    const TESTIMONIAL_RESET_INDEX = (testimonials.length * 2) - 1 //start reset when we get to this index
    const TESTIMONIAL_DESTINATION_INDEX = testimonials.length - 1  //go to this index for reset
    //refs
    const testimonialCarouselRef = useRef<HTMLUListElement>(null)

    //effects
    useEffect(() => {
        (async () => {
            const testimonials = await getTestimonials()
            setTestimonials(testimonials)
        })();
    })

    useEffect(() => {
        if (testimonialCarouselIndex !== TESTIMONIAL_DESTINATION_INDEX) {
            testimonialCarouselRef.current!.style.transitionDuration = '1s'
        }

        const activeTestimonialIndexInterval = setInterval(() => {
          if (testimonialCarouselIndex !== TESTIMONIAL_RESET_INDEX) {
            setTestimonialCarouselIndex((prevIndex) => prevIndex + 1)
          }
        }, 4000)
      
        return () => clearInterval(activeTestimonialIndexInterval)
    }, [testimonialCarouselIndex])

    //functions
    const resetTestimonialCarousel = (e: TransitionEvent<HTMLUListElement>) => {
        if (testimonialCarouselIndex === TESTIMONIAL_RESET_INDEX) {
          const target = e.target as HTMLUListElement
          target.style.transitionDuration = '0s'
          setTestimonialCarouselIndex(TESTIMONIAL_DESTINATION_INDEX)
        }
    }

    const getTestimonials = async () => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        query {
                            allTestimonials {
                                id
                                text
                                author
                            }
                        }
                    `
                })
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
            const results = await response.json()
            return results.data.allTestimonials

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='testimonial-container'>
            <ul className='testimonial-items' ref={testimonialCarouselRef} onTransitionEnd={(e) => resetTestimonialCarousel(e)} style={{top: `-${testimonialCarouselIndex}00%`, height: `${(testimonials.length) * 2}00%`}}>
            {
                testimonials.map((testimonial, index) =>
                <li key={index} className='testimonial-item'>
                <h1 className='testimonial-text'>{testimonial.text}</h1>
                <h2 className='testimonial-author'>- {testimonial.author}</h2>
                </li>
                )
            }
            {
                testimonials.map((testimonial, index) =>
                <li key={index} className='testimonial-item'>
                <h1 className='testimonial-text'>{testimonial.text}</h1>
                <h2 className='testimonial-author'>- {testimonial.author}</h2>
                </li>
                )
            }
            </ul>
        </div>
    )
}

export default Testimonial;