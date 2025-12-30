import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PageTransition from '../components/common/PageTransition';
import { ROUTES } from '../constants/config';

/**
 * Login Page
 * Beautiful, human-touch design for user authentication with smooth animations
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await login({
                email: formData.email,
                password: formData.password,
                remember: formData.remember,
            });
            navigate(ROUTES.home);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'Login failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex">
                {/* Left Side - Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {/* Logo */}
                        <Link to={ROUTES.home} className="inline-block mb-8">
                            <h1 className="text-3xl font-serif font-medium text-neutral-950">Velora</h1>
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-serif font-medium text-neutral-950 mb-2">
                                Welcome back
                            </h2>
                            <p className="text-neutral-600">
                                Sign in to your account to continue shopping
                            </p>
                        </div>

                        {/* Error Message */}
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-start gap-2"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.general}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                required
                                icon={({ className }) => (
                                    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                )}
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                                required
                            />

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 transition-colors"
                                    />
                                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                                        Remember me
                                    </span>
                                </label>

                                <Link
                                    to={ROUTES.forgotPassword}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-neutral-50 text-neutral-500">Or</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-neutral-600">
                            Don't have an account?{' '}
                            <Link
                                to={ROUTES.register}
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Create one now
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Image/Illustration */}
                <motion.div
                    className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="max-w-lg text-center">
                            <h3 className="text-4xl font-serif font-medium text-neutral-950 mb-4">
                                Handcrafted goods, <span className="text-primary-600 italic">curated with care</span>
                            </h3>
                            <p className="text-lg text-neutral-600">
                                Discover unique pieces from artisans around the world. Each item tells a story.
                            </p>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 right-20 w-32 h-32 bg-primary-200 rounded-full opacity-40 blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-200 rounded-full opacity-30 blur-2xl" />
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Login;
