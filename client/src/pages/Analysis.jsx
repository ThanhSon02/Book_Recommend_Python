import { useState } from "react";
import Header from "../components/Header/Header";
import axios from "axios";

function Analysis() {
    const [idBook1, setIdBook1] = useState("");
    const [idBook2, setIdBook2] = useState("");
    const [result, setResult] = useState();

    const handleCalculate = (e) => {
        e.preventDefault();
        axios
            .get(
                `http://127.0.0.1:8000/books/correlation/${idBook1}&${idBook2}`
            )
            .then((res) => {
                setResult(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Header />
            <div className="bg-[#213b64] w-full h-screen flex-col flex items-center gap-8">
                <div className="flex flex-col items-center mt-5">
                    <h1 className="text-white text-2xl font-bold">
                        Tính hệ số tương quan
                    </h1>
                    <div className="flex gap-5 mt-4">
                        <div>
                            <label className="mr-2 font-semibold text-white">
                                Sách 1:
                            </label>
                            <input
                                value={idBook1}
                                className="px-1 py-2 rounded"
                                onChange={(e) => setIdBook1(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mr-2 font-semibold text-white">
                                Sách 2:
                            </label>
                            <input
                                value={idBook2}
                                className="px-1 py-2 rounded"
                                onChange={(e) => setIdBook2(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleCalculate}
                    className="bg-white px-2 py-3 rounded w-1/6">
                    Tính
                </button>
                <div className="mt-10 text-white flex items-center">
                    {typeof result === "number" ? (
                        <div className="flex items-end">
                            <h2 className="font-semibold text-lg mr-4">
                                Kết quả:
                            </h2>
                            <div className="text-red-600 text-lg font-semibold">
                                {parseFloat(result).toFixed(2)}
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-red-600 font-semibold text-xl">
                            {result}
                        </h2>
                    )}
                </div>
            </div>
        </>
    );
}

export default Analysis;
