import { Dispatch, SetStateAction } from "react"

type LuxuryModalImage = {
    url: string
    label: string
    size: string
}

type LuxuryModalProps = {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    image: LuxuryModalImage | null
}

const LuxuryModal = ({image, isOpen, setIsOpen}: LuxuryModalProps) => {

    return (
        <div className={`luxury-modal-container ${isOpen? 'open' : ''}`} onClick={() => setIsOpen(false)}>
            {
                image != null &&
                <div className="luxury-modal-image-container">
                    <img className="luxury-modal-image" src={image.url} alt="" />
                    <label className="luxury-modal-image-label">{image.label}</label>
                </div>
            }
        </div>
    )
}

export default LuxuryModal