import { NavLink } from "react-router-dom";
import "./Header.css";
function Header() {
    return (
        <>
            <div className="w-full h-14 bg-[#2D518B] flex justify-center gap-10 items-center cursor-pointer">
                <NavLink
                    to="/"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Trang Chủ
                </NavLink>
                <NavLink
                    to="/create"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Thêm - Sửa - Xoá
                </NavLink>
                <NavLink
                    to="/analysis"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Tương Quan
                </NavLink>
            </div>
        </>
    );
}

export default Header;
