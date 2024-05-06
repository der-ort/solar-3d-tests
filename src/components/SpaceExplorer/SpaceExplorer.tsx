'use client'

import {  OrbitControls, PerspectiveCamera, Stars, Trail } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';
import './SpaceExplorer.css';
import { planets } from "./mockPlanets";
import Planet from "./Planet";
import Orbit from "./Orbit";
import { PlanetType } from "./planet_def";


function renderAllCelestialObjects(celestialObjects: PlanetType[]) {
    return (
    celestialObjects.map((planet) => (
      <>
          {/* ORBIT - draw a circle representing the orbit 
              TODO make the orbit elliptical and make the planet follow the path of this object!
          */}
          <Orbit
            orbitCenter={planet.orbitCenter}
            color={planet.color}
            thickness={0.1}
            distanceFromParent={planet.distance}
          />

          {/* TRAIL -> a line that follows the planet to show its path... not necessary...*/}
          <Trail
            width={1} 
            color={'pale'}
            length={5}
            decay={3} // How fast the line fades away
            local={true} // Wether to use the target's world or local positions
            stride={0} // Min distance between previous and current point
            interval={1} // Number of frames to wait before next calculation
            target={undefined} // Optional target. This object will produce the trail.
            // attenuation={(width) => width} // A function to define the width in each point along it.
          >
            {/* RENDER THE PLANET / CELESTIAL OBJECT ITSELF  */}
            <Planet 
              orbitingAround={new THREE.Vector3(0,0,0)} // TODO make this an actual pointer to an object on the canvas! now it is set to 0,0,0 (the sun)
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
  )
  }


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
          {renderAllCelestialObjects(planets)}

        </Canvas>
      </div>
  );
};

export default SpaceExplorer;