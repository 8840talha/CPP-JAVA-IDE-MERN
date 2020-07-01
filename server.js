var express = require('express')

var app = express();
var cors = require('cors')



var request = require('request')
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Acces-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods',
            'PUT,PATCH,POST,DELETE,GET'
        )
        return res.status(200).json({});
    }
    next();

})


app.post('/codeCheck', (req, res) => {
    console.log('me')
    console.log(req.body.body)
    req.body = req.body.body;
    req.body.script = JSON.parse(JSON.stringify(req.body.script))
    var program = {
        "script": req.body.script,
        "language": req.body.language,
        "versionIndex": req.body.versionIndex,
        "stdin": req.body.stdin,
        "clientId": req.body.clientId,
        "clientSecret": req.body.clientSecret

    };

    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    },
        function (error, response, body) {

            if (error) {
                console.log(error)
                return res.status(500).json({ error: error, success: false })

            }
            if (response.body.memory !== null && response.body.cpuTime !== null) {
                console.log(response.body.output)
                res.status(200).json({ data: response.body, success: true })

            } else {
                res.status(400).json({ data: '', error: response.body.output })

                console.log(response.body.output)
            }
        });
})
if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
}

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log('server.running on', PORT)
})


