import React from "react"

interface ImagePopupProps {
    image: string
    closeModal: () => void
}

const ImagePopup: React.FC<ImagePopupProps> = ({ image, closeModal }) => {
    return (
        <div className="overlay">
            <div className="relative bg-black rounded-xl shadow-md max-w-7xl w-full h-5/6 flex justify-center">
                <img src={image} alt="Enlarged" className="" />
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-red-500 rounded-full p-1"
                >
                    <i className="fa fa-circle-xmark text-3xl"></i>
                </button>
            </div>
        </div>
    )
}

export default ImagePopup;