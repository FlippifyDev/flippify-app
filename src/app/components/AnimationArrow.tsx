import React from 'react'

interface AnimationArrowProps {
    className?: string
}

const AnimationArrow:React.FC<AnimationArrowProps> = ({ className }) => {
	return (
		<svg
			width="20"
			height="20"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
            className={`${className}`}
		>
			<path
				d="M7 6l4 4-4 4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				className="transition-transform duration-300 transform translate-x-0 group-hover:translate-x-1"
			/>
			<path
				d="M6 10h8"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				className="transition-transform duration-200 transform origin-left scale-x-0 group-hover:scale-x-100"
			/>
		</svg>
	)
}

export default AnimationArrow
