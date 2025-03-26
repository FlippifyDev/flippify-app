import "@/styles/loading/stack-loader.css"
import "@/styles/loading/hamster.css"
import "@/styles/loading/hover-box.css"
import "@/styles/loading/typewriter.css"

// From: https://uiverse.io/Nawsome/wet-mayfly-23
export const Hamster = () => {
    return (
        <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
            <div className="wheel"></div>
            <div className="hamster">
                <div className="hamster__body">
                    <div className="hamster__head">
                        <div className="hamster__ear"></div>
                        <div className="hamster__eye"></div>
                        <div className="hamster__nose"></div>
                    </div>
                    <div className="hamster__limb hamster__limb--fr"></div>
                    <div className="hamster__limb hamster__limb--fl"></div>
                    <div className="hamster__limb hamster__limb--br"></div>
                    <div className="hamster__limb hamster__limb--bl"></div>
                    <div className="hamster__tail"></div>
                </div>
            </div>
            <div className="spoke"></div>
        </div>
    )
}


// From: https://uiverse.io/csozidev/weak-bulldog-22
export const StackLoader = () => {
    return (
        <div className="loader">
            <div className="box box-1">
                <div className="side-left"></div>
                <div className="side-right"></div>
                <div className="side-top"></div>
            </div>
            <div className="box box-2">
                <div className="side-left"></div>
                <div className="side-right"></div>
                <div className="side-top"></div>
            </div>
            <div className="box box-3">
                <div className="side-left"></div>
                <div className="side-right"></div>
                <div className="side-top"></div>
            </div>
            <div className="box box-4">
                <div className="side-left"></div>
                <div className="side-right"></div>
                <div className="side-top"></div>
            </div>
        </div>
    )
}


// From: https://uiverse.io/Juanes200122/great-starfish-26
export const HoverBox = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="200" width="200">
            <g style={{ order: -1 }}>
                <polygon
                    transform="rotate(45 100 100)"
                    strokeWidth="1"
                    stroke="#2f85e0"
                    fill="none"
                    points="70,70 148,50 130,130 50,150"
                    id="bounce"
                ></polygon>
                <polygon
                    transform="rotate(45 100 100)"
                    strokeWidth="1"
                    stroke="#2f85e0"
                    fill="none"
                    points="70,70 148,50 130,130 50,150"
                    id="bounce2"
                ></polygon>
                <polygon
                    transform="rotate(45 100 100)"
                    strokeWidth="2"
                    stroke=""
                    fill="#414750"
                    points="70,70 150,50 130,130 50,150"
                ></polygon>
                <polygon
                    strokeWidth="2"
                    stroke=""
                    fill="url(#gradiente)"
                    points="100,70 150,100 100,130 50,100"
                ></polygon>
                <defs>
                    <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
                        <stop
                            style={{ stopColor: "#1e2026", stopOpacity: 1 }}
                            offset="20%"
                        />
                        <stop
                            style={{ stopColor: "#414750", stopOpacity: 1 }}
                            offset="60%"
                        />
                    </linearGradient>
                </defs>
                <polygon
                    transform="translate(20, 31)"
                    strokeWidth="2"
                    stroke=""
                    fill="#2777c1"
                    points="80,50 80,75 80,99 40,75"
                ></polygon>
                <polygon
                    transform="translate(20, 31)"
                    strokeWidth="2"
                    stroke=""
                    fill="url(#gradiente2)"
                    points="40,-40 80,-40 80,99 40,75"
                ></polygon>
                <defs>
                    <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
                        <stop
                            style={{ stopColor: "#4a90e200", stopOpacity: 1 }}
                            offset="20%"
                        />
                        <stop
                            style={{ stopColor: "#4a90e254", stopOpacity: 1 }}
                            offset="100%"
                            id="animatedStop"
                        />
                    </linearGradient>
                </defs>
                <polygon
                    transform="rotate(180 100 100) translate(20, 20)"
                    strokeWidth="2"
                    stroke=""
                    fill="#4a90e2"
                    points="80,50 80,75 80,99 40,75"
                ></polygon>
                <polygon
                    transform="rotate(0 100 100) translate(60, 20)"
                    strokeWidth="2"
                    stroke=""
                    fill="url(#gradiente3)"
                    points="40,-40 80,-40 80,85 40,110.2"
                ></polygon>
                <defs>
                    <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
                        <stop
                            style={{ stopColor: "#4a90e200", stopOpacity: 1 }}
                            offset="20%"
                        />
                        <stop
                            style={{ stopColor: "#4a90e254", stopOpacity: 1 }}
                            offset="100%"
                            id="animatedStop"
                        />
                    </linearGradient>
                </defs>
                <polygon
                    transform="rotate(45 100 100) translate(80, 95)"
                    strokeWidth="2"
                    stroke=""
                    fill="#a3d5ff"
                    points="5,0 5,5 0,5 0,0"
                    id="particles"
                ></polygon>
                <polygon
                    transform="rotate(45 100 100) translate(80, 55)"
                    strokeWidth="2"
                    stroke=""
                    fill="#7fb3e6"
                    points="6,0 6,6 0,6 0,0"
                    id="particles"
                ></polygon>
                <polygon
                    transform="rotate(45 100 100) translate(70, 80)"
                    strokeWidth="2"
                    stroke=""
                    fill="#e6f5ff"
                    points="2,0 2,2 0,2 0,0"
                    id="particles"
                ></polygon>
                <polygon
                    strokeWidth="2"
                    stroke=""
                    fill="#1a2b3c"
                    points="29.5,99.8 100,142 100,172 29.5,130"
                ></polygon>
                <polygon
                    transform="translate(50, 92)"
                    strokeWidth="2"
                    stroke=""
                    fill="#102a43"
                    points="50,50 120.5,8 120.5,35 50,80"
                ></polygon>
            </g>
        </svg>

    )
}


// From: https://uiverse.io/Nawsome/kind-mole-87
export const TypeWriter = () => {
    return (
        <div className="typewriter">
            <div className="slide"><i></i></div>
            <div className="paper"></div>
            <div className="keyboard"></div>
        </div>
    )
}
