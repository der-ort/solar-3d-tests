import { Billboard, MeshWobbleMaterial, Outlines, Ring, Text, useTexture } from "@react-three/drei";
import { Vector3, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import * as THREE from 'three';


interface PlanetProps {
    name: string;
    velocity: number;
    distance: number;
    size: number;
    textureURL?: string;
    color: string;
    orbitingAround?: Vector3; //TODO: later: THREE.Object3D;
  }

  
// USEFUL FUNCTIONS
// -> useHelper function from drei
// TODO: use Leva to change speed and stuff -> animation control -> https://youtu.be/vTfMjI4rVSI?si=GhXC8vnDlvnhjLi_&t=3756
// TODO get textures from https://planetpixelemporium.com/earth.html OR https://www.solarsystemscope.com/textures/ and make planets look like planets :)
// TODO create earth: https://matiasgf.dev/experiments/earth
// TODO https://github.com/matiasngf/portfolio/tree/main/packages/experiments/earth


// RENDER ONE PLANET / CELESTIAL OBJECT
// --------------------------------
const Planet = ({name, textureURL, velocity, size, distance, orbitingAround}:PlanetProps) => {
  
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

     let position = new THREE.Vector3(0,0,0);
     if (!orbitingAround ) position = new THREE.Vector3(0, distance * systemScale, 0)
  
    // TODO MOVE THE ANIMATION TO A HIGHER LEVEL! SO IT CAN BE STOPPED GLOBALLY!
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
      const texturePath = 'textures/' + textureURL
      
      console.log(texturePath)

      const colorMap = useTexture(texturePath)
  
    return (<>
        <mesh 
          ref={planetRef} // reference for the animation
          onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
          onPointerLeave={(event) => (event.stopPropagation(),setIsHovered(false))} 
          onClick={() => setIsClicked(!isClicked)} 
        > 

        {/* event.stopPropagation() means that the event is contained only to the mesh and no other element in the application cares about this event. */} 
          {/* A icosahedronGeometry might be more apt performance wise -> less polygons */}
          <icosahedronGeometry 
              args={[scaledDiameter , 12]} 
          />
                   
                   
          {/*------------------------------------------------ 
             IF IT IS THE SUN -> MAKE IT WOBBLE 
          ------------------------------------------------ */}

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
          
          {/*------------------------------------------------ 
             GLOW EFFECT
             TODO FIX THAT THE GLOW IS APPLIED TO EVERYTHING IN THE MESH -> UNTANGLE THE MESH
          ------------------------------------------------ */}

          {/* <EffectComposer>
            <Bloom 
              intensity={1} 
              luminanceThreshold={0} 
              luminanceSmoothing={1} 
              height={300}
            />
          </EffectComposer> */}
  
          {/*------------------------------------------------ 
             PLANET LABEL with conditional rendering
          ------------------------------------------------ */}
          {
             !isClicked || !isHovered  ? 
              <mesh>
                <Billboard>
                  <Text 
                    ref={textRef} // have a reference so the text can always face the camera
                    position={[0, -(scaledDiameter / 2) - 0.5, 0]} // show the label below the planet
                    color="darkgrey" 
                    fontSize={0.6} 
                    anchorX="center"
                  >
                    {name}
                  </Text> 
                </Billboard>
              </mesh>
            : 
              null // do nothing
          };
  
        {/*------------------------------------------------ 
          A RING THAT ACTS AS A BOUNDING BOX 
          TODO give it a transparent material and make it the clickable bounding box 
          TODO {give it the DREI Outline effect} 
          ------------------------------------------------*/}
        { name.toLowerCase() !== 'sun' ? 
            <mesh>
            <Billboard> {/* MAKE IT FACE THE CAM ALWAYS*/}
              <Ring
                ref={boundingRingRef}
                args={[scaledDiameter+2.8, scaledDiameter+3, 32]} 
              /> 
              <Outlines thickness={0.1} color="white" />
            </Billboard>
            <meshStandardMaterial opacity={0} color={'black'}/>
            </mesh>
          : 
            <Outlines thickness={0.1} color="red" />
        }     
        </mesh>
        </>
    );
  }

  export default Planet;