import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";

function SimpleSliderText({ title, color, data }) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
    };

    return (
        <div className={`bg-[${color}] px-10 py-6 text-white`}>
            <h1 className="text-xl font-semibold mb-5 ml-7">{title}</h1>
            <Slider {...settings} className="gap-4">
                {data.map((item, index) => (
                    <div key={index}>
                        <h1 className="text-xl font-semibold mb-2">
                            {item["Book-Author"]}
                        </h1>
                        <div className="flex">
                            <h1 className="mr-2">Đánh giá: </h1>
                            <h1 className="font-semibold text-red-600">
                                {item["Book-Rating"].toFixed(2)}
                            </h1>
                        </div>
                        <div className="flex">
                            <h1 className="mr-2">Số sách đóng góp: </h1>
                            <h1 className="font-semibold text-red-600">
                                {item["Book-Count"]}
                            </h1>
                        </div>
                        <div className="flex">
                            <h1 className="mr-2">Số lượt đánh giá: </h1>
                            <h1 className="font-semibold text-red-600">
                                {item["Rating-Count"]}
                            </h1>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

SimpleSliderText.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    color: PropTypes.string,
};

export default SimpleSliderText;
