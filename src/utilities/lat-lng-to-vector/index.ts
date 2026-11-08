import { Vector3 } from "three";
import { radians } from "@/utilities/radians";

/**
 * A point on a sphere of radius `r`. Longitude 0 faces the camera (+z), so
 * `rotation.y = -lng` brings a longitude to the front and `rotation.x = lat` centres a latitude.
 */
export function latLngToVector(lat: number, lng: number, r = 1): Vector3 {
  const la = radians(lat);
  const ln = radians(lng);
  return new Vector3(r * Math.cos(la) * Math.sin(ln), r * Math.sin(la), r * Math.cos(la) * Math.cos(ln));
}
