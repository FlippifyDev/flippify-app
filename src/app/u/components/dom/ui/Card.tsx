interface CardProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
    return (
        <div className={`w-full bg-white rounded-lg shadow ${className}`}>
            <h2 className="text-black text-lg font-semibold border-b py-3 px-4">{title}</h2>
            <div className="p-4">
                {children}
            </div>
        </div>
    )
}

export default Card
