export default function checkLocationPermission() {
  return new Promise((resolve, reject) => {
    if (!navigator.permissions)
      // Permission API was not implemented
      return reject(new Error("Permission API is not supported"));

    // Permission API is implemented
    navigator.permissions.query({ name: "geolocation" }).then(
      permission => {
        const { state } = permission;
        resolve(state);
      }
    );
  });
}
