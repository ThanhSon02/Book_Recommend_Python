import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Rating from "@mui/material/Rating";

function Details() {
    const [data, setData] = useState({});
    const [rating, setRating] = useState(0);
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
                <form className="w-2/3 mt-5">
                    <h1 className="text-xl">Rating</h1>
                    <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center">
                            <label className="mr-2">Your Name: </label>
                            <input
                                className="px-2 py-3"
                                type="text"
                                placeholder="your name"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Age: </label>
                            <input
                                placeholder="age"
                                className="px-2 py-3"
                                type="number"
                                min={1}
                                max={200}
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Rating: </label>
                            <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Details;
