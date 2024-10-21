//url where api is located
let url = 'https://api.wheretheiss.at/v1/satellites/25544'

//variables for latitude, longitude and time
let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeISSLocation = document.querySelector('#time')

//variables which control update speed and max connect attempts
let update = 10000
let maxFailedAttempts = 3

//creates variable and information for custom ISS marker
let issMarker
let issIcon = L.icon({
    iconURL: "video_code\\iss\\iss_icon.png", //I keep getting an error which says "iconUrl not set in Icon options" and I don't understand why this is happening, I had the same error in my previous project which is why I had to use an absolute file location
    iconSize: [50, 50],
    iconAnchor: [25,25]
})

//creates map
let map= L.map('iss-map').setView([0,0],1)

//sets tiles and adds to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copywrite">OpenStreetMap</a>'    
}).addTo(map);

//calls function with maxFailedAttempts
iss(maxFailedAttempts) //call function one time to start
//setInterval(iss, update) // 10 seconds

//function to connect to ISS API
function iss(attempts){

    if(attempts <=0){
        alert('Attempted to contact ISS server, or some other error, possibly related to a bad icon link. Failed after three attempts.') //if more than 3 failed attempts error alert shown
        return;
    }
    fetch(url).then((res) => { //fetches url variable then returns json from url
        return res.json()
    }).then((issData)=>{ //uses issData variable to access information from json data retrieved from API
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        // sets lat and long to query-selectors set above
        issLat.innerHTML = lat
        issLong.innerHTML = long

        //create marker if it doesn't exist
        //move if it exists
        if(!issMarker){
            issMarker = L.marker([lat,long], {icon: issIcon}).addTo(map)
        }else{
            issMarker.setLatLng([lat,long])
        }
        // sets date information to a variable then applies it to query-selector variable
        let now = Date()
        timeISSLocation.innerHTML = `This information was fetched at ${now}.`

    }).catch((err)=> {
        attempts--
        console.log('error', err) //generic error catch which displays error
    }).finally( () => {
        setTimeout(iss, update, attempts) //runs regardless of fetch success, timesout if attempts reaches less than 0
    })
}