'use client'

import { Backdrop, Billboard, FlyControls, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Outlines, PerspectiveCamera, Ring, Stars, Text, Trail, useSpriteLoader, useTexture } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';
import './SpaceExplorer.css';
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// USEFUL FUNCTIONS
// -> useHelper function from drei
// TODO: use Leva to change speed and stuff -> animation control -> https://youtu.be/vTfMjI4rVSI?si=GhXC8vnDlvnhjLi_&t=3756
// TODO get textures from https://planetpixelemporium.com/earth.html OR https://www.solarsystemscope.com/textures/ and make planets look like planets :)
// TODO create earth: https://matiasgf.dev/experiments/earth
// TODO https://github.com/matiasngf/portfolio/tree/main/packages/experiments/earth

interface PlanetProps {
  name: string;
  color?: string;
  velocity: number;
  distance: number;
  size: number;
  textureURL?: string;
  orbitingAround?: string; //TODO: later: THREE.Object3D;
}

// RENDER ONE PLANET / CELESTIAL OBJECT
// --------------------------------
const Planet = ({name, color, textureURL, velocity, size, distance, orbitingAround}:PlanetProps) => {
  
  // set constants for scaling etc.
  const systemScale = 0.1; // factor for scaling of sizes
  const scaledDiameter = size / 100000;
  const speedFactor = 0.01;

  console.log("RENDERING: " + name);

  // ADD ANIMATION -> The ref must be present in the <mesh ref={}> so next knows where it points to
  const planetRef = useRef<THREE.Mesh>(); 
  const textRef = useRef<THREE.Mesh>();
  const boundingRingRef = useRef<THREE.Mesh>();

  // STATES -> HOVER + CLICKED 
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  

  let angle = 0; // -> angle between the last frame and the current frame, initialize as 0
  
   // set the position it is circling around according to the orbitingAround-prop
   // if no orbitingAround is defined set center to be the sun.
   // TODO: replace the absolute position with a function that retrieves the current position of the 
   // planet passed in the orbitingAround property. planet should be a THREE.Object3D object
   let position = [0,0,0];
   if (!orbitingAround || orbitingAround === 'sun') position = [0,distance * systemScale,0]

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

    }
  })
   /* TODO REPOSITION THE CAMERA AND FACE THE OBJECT WHEN CLICKED */

   // TODO: add more shaders for halos and stuff
    const colorMap = useTexture('public/' + textureURL ? textureURL.toString() : '2k_earth_nightmap.jpg')

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
            args={[scaledDiameter , 12]} 
        />
        
        {/* IF IT IS THE SUN -> MAKE IT WOBBLE */}
        { name.toLowerCase() === 'sun' ? 
              <MeshWobbleMaterial 
                speed={isHovered? 0.5 : 0.4} 
                factor={isHovered? 0.2 : 0.1} 
                map={colorMap} 
                // color={isHovered ? 'orangered' : 'yellow'}
                emissive={'orange'} // make it shine
                emissiveIntensity={isHovered ? 0.6 : 0.6}
                opacity={0.3}
              /> 
              : 
              <meshStandardMaterial 
                // color={isHovered ? 'orange' : 'lightblue'}
                map={colorMap} 
                emissive={'white'} 
                emissiveIntensity={0.3}
              />
        } 

        { /* ADD A GLOW EFFECT*/}
        <EffectComposer>
          <Bloom 
            intensity={1} 
            luminanceThreshold={0} 
            luminanceSmoothing={1} 
            height={300}
          />
        </EffectComposer>

        {/* PLANET LABEL conditional rendering*/}
        {
           !isClicked || !isHovered  ? 
            <Billboard>
            <Text 
              ref={textRef} // have a reference so the text can always face the camera
              position={[0, 0, 0]} 
              color="darkgrey" 
              fontSize={1} 
              anchorX="center"
            >
              {name}
            </Text> 
            </Billboard>
          : 
            null // do nothing
        };

      {/* TODO ADD A RING AROUND THE PLANET TO MAKE IT MORE EASILY CLICKABLE */}
       {/*TODO give it a transparent material and make it the clickable bounding box */}
      {/* TODO {give it the DREI Outline effect} */}
      { name.toLowerCase() !== 'sun' ? 
          <>
          <Billboard> {/* MAKE IT FACE THE CAM ALWAYS*/}
            <Ring
              ref={boundingRingRef}
              args={[scaledDiameter+3, scaledDiameter+3.1, 32]} 
            /> 
          </Billboard>
          </>
        : 
          <Outlines thickness={0.1} color="red" />
      }     
      </mesh>
  );
}

