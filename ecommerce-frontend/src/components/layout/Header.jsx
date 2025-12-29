import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES, APP_CONFIG } from '../../constants/config';

/**
 * Header Component - Main navigation for the store
 * Features sticky header with organic design feel
 */
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const cartItemCount = 0; // Will be connected to cart context

    return (
        <header className="sticky top-0 z-50 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Logo */}
                    <Link
                        to={ROUTES.home}
                        className="flex items-center gap-2 group"
                    >
                        <span className="text-2xl lg:text-3xl font-serif font-medium text-neutral-950 group-hover:text-primary-600 transition-colors">
                            {APP_CONFIG.name}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link
                            to={ROUTES.home}
                            className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors relative group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            to={ROUTES.products}
                            className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors relative group"
                        >
                            Shop
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            to="/categories"
                            className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors relative group"
                        >
                            Categories
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                        </Link>
                        <Link
                            to="/about"
                            className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors relative group"
                        >
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                            aria-label="Search products"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Wishlist */}
                        <Link
                            to={ROUTES.wishlist}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all hidden sm:block"
                            aria-label="View wishlist"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </Link>

                        {/* Cart */}
                        <Link
                            to={ROUTES.cart}
                            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                            aria-label="View cart"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <Link
                            to={ROUTES.account}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all hidden sm:block"
                            aria-label="Account"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar (Toggle) */}
                {isSearchOpen && (
                    <div className="pb-4 animate-fade-in">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full px-4 py-3 pl-12 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                                autoFocus
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="lg:hidden bg-neutral-50 border-t border-neutral-200 animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                        <Link
                            to={ROUTES.home}
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to={ROUTES.products}
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/categories"
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Categories
                        </Link>
                        <Link
                            to="/about"
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <hr className="border-neutral-200 my-2" />
                        <Link
                            to={ROUTES.account}
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My Account
                        </Link>
                        <Link
                            to={ROUTES.wishlist}
                            className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Wishlist
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;
