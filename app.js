const port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

const log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

const server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            if (req.url === '/') {
                console.log("env : ", process.env.DATABASE_URL)
                log('Received a message.');
                return res.json({ message: process.env.DATABASE_URL })
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            res.end();
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Hello Bidpoint V1.0" }));
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
