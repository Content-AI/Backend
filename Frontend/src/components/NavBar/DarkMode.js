import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { _dark_mode_ } from '../../features/DarkMode';
import LoadingPage from '../LoadingPage';
import LightIcon from './Icon/LightIcon';
import DarkIcon from './Icon/DarkIcon';

const DarkMode = () => {
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize darkMode from localStorage or default to false
        return localStorage.getItem('DarkMode') === 'true';
    });
    const [loadStateForDarkMode, setloadStateForDarkMode] = useState(false);

    let DarkModeState = useSelector((state) => state.SetDarkMode.DarkMode);

    const handleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        dispatch(_dark_mode_(newDarkMode));
        localStorage.setItem('DarkMode', newDarkMode);
    };

    useEffect(() => {
        if (DarkModeState === null) {
            setloadStateForDarkMode(false);
        } else {
            document.body.classList.toggle("dark", darkMode);
        }
    }, [darkMode]);

    return (
        <>
            <button
                className="w-[30px]"
                onClick={handleDarkMode}
            >
                {loadStateForDarkMode
                    ? <LoadingPage />
                    : (
                        darkMode
                            ? <LightIcon />
                            : <DarkIcon />
                    )
                }
            </button>
        </>
    );
};

export default DarkMode;
