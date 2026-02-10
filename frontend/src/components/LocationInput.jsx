
import { useState, useEffect, useRef } from 'react';

// default cities fallback if needed, but we prefer dynamic
const DEFAULT_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
    "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"
];

export default function LocationInput({
    value,
    onChange,
    placeholder,
    icon,
    options = [] // New prop for dynamic options
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Use options if provided, else fallback (or empty)
    const sourceList = options.length > 0 ? options : DEFAULT_CITIES;

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const userInput = e.target.value;
        onChange(userInput);

        if (userInput.length > 0) {
            const filtered = sourceList.filter(
                city => typeof city === 'string' && city.toLowerCase().includes(userInput.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full group" ref={wrapperRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">{icon}</span>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-primary-dark focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                value={value}
                onChange={handleInputChange}
                onFocus={() => value && setShowSuggestions(true)}
                required
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((city, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSuggestion(city)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 flex items-center gap-2"
                        >
                            <span className="text-gray-400">📍</span>
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
