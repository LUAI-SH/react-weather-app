import http from "./httpService";
import config from "../config.json";

function getPosition() {
  if (!navigator.geolocation) return "Location not Allowed";
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

export default async function getLocation() {
  const { coords } = await getPosition();
  const { latitude: lat, longitude: lon } = coords;
  
  const { data } = await http.get(
    `${config.reverseGeo.endpoint}${lat},${lon}&key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }`
  );
  console.log(data);
  const fullAddress = data.plus_code.compound_code;
  let address = fullAddress.split(" ");
  address = `${address[1]}, ${address[2]}`;
  address = address.slice(0, -1);
  console.log(address);
  return address;
}
