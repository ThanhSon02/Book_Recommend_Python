import { useState } from "react";
import Header from "../components/Header/Header";
import axios from "axios";
import uniqid from "uniqid";

function Create() {
    const [formData, setFormData] = useState({});
    const [addStatus, setAddStatus] = useState("");
    const [formUpdate, setFormUpdate] = useState();
    const [bookId, setBookId] = useState("");
    const [bookIdDelete, setBookIdDelete] = useState("");
    const [updateStatus, setUpdateStatus] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [findingResult, setFindingResult] = useState(false);

    const handleAddBook = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:8000/books/add", {
                data: formData,
            })
            .then((res) => {
                setAddStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleFindBook = (e) => {
        e.preventDefault();
        if (bookId === "") {
            setFindingResult(false);
        } else {
            axios
                .get(`http://127.0.0.1:8000/books/details/${bookId}`)
                .then((res) => {
                    if (typeof res.data === "object") {
                        setFindingResult(true);
                        delete res.data.rating;
                        setFormUpdate(res.data);
                    } else {
                        setFindingResult(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:8000/books/update", {
                data: formUpdate,
            })
            .then((res) => {
                setUpdateStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        axios
            .post(`http://127.0.0.1:8000/books/delete/${bookIdDelete}`)
            .then((res) => {
                setDeleteStatus(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Header />
            <div className="w-full pb-52 bg-[#213b64] p-10">
                {/* Add book */}
                <div className=" text-white">
                    <h1 className="font-bold text-2xl mb-5">Thêm mới 1 sách</h1>
                    <form
                        onSubmit={handleAddBook}
                        className="flex flex-col items-center">
                        <section className="text-black w-2/4 text-lg grid grid-rows-2 grid-cols-2 gap-y-10 place-items-center">
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="book-name">
                                    Tiêu đề:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                            isbn: uniqid(),
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="book-name"
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="book-author">
                                    Tác giả:
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
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="year-public">
                                    Năm phát hành:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            publishYear: e.target.value,
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="year-public"
                                    type="number"
                                    min={1800}
                                    max={3000}
                                />
                            </div>
                            <div>
                                <label
                                    className="mr-2 text-white font-semibold"
                                    htmlFor="publisher">
                                    Nhà xuất bản:
                                </label>
                                <input
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            publisher: e.target.value,
                                            imgS: "",
                                            imgM: "",
                                            imgL: "",
                                        }))
                                    }
                                    className="rounded px-2 py-2"
                                    id="publisher"
                                />
                            </div>
                        </section>
                        <button className="bg-white text-[#213b64] w-1/4 rounded mt-8 py-3 px-4 font-bold text-xl">
                            Thêm
                        </button>
                        {addStatus !== "" ? (
                            <h1 className="font-bold text-lg mt-5">
                                {addStatus}
                            </h1>
                        ) : (
                            <></>
                        )}
                    </form>
                </div>

                {/* Update book */}
                <div className=" text-white border-t-2 mt-8 pt-4">
                    <h1 className="font-bold text-2xl mb-5">Cập nhật sách</h1>

                    {/* Finding book by id */}
                    <form
                        className="flex items-center justify-center gap-4"
                        onSubmit={handleFindBook}>
                        <div>
                            <label
                                className="mr-2 text-white font-semibold"
                                htmlFor="book-id">
                                ID Sách:
                            </label>
                            <input
                                id="book-id"
                                className="rounded text-gray-700 px-2 py-2"
                                value={bookId}
                                onChange={(e) => setBookId(e.target.value)}
                            />
                        </div>
                        <button className="bg-white text-[#213b64] rounded px-2 py-2 font-bold text-xl">
                            Tìm
                        </button>
                    </form>
                    {findingResult ? (
                        <form
                            onSubmit={handleUpdate}
                            className="flex flex-col items-center">
                            <section className="text-black mt-8 w-2/4 text-lg grid grid-rows-2 grid-cols-2 gap-y-10 place-items-center">
                                <div className="">
                                    <label
                                        className="mr-2 text-white font-semibold"
                                        htmlFor="book-name">
                                        Tiêu đề:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                                isbn: formUpdate.isbn,
                                            }))
                                        }
                                        className="rounded px-2 py-2"
                                        id="book-name"
                                        value={formUpdate.title}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mr-2 text-white font-semibold"
                                        htmlFor="book-author">
                                        Tác giả:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                author: e.target.value,
                                            }))
                                        }
                                        className="rounded px-2 py-2"
                                        id="book-author"
                                        value={formUpdate.author}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mr-2 text-white font-semibold"
                                        htmlFor="year-public">
                                        Năm phát hành:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                publishYear: parseInt(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        className="rounded px-2 py-2"
                                        id="year-public"
                                        type="number"
                                        min={1800}
                                        max={3000}
                                        value={formUpdate.publishYear}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="mr-2 text-white font-semibold"
                                        htmlFor="publisher">
                                        Nhà xuất bản:
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                publisher: e.target.value,
                                                imgS: "",
                                                imgM: "",
                                                imgL: "",
                                            }))
                                        }
                                        className="rounded px-2 py-2"
                                        id="publisher"
                                        value={formUpdate.publisher}
                                    />
                                </div>
                            </section>
                            <button className="bg-white text-[#213b64] w-1/4 rounded mt-8 py-3 px-4 font-bold text-xl">
                                Lưu
                            </button>
                            {updateStatus !== "" ? (
                                <h1 className="font-bold text-lg mt-5">
                                    {updateStatus}
                                </h1>
                            ) : (
                                <></>
                            )}
                        </form>
                    ) : (
                        <h1 className="text-center mt-6 font-bold text-lg">
                            Không có dữ liệu sách này
                        </h1>
                    )}
                </div>

                {/* Delete book */}
                <div className="text-white border-t-2 mt-8 pt-4">
                    <h1 className="font-bold text-2xl mb-5">Xoá sách</h1>
                    <form
                        className="flex items-center justify-center gap-4"
                        onSubmit={handleDelete}>
                        <div>
                            <label
                                className="mr-2 text-white font-semibold"
                                htmlFor="book-id">
                                ID sách:
                            </label>
                            <input
                                id="book-id"
                                className="rounded text-gray-700 px-2 py-2"
                                value={bookIdDelete}
                                onChange={(e) =>
                                    setBookIdDelete(e.target.value)
                                }
                            />
                        </div>
                        <button className="bg-white text-[#213b64] rounded px-2 py-2 font-bold text-xl">
                            Xoá
                        </button>
                    </form>
                    {deleteStatus ? (
                        <h1 className="text-center mt-6 font-bold text-lg">
                            {deleteStatus}
                        </h1>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}

export default Create;