// THIS IS NOT ACCURATE DATA, JUST MOCK DATA
const planets = [
  {
    name: "Sun",
    color: 'yellow',
    position: 0,
    textureURL: "2k_sun.jpg",
    velocity: 27,
    distance: 0,
    size: 1392000 * 0.1,  // Diameter in kilometers
    description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process."
  }, 
  {
    name: "Mercury",
    color: 'purple',
    position: 1,
    textureURL: "2k_mercury.jpg",
    velocity: 47.4, // km/s
    distance: 57.9, // millions of kilometers
    size: 4879,  // Diameter in kilometers
    description: "Mercury is the smallest planet in our solar system and is closest to the sun."
  },
  {
    name: "Venus",
    color: 'red',
    position: 2,
    textureURL: "2k_venus_atmosphere.jpg",
    velocity: 35,
    distance: 108,
    size: 12104,  // Diameter in kilometers
    description: "Venus is the second planet from the sun and is the hottest planet in the solar system."
  },
  {
    name: "Earth",
    color: 'blue',
    position: 3,
    textureURL: "2k_earth_daymap.jpg",
    velocity: 29.8,
    distance: 149.6,
    size: 12742,  // Diameter in kilometers
    description: "The Earth is the only known planet to support life and is home to a diverse range of ecosystems."
  },
  {
    name: "Mars",
    color: 'red',
    position: 4,
    textureURL: "2k_mars.jpg",
    velocity: 24,
    distance: 227,
    size: 6779,  // Diameter in kilometers
    description: "Mars is the fourth planet from the sun and is a potential candidate for supporting life."
  },
  {
    name: "Jupiter",
    color: 'beige',
    position: 5,
    textureURL: "2k_jupiter.jpg",
    velocity: 13.1,
    distance: 778.3,
    size: 139820,  // Diameter in kilometers
    description: "Jupiter is the largest planet in our solar system and is a gas giant."
  },
  {
    name: "Saturn",
    color: 'orange',
    position: 6,
    textureURL: "2k_saturn.jpg",
    velocity: 9.7,
    distance: 1427,
    size: 116460,  // Diameter in kilometers
    description: "Saturn is a gas giant planet known for its stunning ring system."
  },
  {
    name: "Uranus",
    color: 'turquoise',
    position: 7,
    textureURL: "2k_uranus.jpg",
    velocity: 6.8,
    distance: 2870,
    size: 50724,  // Diameter in kilometers
    description: "Uranus is an ice giant planet that is tilted on its side."
  },
  {
    name: "Neptune",
    color: 'red',
    position: 8,
    textureURL: "2k_neptune.jpg",
    velocity: 5.4,
    distance: 4497,
    size: 49244,  // Diameter in kilometers
    description: "Neptune is the farthest planet from the sun and is also an ice giant."
  }
];

const SpaceExplorer = () => {

  // create Camera Reference:
  const cameraRef = useRef<THREE.Camera>();

  // ----------------------------------------------------------------
  // RENDER THE SCENE
  // ----------------------------------------------------------------
  
  return (
    <div className="space-canvas-container">
      <Canvas>

        {/* SET THE DEFAULT CAMERA */}
        <PerspectiveCamera 
          makeDefault // !!!
          position={[0, 0, 500]}
          fov={50} // field of view
        />

        {/* ORBIT CONTROLS */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />

        {/* ADD STARS (NATIVE DREI COMPONENT) */}
        <Stars 
          radius={500} 
          depth={200} 
          count={5000}  
          saturation={0} 
          fade 
          speed={1} 
        />

        <pointLight 
          position={[0,0,0]} 
          intensity={1.5} 
        />

        {/* SET THE LIGHTS */}
        <ambientLight 
          color={'yellow'} 
          intensity={1} 
        />
          {/* render all celestial objects that turn around the sun */}
              {
                planets.map((planet) => (
                  <>

                      {/* ORBIT -> TODO export to external function: drawOrbit(planetObject) */}
                      <mesh>
                        <ringGeometry 
                          position={[0,0,0]}
                          color={planet.color}             
                          args={[planet.distance*0.1, planet.distance*0.1+0.2, 128]} 
                        />
                        <meshBasicMaterial color={planet.color} />
                      </mesh>
                      {/* TRAIL */}
                      <Trail
                        width={5} // Width of the line
                        color={'white'} // Color of the line
                        length={1} // Length of the line
                        decay={0.2} // How fast the line fades away
                        local={true} // Wether to use the target's world or local positions
                        stride={0} // Min distance between previous and current point
                        interval={1} // Number of frames to wait before next calculation
                        target={undefined} // Optional target. This object will produce the trail.
                        // attenuation={(width) => width} // A function to define the width in each point along it.
                      >
                        <Planet 
                          orbitingAround={'sun'} 
                          name={planet.name} 
                          color ={planet.color} 
                          velocity={planet.velocity} 
                          size={planet.size} 
                          distance={planet.distance}
                          textureURL={planet.textureURL}
                        />
                      </Trail>
                  </>
                ))
              }

        </Canvas>
      </div>
  );
};

export default SpaceExplorer;