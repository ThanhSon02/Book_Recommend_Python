import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Analysis from "./pages/Analysis";
import axios from "axios";
import { useState, useEffect } from "react";
import Details from "./pages/Details";

function App() {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/books/highestrated")
            .then((res) => {
                setData1(Object.values(res.data));
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("http://127.0.0.1:8000/books/mostpopular")
            .then((res) => {
                setData2(Object.values(res.data));
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get("http://127.0.0.1:8000/authors/highestrated")
            .then((res) => {
                setData3(Object.values(res.data));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        index
                        element={
                            <Home data1={data1} data2={data2} data3={data3} />
                        }
                    />
                    <Route path="create" element={<Create />} />
                    <Route path="analysis" element={<Analysis />} />
                    <Route path="detail/:id" element={<Details />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
