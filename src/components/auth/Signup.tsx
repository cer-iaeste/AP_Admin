import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cerLogo from "../../images/cer-logo-white.png";
import AuthService from "../../service/AuthService";
import { fetchUnregisteredCountries } from "../../service/CountryService";
import { toast } from 'react-toastify';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countries, setCountries] = useState<string[]>([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);  // To track if email input is focused
    const [passwordFocused, setPasswordFocused] = useState(false);  // To track if password input is focused
    const [confirmPasswordFocused, setConfirmPPasswordFocused] = useState(false);  // To track if password input is focused
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) toast.error("Passwords do not match!")
        else {
            setLoading(true);
            const signupPromise = AuthService.signup(email, password, selectedCountry);
            toast.promise(signupPromise, {
                pending: "Registering...",
                success: {
                    render() {
                        nav("/login")
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
        }
    };

    useEffect(() => {
        fetchUnregisteredCountries().then(result => setCountries(result))
        console.log(selectedCountry)
    }, [])



    return (
        <div className="flex items-center justify-center h-screen bg-gradient-opacity">
            <div className="w-full max-w-sm mx-10 p-8 space-y-6 bg-gradient rounded-lg shadow-xl border-2 border-black">
                <img alt="CER Summer App" className="h-16 w-auto mx-auto" src={cerLogo} />
                <h2 className="text-4xl font-bold text-center text-white">IAESTE AP Admin Panel</h2>
                {/* <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2> */}
                <form className="space-y-4 font-semibold text-xl" onSubmit={handleSignup}>
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
                    <div className="relative">
                        <input
                            id="password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            onFocus={() => setConfirmPPasswordFocused(true)}   // Handle focus
                            onBlur={() => setConfirmPPasswordFocused(false)}   // Handle blur
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-black rounded-lg shadow-xl focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        {!confirmPasswordFocused && !confirmPassword &&
                            <div className="absolute left-5 top-3.5 transform text-gray-500">
                                <i className="fas fa-lock  mr-2" />
                                <span>Confirm password</span>
                            </div>}
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-5 top-3.5 text-gray-500"
                        >
                            {showConfirmPassword ? (
                                <i className="fas fa-eye-slash" />
                            ) : (
                                <i className="fas fa-eye" />
                            )}
                        </button>
                    </div>
                    <div className="flex w-full">
                        <select className="w-full border border-black rounded-lg shadow-xl focus:outline-none focus:ring focus:ring-blue-300 h-12 px-2"
                            value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <option className="text-gray-500" value="" disabled>🌍 Select your country</option>
                            {countries.map((country, index) => 
                                <option key={index} value={country}>{country}</option>
                            )}
                        </select>
                    </div>
                    <button
                        disabled={!email || !password || !confirmPassword || !selectedCountry || loading}
                        type="submit"
                        className={`w-full px-4 py-2 border-2 border-black shadow-xl rounded-lg ${!email || !password || !confirmPassword || !selectedCountry || loading ? 'text-gray-500 bg-black mix-blend-overlay' : 'text-black bg-[#61dafb] hover:bg-sky-300'} `}
                    >
                        Register
                    </button>
                    <div className="flex flex-col sm:flex-row gap-2 justify-start px-2">
                        <a href="/login" className="text-gray-300 hover:text-blue-700 ">
                            <i className="fa fa-chevron-left mr-2" ></i>Back to login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;