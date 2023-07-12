import SimpleSlider from "../components/Slider/SimpleSlider";
import Header from "../components/Header/Header";
import PropTypes from "prop-types";

function Home({ data1, data2, data3 }) {
    return (
        <>
            <Header />
            <SimpleSlider
                title="Top 10 sách được đánh giá cao nhất"
                color={"#213b64"}
                data={data1}
            />
            <SimpleSlider
                title="Top 10 sách được đánh giá nhiều nhất"
                color={"#2D518B"}
                data={data2}
            />
            <SimpleSlider title="Top 12" color={"#213b64"} data={data3} />
        </>
    );
}

Home.propTypes = {
    data1: PropTypes.array,
    data2: PropTypes.array,
    data3: PropTypes.array,
};

export default Home;
