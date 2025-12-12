import './main-slide.css'

const MainSlider = () => {

    // local static image (from public/)
    const mediaUrl = "/images/library.jpg"

    return (
        <div className='hero-video-section'>

            {/* Render Image */}
            <img
                src={mediaUrl}
                alt="Library Slider"
                className="slider-media"
            />

            {/* Text Overlay */}
            <div className="slider-overlay">
                <div className="slider-overlay-content">

                    <h1 className="slider-title">
                        Your Gateway to Literary Excellence
                    </h1>

                    <p className="slider-subtitle">
                        Discover, borrow, and immerse yourself in a world of knowledge
                        with Libra's modern library management system
                    </p>

                    <a href="/catalogue" className="slider-button">
                        Browse Collection
                    </a>

                </div>
            </div>
        </div>
    )
}

export default MainSlider
