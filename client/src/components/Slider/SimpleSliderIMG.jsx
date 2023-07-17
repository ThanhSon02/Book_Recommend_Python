import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import { useNavigate } from "react-router-dom";

function SimpleSlider({ title, color, data }) {
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    const handleClick = (e) => {
        navigate(`detail/${e.target.id}`, { state: { id: e.target.id } });
    };

    return (
        <div className={`bg-[${color}] px-10 py-6 text-white`}>
            <h1 className="text-xl font-semibold mb-5 ml-7">{title}</h1>
            <Slider {...settings} className="gap-4">
                {data.map((item, index) => (
                    <div key={index} onClick={handleClick}>
                        <img
                            id={item.ISBN}
                            className="cursor-pointer"
                            src={item["Image-URL-L"]}
                            width={200}
                            height={280}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

SimpleSlider.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    color: PropTypes.string,
};

export default SimpleSlider;
