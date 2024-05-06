import { Vector3 } from "three";
import { PlanetType } from "./planet_def";

// THIS IS NOT ACCURATE DATA, JUST MOCK DATA
export const planets:PlanetType[] = [
  {
    name: "Sun",
    color: 'yellow',
    position: new Vector3(0, 0, 0),
    textureURL: "2k_sun.jpg",
    velocity: 27,
    distance: 0,
    orbitCenter: new Vector3(0, 0, 0),
    size: 1392000 * 0.1,  // Diameter in kilometers
    description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process."
  }, 
  {
    name: "Mercury",
    color: 'purple',
    position: new Vector3(57.9, 0, 0),
    textureURL: "2k_mercury.jpg",
    velocity: 47.4, // km/s
    distance: 57.9, // millions of kilometers
    orbitCenter: new Vector3(0, 0, 0),
    size: 4879,  // Diameter in kilometers
    description: "Mercury is the smallest planet in our solar system and is closest to the sun."
  },
  {
    name: "Venus",
    color: 'red',
    position: new Vector3(108, 0, 0),
    textureURL: "2k_venus_atmosphere.jpg",
    velocity: 35,
    distance: 108,
    orbitCenter: new Vector3(0, 0, 0),
    size: 12104,  // Diameter in kilometers
    description: "Venus is the second planet from the sun and is the hottest planet in the solar system."
  },
  {
    name: "Earth",
    color: 'blue',
    position: new Vector3(149.6, 0, 0),
    textureURL: "2k_earth_daymap.jpg",
    velocity: 29.8,
    distance: 149.6,
    orbitCenter: new Vector3(0, 0, 0),
    size: 12742,  // Diameter in kilometers
    description: "The Earth is the only known planet to support life and is home to a diverse range of ecosystems."
  },
  {
    name: "Mars",
    color: 'red',
    position: new Vector3(227, 0, 0),
    textureURL: "2k_mars.jpg",
    velocity: 24,
    distance: 227,
    orbitCenter: new Vector3(0, 0, 0),
    size: 6779,  // Diameter in kilometers
    description: "Mars is the fourth planet from the sun and is a potential candidate for supporting life."
  },
  {
    name: "Jupiter",
    color: 'beige',
    position: new Vector3(778.3, 0, 0),
    textureURL: "2k_jupiter.jpg",
    velocity: 13.1,
    distance: 778.3,
    orbitCenter: new Vector3(0, 0, 0),
    size: 139820,  // Diameter in kilometers
    description: "Jupiter is the largest planet in our solar system and is a gas giant."
  },
  {
    name: "Saturn",
    color: 'orange',
    position: new Vector3(1427, 0, 0),
    textureURL: "2k_saturn.jpg",
    velocity: 9.7,
    distance: 1427,
    orbitCenter: new Vector3(0, 0, 0),
    size: 116460,  // Diameter in kilometers
    description: "Saturn is a gas giant planet known for its stunning ring system."
  },
  {
    name: "Uranus",
    color: 'turquoise',
    position: new Vector3(2870, 0, 0),
    textureURL: "2k_uranus.jpg",
    velocity: 6.8,
    distance: 2870,
    orbitCenter: new Vector3(0, 0, 0),
    size: 50724,  // Diameter in kilometers
    description: "Uranus is an ice giant planet that is tilted on its side."
  },
  {
    name: "Neptune",
    color: 'red',
    position: new Vector3(4497, 0, 0),
    textureURL: "2k_neptune.jpg",
    velocity: 5.4,
    distance: 4497,
    orbitCenter: new Vector3(0, 0, 0),
    size: 49244,  // Diameter in kilometers
    description: "Neptune is the farthest planet from the sun and is also an ice giant."
  }
];