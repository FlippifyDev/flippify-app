import { Hamster, StackLoader, HoverBox, TypeWriter } from "./LoadingAnimations";

type AnimationType = "hamster" | "stack-loader" | "hover-box" | "typewriter"


interface LoadingAnimationProps {
    text: string
    type: AnimationType
}


const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text, type }) => {
    return (
        <div className="w-full h-full flex justify-center items-center flex-col gap-10">
            <div>
                {type === "hamster" && <Hamster />}
                {type === "stack-loader" && <StackLoader />}
                {type === "hover-box" && <HoverBox />}
                {type === "typewriter" && <TypeWriter />}
            </div>
            <div className=''>
                {text}
            </div>
        </div>
    );
};



export default LoadingAnimation
