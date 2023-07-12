import { useState } from "react";
import Header from "../components/Header/Header";

function Create() {
    const [formData, setFormData] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };
    return (
        <>
            <Header />
            <div className="w-full h-screen bg-[#213b64] p-10">
                <div className="rounded text-white">
                    <h1 className="font-bold text-2xl mb-5">
                        Adding a new book
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center">
                        <section className="text-black w-2/4 text-lg grid grid-rows-2 grid-cols-2 gap-y-10 place-items-center">
                            <div className="">
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="book-name">
                                    Book Title:{" "}
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="book-name"
                                    placeholder="title"
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="book-author">
                                    Author:{" "}
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            author: e.target.value,
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="book-author"
                                    placeholder="author"
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="year-public">
                                    Year Of Publication:{" "}
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            year: e.target.value,
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="year-public"
                                    type="number"
                                    min={1800}
                                    max={3000}
                                    placeholder="Year"
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="publisher">
                                    Publisher:{" "}
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            publisher: e.target.value,
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="publisher"
                                    placeholder="publisher"
                                />
                            </div>
                        </section>
                        <button className="bg-white text-[#213b64] w-1/4 rounded mt-8 py-3 px-4 font-bold text-xl">
                            ADD
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Create;
