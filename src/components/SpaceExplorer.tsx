'use client'

import { Backdrop, FlyControls, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import './SpaceExplorer.css';

// USEFUL FUNCTIONS
// -> useHelper function from drei
// TODO: use Leva to change speed and stuff -> animation control -> https://youtu.be/vTfMjI4rVSI?si=GhXC8vnDlvnhjLi_&t=3756
// TODO get textures from https://planetpixelemporium.com/earth.html OR https://www.solarsystemscope.com/textures/ and make planets look like planets :)
// TODO create earth: https://matiasgf.dev/experiments/earth
// TODO https://github.com/matiasngf/portfolio/tree/main/packages/experiments/earth

interface PlanetProps {
  name: string;
  color: string;
  velocity: number;
  distance: number;
  size: number;
  orbitingAround?: string; //TODO: later: THREE.Object3D;
}

// RENDER ONE PLANET / CELESTIAL OBJECT
// --------------------------------
const Planet = ({name, color, velocity, size, distance, orbitingAround}:PlanetProps) => {
  
  // set constants for scaling etc.
  const systemScale = 0.1; // factor for scaling of sizes
  const scaledDiameter = size / 10000;
  const speedFactor = 0.01;

  console.log("RENDERING: " + name);

  // ADD ANIMATION -> The ref must be present in the <mesh ref={}> so next knows where it points to
  const planetRef = useRef<THREE.Mesh>(); 
  const textRef = useRef<THREE.Text>();

  // STATES -> HOVER + CLICKED 
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  let angle = 0; // -> angle between the last frame and the current frame, initialize as 0
  
   // set the position it is circling around according to the orbitingAround-prop
   // if no orbitingAround is defined set center to be the sun.
   // TODO: replace the absolute position with a function that retrieves the current position of the 
   // planet passed in the orbitingAround property. planet should be a THREE.Object3D object
   let position = [0,0,0];
   if (!orbitingAround || orbitingAround === 'sun') position = [0,distance/10,0]

  // info on the useFrame function:
  // state: a lot of information about camera, mouse position etc.
  //        can be printed in the console to investigate
  // delta: difference between this frame and the last frame
  useFrame((state,  delta) => {     
    if (!isClicked ) { // only move when no planet is clicked -> TODO: planets jump around and the other planets do keep moving :(
      // increment the angle based on time passed (delta) 
      angle += delta * velocity * speedFactor;  

      // calculate the new x and y positions for the orbit (circular movement)
      const x = Math.cos(angle) * distance * systemScale; // distance is the radius of the circular orbit
      const y = Math.sin(angle) * distance * systemScale;
      const z = 0; // change later

      if (planetRef.current) {
        // update the planet position
        planetRef.current.position.set(x,y,z);
      
        // rotate the planet around itself
        planetRef.current.rotation.y += delta;
      }

      // TEXT REF -> ALWAYS FACE THE CAMERA
      if (textRef.current) {
        textRef.current.position.set(0, scaledDiameter/10 + 1, 0); // Adjust the y position to offset the text above the planet
        textRef.current.lookAt(state.camera.position);
      }
    }
  })

   // TODO: add texture and stuff

  return (
    
      <mesh 
        ref={planetRef} // reference for the animation
        onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
        onPointerLeave={() => (setIsHovered(false))} 
        onClick={() => setIsClicked(!isClicked)} 
      > 

      {/* event.stopPropagation() means that the event is contained only to the mesh and no other element in the application cares about this event. */} 
        {/* A icosahedronGeometry might be more apt performance wise -> less polygons */}
        <icosahedronGeometry 
            detail={12} 
            args={[scaledDiameter / 10 , 2]} 
            position={position}
        />
        
        {/* IF IT IS THE SUN -> MAKE IT WOBBLE */}
        { name.toLowerCase() === 'sun' ? 
              <MeshWobbleMaterial 
                speed={isHovered? 0.8 : 0.4} 
                factor={isHovered? 0.6 : 0.2} 
                color={isHovered ? 'orangered' : 'yellow'}
                emissive={isHovered ? 'orange' : 'yellow'} // make it shine
                emissiveIntensity={1}
              /> 
              : 
              <meshStandardMaterial 
                color={isHovered ? 'orange' : 'lightblue'}  
              />
        } 

        {/* PLANET LABEL conditional rendering*/}
        {
           {/*isClicked || isHovered*/}  ? 
            <Text 
              ref={textRef} // have a reference so the text can always face the camera
              position={[0, 0, 0]} 
              color="white" 
              fontSize={1} 
              anchorX="center"
            >
              {name}
            </Text> 
          : 
            '' // do nothing
        };
      </mesh>

  );
}

// THIS IS NOT ACCURATE DATA, JUST MOCK DATA
const planets = [
  {
    name: "Sun",
    color: 'yellow',
    position: 0,
    image: "",
    velocity: 27,
    distance: 0,
    size: 1392000,  // Diameter in kilometers
    description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process."
  }, 
  {
    name: "Mercury",
    color: 'purple',
    position: 1,
    image: "",
    velocity: 47.4, // km/s
    distance: 57.9, // millions of kilometers
    size: 4879,  // Diameter in kilometers
    description: "Mercury is the smallest planet in our solar system and is closest to the sun."
  },
  {
    name: "Venus",
    color: 'red',
    position: 2,
    image: "",
    velocity: 35,
    distance: 108,
    size: 12104,  // Diameter in kilometers
    description: "Venus is the second planet from the sun and is the hottest planet in the solar system."
  },
  {
    name: "Earth",
    color: 'blue',
    position: 3,
    image: "",
    velocity: 29.8,
    distance: 149.6,
    size: 12742,  // Diameter in kilometers
    description: "The Earth is the only known planet to support life and is home to a diverse range of ecosystems."
  },
  {
    name: "Mars",
    color: 'red',
    position: 4,
    image: "",
    velocity: 24,
    distance: 227,
    size: 6779,  // Diameter in kilometers
    description: "Mars is the fourth planet from the sun and is a potential candidate for supporting life."
  },
  {
    name: "Jupiter",
    color: 'beige',
    position: 5,
    image: "",
    velocity: 13.1,
    distance: 778.3,
    size: 139820,  // Diameter in kilometers
    description: "Jupiter is the largest planet in our solar system and is a gas giant."
  },
  {
    name: "Saturn",
    color: 'orange',
    position: 6,
    image: "",
    velocity: 9.7,
    distance: 1427,
    size: 116460,  // Diameter in kilometers
    description: "Saturn is a gas giant planet known for its stunning ring system."
  },
  {
    name: "Uranus",
    color: 'turquoise',
    position: 7,
    image: "",
    velocity: 6.8,
    distance: 2870,
    size: 50724,  // Diameter in kilometers
    description: "Uranus is an ice giant planet that is tilted on its side."
  },
  {
    name: "Neptune",
    color: 'red',
    position: 8,
    image: "",
    velocity: 5.4,
    distance: 4497,
    size: 49244,  // Diameter in kilometers
    description: "Neptune is the farthest planet from the sun and is also an ice giant."
  }
];

const SpaceExplorer = () => {

  return (
    <div className="space-canvas-container">
      <Canvas>

        {/* SET THE DEFAULT CAMERA */}
        <PerspectiveCamera
          makeDefault // !!!
          position={[0, 0, 100]}
          fov={100} // field of view
        />

        {/* ORBIT CONTROLS */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={false}
        />

        {/* SET THE LIGHTS */}

          {/* render all celestial objects that turn around the sun */}
              {
                planets.map((planet) => (
                  <>
                      <Planet 
                        orbitingAround={'sun'} 
                        name={planet.name} 
                        color ={planet.color} 
                        velocity={planet.velocity} 
                        size={planet.size} 
                        distance={planet.distance}
                      />
                  </>
                ))
              }

        </Canvas>
      </div>
  );
};

export default SpaceExplorer;