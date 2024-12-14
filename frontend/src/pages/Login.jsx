import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import Eye Icons


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success('Login successful!');
        } catch (err) {
            // Error is handled by the error useEffect
        }
    };

    const Logo = () => (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5"/>
                    <stop offset="100%" stopColor="#7C3AED"/>
                </linearGradient>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34D399"/>
                    <stop offset="100%" stopColor="#6EE7B7"/>
                </linearGradient>
                <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E0E7FF"/>
                    <stop offset="100%" stopColor="#CBD5E1"/>
                </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#logoGradient)"/>
            <g stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 16v32M32 16v32M46 16v32" stroke="#CBD5E1" strokeWidth="1.5"/>
                <rect x="20" y="20" width="10" height="8" rx="2" fill="url(#cardGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <rect x="34" y="20" width="10" height="8" rx="2" fill="url(#cardGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <rect x="20" y="32" width="10" height="8" rx="2" fill="url(#accentGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <rect x="34" y="32" width="10" height="8" rx="2" fill="url(#cardGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <rect x="20" y="44" width="10" height="8" rx="2" fill="url(#cardGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <rect x="34" y="44" width="10" height="8" rx="2" fill="url(#accentGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>
                <path d="M25 28v4" stroke="url(#accentGradient)" strokeDasharray="2 2"/>
                <path d="M39 30v2" stroke="#CBD5E1" strokeDasharray="2 2"/>
                <path d="M39 42v2" stroke="#CBD5E1" strokeDasharray="2 2"/>
                <circle cx="24" cy="39" r="1.5" fill="url(#accentGradient)"/>
                <circle cx="38" cy="24" r="1.5" fill="url(#accentGradient)"/>
            </g>
        </svg>
    );


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border dark:border-gray-700">
                <div className="flex justify-center">
                    <Logo/>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-semibold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        New to our platform?{' '}
                        <Link to="/register" className="font-medium text-blue-500 hover:text-blue-600">
                            Create an Account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                         <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                           <input
                                id="password"
                                name="password"
                                type={passwordVisible ? "text" : "password"} // Toggle type
                                required
                                className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                           />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                            >
                            {passwordVisible ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 cursor-pointer" />
                                ) : (
                                <FaEye className="h-5 w-5 text-gray-400 cursor-pointer" />
                                )}
                            </button>
                         </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;