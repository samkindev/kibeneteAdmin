
export function getLocation(cb) {
    navigator.geolocation.getCurrentPosition(position => {
        cb(null, position);
    }, error => {
        console.log("err: " + error.message);
        cb(error.message, null);
    });
}
