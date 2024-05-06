// type definitions:

import { Vector3 } from "three";

type PlanetType = {
    name: string;
    color: string;
    position: Vector3;
    velocity: number;
    distance: number;
    size: number;
    textureURL?: string;
    orbitCenter: Vector3; // should be a pointer to another previously created THREE Object, REPRESENTS THE PARENT (like the earth is the parent of the moon/luna)
    description: string;
}

export { PlanetType };