import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Page Transition Wrapper
 * Adds smooth fade and slide animations when navigating between pages
 */
const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.4,
                ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smooth feel
            }}
        >
            {children}
        </motion.div>
    );
};

PageTransition.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageTransition;
