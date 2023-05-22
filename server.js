const express = require('express')

const { connectToDb } = require('./lib/mongo')
const { getImageInfoById } = require('./models/image')

const app = express()
const port = process.env.PORT || 8000

app.get('/', (req, res, next) => {
    res.status(200).sendFile(__dirname + '/index.html')
})

app.get('/images/:id', async (req, res, next) => {
    try {
        const image = await getImageInfoById(req.params.id)
        if (image) {
            res.status(200).send(image)
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})

app.use('*', (req, res, next) => {
    res.status(404).send({
        err: "Path " + req.originalUrl + " does not exist"
    })
})

/*
 * This route will catch any errors thrown from our API endpoints and return
 * a response with a 500 status to the client.
 */
app.use('*', (err, req, res, next) => {
    console.error("== Error:", err)
    res.status(500).send({
        err: "Server error.  Please try again later."
    })
})

connectToDb(() => {
    app.listen(port, () => {
        console.log("== Server is running on port", port)
    })
})
