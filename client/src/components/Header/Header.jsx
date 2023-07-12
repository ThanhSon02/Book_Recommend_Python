import { NavLink } from "react-router-dom";
import "./Header.css";
function Header() {
    return (
        <>
            <div className="w-full h-14 bg-[#2D518B] flex justify-center gap-10 items-center cursor-pointer">
                <NavLink
                    to="/"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Home
                </NavLink>
                <NavLink
                    to="/create"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Create New
                </NavLink>
                <NavLink
                    to="/analysis"
                    className="text-white px-3.5 py-2 hover:border-white border-transparent border-2 rounded">
                    Analysis
                </NavLink>
            </div>
        </>
    );
}

export default Header;
