import PropTypes from 'prop-types';
import { cn } from '../../utils/helpers';

/**
 * Button Component with multiple variants and lift effect
 * Designed with "human touch" - slightly tilts on hover
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl border-none cursor-pointer
    transition-all duration-250
    transform hover:-translate-y-0.5 hover:shadow-lg
    active:translate-y-0 active:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

    const variants = {
        primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-400
    `,
        secondary: `
      bg-neutral-100 text-neutral-700
      border border-neutral-200
      hover:bg-neutral-200 hover:border-neutral-300
      focus:ring-neutral-400
    `,
        ghost: `
      bg-transparent text-neutral-600
      hover:bg-neutral-100 hover:text-neutral-900
      focus:ring-neutral-400
    `,
        accent: `
      bg-accent-500 text-white
      hover:bg-accent-600
      focus:ring-accent-400
    `,
        danger: `
      bg-error text-white
      hover:bg-red-700
      focus:ring-red-400
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-7 py-3.5 text-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'accent', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
