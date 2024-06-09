import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'



const PageAnimantionWrapper = ({ children, keyValue, initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 1.45 }, className }) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default PageAnimantionWrapper
