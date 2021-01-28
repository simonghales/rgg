import React from "react"

const Lights: React.FC = () => {
    return (
        <>
            <ambientLight intensity={0.8}/>
            <directionalLight shadowMapHeight={1024} shadowMapWidth={1024} position={[5, 5, 5]}/>
        </>
    )
}

export default Lights