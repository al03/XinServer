const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

printIP("8080");
console.log('waitting for source client connect')

var storage = {
    data: []
};

var sourceWS;


wss.on('connection', function connecton(ws) {

    console.log("new connection");
        if (this.sourceWS == null) {
            this.sourceWS = ws;
            startHTTPServer();
        }


    ws.on('message', function incoming(message) {


        console.log('received: %s', message);
        storage.data.push(message);
        console.log('data: %s', storage.data);
        ws.send(storage.data.slice(-1)[0].toString());
        //console.log(sourceWS);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    ws.send(storage.data.slice(-1)[0]);


});


function printIP(port) {
    var ip = require("ip");
    console.log("server is: %s:%s", ip.address(), port);

}


function startHTTPServer() {
    var http = require('http');
    var fs = require('fs');
    var url = require('url');

    http.createServer(function(request, response) {

        fs.readFile('./www/index.html', function(err, data) {
            if (err) {
                console.log(err);
                response.writeHead(404, { 'Content-Type': 'text/html' });
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });

                response.write(data.toString());
            }
            response.end();
        });
    }).listen(8081);

    console.log('open browser at : http://localhost:8081');
}
