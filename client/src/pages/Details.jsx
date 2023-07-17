import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Rating from "@mui/material/Rating";
import uniqid from "uniqid";

function Details() {
    const formRatingInitial = {
        userId: "",
        isbn: "",
        bookRating: 0,
    };

    const initialData = {
        isbn: "",
        title: "",
        author: "",
        publishYear: 0,
        publisher: "",
        rating: "",
        imgS: "",
        imgM: "",
        imgL: "",
    };

    const [data, setData] = useState(initialData);
    const [formRating, setFormRating] = useState(formRatingInitial);
    const [ratingStatus, setRatingStatus] = useState(false);

    const location = useLocation();
    const id = location.state.id;
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/books/details/${id}`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formRating);
        axios
            .post("http://127.0.0.1:8000/books/rate", {
                data: formRating,
            })
            .then((res) => {
                setRatingStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Header />
            <div className="w-screen pb-8 flex flex-col items-center bg-[#213b64] text-white">
                <div className="flex flex-col mt-4 ">
                    <img src={data.imgL} />
                    <h1 className="place-self-center font-semibold text-2xl">
                        {data.title}
                    </h1>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Tác giả: </h1>
                        <p>{data.author}</p>
                    </div>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Năm phát hành:</h1>
                        <p>{data.publishYear}</p>
                    </div>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Nhà xuất bản: </h1>
                        <p>{data.publisher}</p>
                    </div>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Đánh giá: </h1>
                        <p className="font-bold text-red-600">
                            {parseFloat(data.rating).toFixed(1)}
                        </p>
                    </div>
                </div>
                <form className="w-2/3 mt-5" onSubmit={handleSubmit}>
                    <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center">
                            <label className="mr-2 text-xl font-semibold">
                                Đánh giá cuốn sách này:
                            </label>
                            <Rating
                                max={10}
                                name="controlled"
                                value={formRating.rating}
                                onChange={(e, value) =>
                                    setFormRating((prev) => ({
                                        ...prev,
                                        userId: uniqid(),
                                        isbn: id,
                                        bookRating: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <button className="mt-3 bg-white rounded text-black py-1 px-6 font-bold hover:opacity-90">
                        Gửi đánh giá
                    </button>
                </form>
                {ratingStatus ? <h1>{ratingStatus}</h1> : <></>}
            </div>
        </>
    );
}

export default Details;
