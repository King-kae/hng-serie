import express from 'express'
import geoip from "geoip-lite"
import ip from "ip"
import bodyParser from 'body-parser'
const app = express()
const PORT = 3000
app.use(express.json())
app.use(bodyParser.json())
app.set('trust proxy', true)

app.get('/', (req, res) => {
    // const clientIp = req.socket.remoteAddress;
    const clientIp = ip.address();
    const geo = geoip.lookup(clientIp);
    const myIp = "207.97.227.239"
    const geo2 = geoip.lookup(myIp)
    console.log(clientIp)
    console.log(geo)
    console.log(geo2.city)
    res.status(200).send({
        
        client_ip: clientIp,
        location: `${geo}`,
        location2: `${geo2.city}`,
        greeting: `Hello, ${req.query.visitor_name}!`
    })
})

  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})