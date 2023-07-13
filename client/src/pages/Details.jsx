import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Rating from "@mui/material/Rating";
import uniqid from "uniqid";

function Details() {
    const formRatingInitial = {
        id: "",
        name: "",
        age: "",
        rating: 0,
    };

    const [data, setData] = useState({});
    const [formRating, setFormRating] = useState(formRatingInitial);

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
            .post("http://127.0.0.1:8000/books/details/rating/", {
                data: formRating,
            })
            .then((res) => {
                console.log(res.data);
            });
    };

    return (
        <>
            <Header />
            <div className="w-screen flex flex-col items-center bg-[#213b64] text-white">
                <div className="flex flex-col mt-4 ">
                    <img src={data["Image-URL-L"]} />
                    <h1 className="place-self-center font-semibold text-2xl">
                        {data["Book-Title"]}
                    </h1>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Author: </h1>
                        <p>{data["Book-Author"]}</p>
                    </div>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">
                            Year Of Publication:
                        </h1>
                        <p>{data["Year-Of-Publication"]}</p>
                    </div>
                    <div className="flex">
                        <h1 className="font-semibold mr-2">Publisher: </h1>
                        <p>{data["Publisher"]}</p>
                    </div>
                </div>
                <form className="w-2/3 mt-5" onSubmit={handleSubmit}>
                    <h1 className="text-xxl">Rating</h1>
                    <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center">
                            <label className="mr-2">Your Name: </label>
                            <input
                                className="text-gray-800 px-2 py-3"
                                type="text"
                                placeholder="your name"
                                value={formRating.name}
                                onChange={(e) =>
                                    setFormRating((prev) => ({
                                        ...prev,
                                        id: uniqid(),
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Age: </label>
                            <input
                                placeholder="age"
                                className="text-gray-800 px-2 py-3"
                                type="number"
                                min={1}
                                max={200}
                                value={formRating.age}
                                onChange={(e) =>
                                    setFormRating((prev) => ({
                                        ...prev,
                                        age: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Rating: </label>
                            <Rating
                                name="controlled"
                                value={formRating.rating}
                                onChange={(e, value) =>
                                    setFormRating((prev) => ({
                                        ...prev,
                                        rating: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <button className="mt-3 bg-white text-black py-1 px-6 font-bold hover:opacity-90">
                        Rate!
                    </button>
                </form>
            </div>
        </>
    );
}

export default Details;
