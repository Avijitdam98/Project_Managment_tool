import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

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
            <Card className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8">
                <CardHeader className="text-center">
                    <div className="flex justify-center">
                        <Logo />
                    </div>
                    <CardTitle className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Or{" "}
                        <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                            Create an Account
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="pl-10"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    required
                                    className="pl-10 pr-10"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {passwordVisible ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        By signing in, you agree to our{" "}
                        <Link to="/terms" className="font-medium text-primary hover:text-primary/90">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="font-medium text-primary hover:text-primary/90">
                            Privacy Policy
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;