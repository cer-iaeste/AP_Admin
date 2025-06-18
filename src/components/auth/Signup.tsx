import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cerLogo from "../../images/cer-logo-white.png";
import AuthService from "../../service/AuthService";
import { fetchUnregisteredCountries } from "../../service/CountryService";
import { toast } from 'react-toastify';

const Signup: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return; // Prevent further execution if passwords don't match
        }

        setLoading(true);
        const signupPromise = AuthService.signup(email, password, selectedCountry);
        toast.promise(signupPromise, {
            pending: "Registering...",
            success: {
                render() {
                    navigate("/login");
                    return "Registration successful! Proceed to login";
                }
            },
            error: {
                render() {
                    return "Error while registering!";
                }
            }
        });

        try {
            await signupPromise;
        } catch (err) {
            console.error("Register error: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnregisteredCountries()
            .then(result => setCountries(result))
            .catch(error => {
                console.error("Error fetching unregistered countries:", error);
                toast.error("Failed to load country list.");
            });
    }, []);

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

                {/* Signup Form */}
                <form className="space-y-8 mt-8" onSubmit={handleSignup}> {/* Increased top margin and spacing for form */}
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
                                w-full p-4 border border-gray-300 rounded-xl bg-white
                                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                text-gray-800 text-lg shadow-sm
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
                                    w-full p-4 border border-gray-300 rounded-xl bg-white pr-12
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                    text-gray-800 text-lg shadow-sm
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <i className="fa-solid fa-eye-slash text-xl" />
                                ) : (
                                    <i className="fa-solid fa-eye text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="confirmPassword" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-lock text-blue-600"></i> Confirm Password:
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                className="
                                    w-full p-4 border border-gray-300 rounded-xl bg-white pr-12
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                    text-gray-800 text-lg shadow-sm
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                                title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? (
                                    <i className="fa-solid fa-eye-slash text-xl" />
                                ) : (
                                    <i className="fa-solid fa-eye text-xl" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Country Select */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="countrySelect" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-globe text-blue-600"></i> Select Your Country:
                        </label>
                        <div className="relative">
                            <select
                                id="countrySelect"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                                className="
                                    block w-full p-4 border border-gray-300 rounded-xl bg-white pr-12 // Added pr-12 for arrow icon
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                                    text-gray-800 text-lg shadow-sm
                                    appearance-none cursor-pointer // Hide default select arrow
                                "
                            >
                                <option value="" disabled>Select your country</option>
                                {countries.map((country, index) =>
                                    <option key={index} value={country}>{country}</option>
                                )}
                            </select>
                            {/* Custom arrow for select dropdown */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Register Button */}
                    <button
                        disabled={!email || !password || !confirmPassword || !selectedCountry || loading}
                        type="submit"
                        className={`
                            w-full py-4 px-8 rounded-xl font-semibold text-xl
                            transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${!email || !password || !confirmPassword || !selectedCountry || loading
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md'
                            }
                            flex items-center justify-center gap-3
                        `}
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <i className="fa-solid fa-user-plus text-2xl"></i>
                        )}
                        <span>{loading ? "Registering..." : "Register"}</span>
                    </button>

                    {/* Back to Login Link */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-center text-gray-700 text-lg">
                        <a href="/login" className="text-purple-600 hover:text-purple-800 hover:underline font-medium flex items-center gap-2">
                            <i className="fa-solid fa-arrow-left"></i> Back to login
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Signup;
