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
        const clientIp2 = ip.address();
        const geoResponse = await axios.get(` http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${clientIp}`);
        const location = geoResponse.data.location.tz_id || 'Unknown';
        const temperature = geoResponse.data.current.temp_c;
        const realLocation = location.split("/")[1] 

        const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${realLocation}`;


        // console.log(geoResponse.data)
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

