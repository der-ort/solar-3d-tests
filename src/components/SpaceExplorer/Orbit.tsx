import { PlanetType } from "./planet_def";

interface OrbitProps {
    name?: string;
    orbitsAround: string; //should be a pointer to an actual three.js object later!
    distanceFromParent: number;
    thickness: number;
    orbitCenter: PlanetType;
    color: string;
}

const Orbit = ({name, orbitCenter, distanceFromParent, thickness, color}:OrbitProps) => {

    const systemScale = 0.1; {/*take this from the state!*/}

    console.log("RENDERING ORBIT: " + name);

    return (
        <mesh>
            <ringGeometry 
                position={orbitCenter.position}
                color={color}             
                args={[distanceFromParent * 0.1,
                       distanceFromParent * 0.1 + thickness, 
                       128]} 
                />
                <meshBasicMaterial color={color} />
        </mesh>
    )
}

export default Orbit;