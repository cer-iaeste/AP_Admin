import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Back from "../../global/Back";
import { useNavigate } from "react-router-dom";
import { confirmModalWindow } from "../../global/Global";
import { CountryType, UserType } from "../../types/types";
import AuthService from "../../service/AuthService";
import FormButtons from "../card/FormButtons";

interface AddUserProps {
  countries: CountryType[]
  users: UserType[]
}

const AddUser: React.FC<AddUserProps> = ({ countries, users }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isChanged, setIsChanged] = useState(false)
  const [change, setChange] = useState(false)
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [validCountries, setValidCountries] = useState<String[]>([])
  const [usedEmails, setUsedEmails] = useState<String[]>([])


  useEffect(() => {
    const resultEmails: string[] = []
    const countryCount: Record<string, number> = {}

    const countryNames = countries.map(country => country.name)

    users.forEach(user => {
      resultEmails.push(user.email)
      if (countryNames.includes(user.country))
        countryCount[user.country] = (countryCount[user.country] || 0) + 1
    })
    setUsedEmails(resultEmails)

    const filteredCountries = Object.entries(countryCount)
      .filter(([_, count]) => count < 3)
      .map(([country]) => country)

    setValidCountries(filteredCountries)
    setIsLoading(false)
  }, [countries, users])

  useEffect(() => {
    setIsChanged(email && password && confirmPassword && selectedCountry ? true : false)
  }, [email, password, confirmPassword, selectedCountry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setData: (data: string) => void): void => {
    setData(e.target.value)
    setChange(true)
  }

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, setEmail)

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, setPassword)

  const handleConfirmPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, setConfirmPassword)

  const handlCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    handleInputChange(e, setSelectedCountry)


  const onCancel = async () => {
    const confirmation = await confirmModalWindow("All unsaved changes will be lost. Are you sure?");
    if (confirmation) {
      setEmail("");
      setPassword("")
      setConfirmPassword("")
      setSelectedCountry("");
      setChange(false); // Reset change indicator
      setIsChanged(false); // Reset save button state
      navigate("/users"); // Navigate back to countries list
    }
  };


  const onSave = async () => {
    setIsLoading(true)
    if (usedEmails.includes(email)) {
      toast.error("Email already in use!")
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const signupPromise = AuthService.signup(email, password, selectedCountry);
      toast.promise(signupPromise, {
        pending: "Registering...",
        success: {
          render() {
            navigate("/users");
            return "Registration successful!";
          }
        },
        error: {
          render() {
            return "Error while registering!";
          }
        }
      });

    } catch (error) {
      toast.error("Failed to add user.");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <section className="bg-sky-50 min-h-screen text-[#1B75BB] px-10 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col justify-center text-center md:text-left relative">
          <Back confirmationNeeded={change} />

          <span className="font-semibold text-3xl lg:text-4xl mt-20">Add a new user</span>
          <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start">
            <i className="fa fa-circle-info mr-3 text-2xl"></i>
            <span>A country can have maximum up to 3 users.</span>
          </div>
        </div>
        <form className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center">
          {/* Email Field */}
          <div className="grid grid-cols-4 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-3 md:p-4 w-full">
            <div className="flex-shrink-0 text-lg font-semibold text-gray-700 flex items-center gap-x-2 sm:w-auto justify-center md:justify-start">
              <i className="fa-solid fa-envelope mr-2 text-blue-600"></i>
              <span className="hidden md:block">Email address</span>
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailInput}
              placeholder="your.email@example.com"
              required
              className="col-span-3 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Password Field */}
          <div className="grid grid-cols-4 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-3 md:p-4 w-full">
            <label htmlFor="password" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-lock text-blue-600"></i> Password
            </label>
            <div className="relative col-span-3 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordInput}
                required
                placeholder="Enter your password"
                className="w-full"
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

          {/* Confirm Password Field */}
          <div className="grid grid-cols-4 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-3 md:p-4 w-full">
            <label htmlFor="confirmPassword" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-lock text-blue-600"></i> Confirm password
            </label>
            <div className="relative col-span-3 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordInput}
                required
                placeholder="Confirm your password"
                className="w-full"
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

          {/* Region Select Field */}
          <div className="grid grid-cols-4 items-center rounded-lg transition-colors duration-200 border-b border-gray-100 p-3 md:p-4 w-full">
            <div className="flex-shrink-0 text-lg font-semibold text-gray-700 flex items-center gap-x-2 sm:w-auto justify-center md:justify-start">
              <i className="fa-solid fa-globe mr-2 text-blue-600"></i>
              <span className="hidden md:block">Country</span>
            </div>
            <select
              name="region"
              value={selectedCountry}
              onChange={handlCountryChange}
              required
              className="col-span-3 text-input w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="" disabled>Select a Country</option>
              {validCountries.map((country, index) => (
                <option key={index} value={country.toString()}>{country}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <FormButtons isChanged={isChanged} isLoading={isLoading} onSave={onSave} onCancel={onCancel} />
    </section>
  );
};

export default AddUser;
