import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cerLogo from "../../images/cer-logo-white.png";
import AuthService from "../../service/AuthService";
import { emptyLocalStorage } from "../../global/Global";
import Loader from "../loader/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);  // To track if email input is focused
    const [passwordFocused, setPasswordFocused] = useState(false);  // To track if password input is focused
    const [loginLoading, setLoginLoading] = useState(false)
    const nav = useNavigate()

    emptyLocalStorage();

    const handleLogin = async (e: React.FormEvent) => {
        emptyLocalStorage();
        e.preventDefault();
        setLoginLoading(true)
        AuthService.login(email, password).then(data => {
            if (data) {
                setError("")
                if (data.role === "user" && data.country) nav(`/${data.country}`)
                else nav("/")
            } else setError("Invalid login credentials!")
            setLoginLoading(false)
        })
    };


    return (
        <>
            {loginLoading ?
                <Loader />
                : <div className="flex items-center justify-center h-screen bg-gradient-opacity">
                    <div className="w-full max-w-sm mx-10 p-8 space-y-6 bg-gradient rounded-lg shadow-xl border-2 border-black">
                        <img alt="CER Summer App" className="h-16 w-auto mx-auto" src={cerLogo} />
                        <h2 className="text-4xl font-bold text-center text-white">IAESTE AP Admin Panel</h2>
                        {/* <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2> */}
                        <form className="space-y-4 font-semibold text-xl" onSubmit={handleLogin}>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    onFocus={() => setEmailFocused(true)}   // Handle focus
                                    onBlur={() => setEmailFocused(false)}   // Handle blur
                                    className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-black rounded-lg shadow-xl focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                {!emailFocused && !email &&
                                    <div className="absolute left-5 top-3.5 transform text-gray-500">
                                        <i className="fas fa-envelope mr-2" />
                                        <span>Email</span>
                                    </div>}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    onFocus={() => setPasswordFocused(true)}   // Handle focus
                                    onBlur={() => setPasswordFocused(false)}   // Handle blur
                                    className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-black rounded-lg shadow-xl focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                {!passwordFocused && !password &&
                                    <div className="absolute left-5 top-3.5 transform text-gray-500">
                                        <i className="fas fa-lock  mr-2" />
                                        <span>Password</span>
                                    </div>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-3.5 text-gray-500"
                                >
                                    {showPassword ? (
                                        <i className="fas fa-eye-slash" />
                                    ) : (
                                        <i className="fas fa-eye" />
                                    )}
                                </button>
                            </div>
                            {error && <p className="rounded-lg bg-red-200 text-red-600">
                                <i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}
                            </p>}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white bg-[#282c34] rounded-lg hover:bg-[#61dafb] border-2 border-black shadow-xl"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            }
        </>

    );
}

export default Login;