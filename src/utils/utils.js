
const request = require('request');

const geoCode = (address, callback) => {
    const gurl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoic2hpdmFtc2hhcm1hMTkiLCJhIjoiY2trdzg4dnVqMjQ0dTJucW5iMzUyc3Q5ZyJ9.MjV8SEAaPvrvM-kDxbi0-w`;


    request({ url: gurl, json: true }, (error, response) => {
        if (error) {
            callback("Unable to access geocode", undefined);
        }
        else if (response.body.features.length === 0) {
            callback("Unable to find location (may be input missing)", undefined);
        }
        else {

            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }

    });
}



const weather = (latitude, longitude, callback) => {

    const wurl = `http://api.weatherstack.com/current?access_key=9bd98147c6457f9ce7e79fb6d56e8a03&query=${latitude},${longitude}"`;

    request({ url: wurl, json: true }, (error, response) => {

        if (error) {
            callback("Unable to access the weather service", undefined);
        }
        else if (response.body.error) {
            console.log("Unable to find location (may be input missing)", undefined)
        }
        else {

            callback(undefined, response.body);
        }


    })

}

module.exports = { geoCode, weather };