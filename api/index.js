import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/configDB.js'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import listingRoute from './routes/listingRoute.js'
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config()
connectDb()

const __dirname = path.resolve()

const app = express()
const port = process.env.PORT || 7000;


//middleware
app.use(express.json())
app.use(cookieParser())

app.listen(port, () => {
    console.log(`server start on port ${port}`)
})

//routes
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/listing', listingRoute)


 app.use(express.static(path.join(__dirname, '/client/dist')));

 app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
 });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})




