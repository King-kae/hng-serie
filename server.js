import express from 'express'
import axios from 'axios';
import ip from "ip"
import dotenv from "dotenv";
dotenv.config();



const app = express()
const PORT = 3000
const API_KEY = process.env.API_KEY



app.use(express.json())
app.set('trust proxy', true)


app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if(clientIp ===  "::1" || clientIp === "127.0.0.1") {
        clientIp = "8.8.4.4"
    }
    try {
    const geoResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${clientIp}`);
        const location = geoResponse.data.location.tz_id || 'Unknown';
        const temperature = geoResponse.data.current.temp_c;
        const realLocation = location.split("/")[1] 

        const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${realLocation}`;


        // return console.log(clientIp)
        res.json({
            client_ip: clientIp,
            location: realLocation,
            greeting: greeting
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

