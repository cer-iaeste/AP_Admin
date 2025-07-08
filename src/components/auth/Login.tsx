import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cerLogo from "../../images/cer-logo-white.png"; // Assuming this is a white logo suitable for a dark header
import AuthService from "../../service/AuthService";
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        
        const loginPromise = AuthService.login(email, password);
        
        toast.promise(loginPromise, {
            pending: "Logging in...",
            success: {
                render({ data }) {
                    if (data) {
                        if (data.role === "user" && data.country) navigate(`/countries/${data.country}`);
                        else navigate("/");
                    }
                    return "Login successful!";
                }
            },
            error: {
                render({ data }) {
                    return "Invalid login credentials!";
                }
            }
        });
        
        try {
            await loginPromise;
        } catch (err) {
            console.error("Login error: ", err);
        } finally {
            setLoginLoading(false);
        }
    };
    
    return (
        <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="
                max-w-md w-full // Responsive width
                bg-white p-8 rounded-2xl shadow-xl border border-gray-200 // Modern card styling
                text-center space-y-8 // Vertical spacing
            ">
                {/* Header with Logo and Title */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 -mt-8 -mx-8 rounded-t-2xl shadow-md flex flex-col items-center justify-center space-y-4"> {/* Extended header with gradient */}
                    <img alt="IAESTE AP Admin Panel" className="h-24 w-auto" src={cerLogo} /> {/* Larger logo */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                        IAESTE AP Admin Panel
                    </h2>
                </div>

                {/* Login Form */}
                <form className="space-y-8 mt-8" onSubmit={handleLogin}> {/* Increased top margin and spacing for form */}
                    {/* Email Input */}
                    <div className="flex flex-col space-y-2"> {/* Increased spacing */}
                        <label htmlFor="email" className="text-lg font-semibold text-gray-800 flex items-center gap-2"> {/* Bigger font for label */}
                            <i className="fa-solid fa-envelope text-blue-600"></i> Email Address:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your.email@example.com"
                            className="
                                w-full p-4 border border-gray-300 rounded-xl bg-white // Bigger padding, more rounded
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 // More prominent focus
                                text-gray-800 text-lg shadow-sm // Bigger font for input
                            "
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col space-y-2"> {/* Increased spacing */}
                        <label htmlFor="password" className="text-lg font-semibold text-gray-800 flex items-center gap-2"> {/* Bigger font for label */}
                            <i className="fa-solid fa-lock text-blue-600"></i> Password:
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="
                                    w-full p-4 border border-gray-300 rounded-xl bg-white pr-12 // Bigger padding, more rounded, increased pr
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 // More prominent focus
                                    text-gray-800 text-lg shadow-sm // Bigger font for input
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none" // Updated colors
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}  text-xl`} />
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        disabled={!email || !password || loginLoading}
                        type="submit"
                        className={`
                            w-full py-4 px-8 rounded-xl font-semibold text-xl
                            transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${!email || !password || loginLoading
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md' // Gradient color mix
                            }
                            flex items-center justify-center gap-3 // Increased gap
                        `}
                    >
                        {loginLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <i className="fa-solid fa-right-to-bracket text-2xl"></i>
                        )}
                        <span>{loginLoading ? "Authenticating..." : "Login"}</span>
                    </button>

                    {/* Registration Link */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center text-gray-700 text-lg"> {/* Bigger font */}
                        <span>Don't have an account?</span>
                        <a href="/register" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">Register here!</a> {/* Updated link color */}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;
