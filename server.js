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
    try {
        const visitorName = req.query.visitor_name || 'Guest';
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const clientIp2 = await axios.get(`https://api-bdc.net/data/client-ip`);
        const ipAddress = clientIp2.data.ipString
        const geoResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${ipAddress}`);
        const location = geoResponse.data.location.tz_id || 'Unknown';
        const temperature = geoResponse.data.current.temp_c;
        const realLocation = location.split("/")[1] 

        const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${realLocation}`;


        // return console.log(clientIp2.data.ipString)
        res.json({
            client_ip: ipAddress,
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

