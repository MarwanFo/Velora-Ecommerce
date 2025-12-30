import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PageTransition from '../components/common/PageTransition';
import { ROUTES } from '../constants/config';

/**
 * Register Page
 * User registration with beautiful Velora design and smooth animations
 */
const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            await register(formData);
            navigate(ROUTES.home);
        } catch (error) {
            // Handle validation errors - api.js returns error.response.data directly for 422
            if (error.errors) {
                setErrors(error.errors);
            } else if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
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
                                Create your account
                            </h2>
                            <p className="text-neutral-600">
                                Join Velora and discover handcrafted treasures
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
                                label="Full name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                placeholder="John Doe"
                                required
                                icon={({ className }) => (
                                    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            />

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

                            <Input
                                label="Confirm password"
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation}
                                placeholder="••••••••"
                                required
                            />

                            {/* Terms */}
                            <p className="text-xs text-neutral-500">
                                By creating an account, you agree to our{' '}
                                <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                                    Privacy Policy
                                </Link>
                            </p>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
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

                        {/* Sign In Link */}
                        <p className="text-center text-neutral-600">
                            Already have an account?{' '}
                            <Link
                                to={ROUTES.login}
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Sign in instead
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Image/Illustration */}
                <motion.div
                    className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-secondary-50 via-neutral-50 to-accent-50 overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="max-w-lg">
                            <div className="mb-8">
                                <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4 transform -rotate-1">
                                    Join our community
                                </span>
                            </div>
                            <h3 className="text-4xl font-serif font-medium text-neutral-950 mb-4">
                                Start your journey with <span className="text-primary-600 italic">Velora</span>
                            </h3>
                            <ul className="space-y-3 text-neutral-600">
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Exclusive access to handcrafted collections</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Early access to new arrivals and sales</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Personalized recommendations just for you</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 right-20 w-32 h-32 bg-accent-200 rounded-full opacity-40 blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-200 rounded-full opacity-30 blur-2xl" />
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Register;
