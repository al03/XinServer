const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080});

printIP("8080");

var storage = {
	data : []
};

var sourceWS;


wss.on('connection', function connecton(ws) {

	console.log("new connection");

	ws.on('message', function incoming(message) {

		if (this.sourceWS == null){
			this.sourceWS = ws;
			return;
		}

		console.log('received: %s', message);
		storage.data.push(message);
		console.log('data: %s',storage.data);
		ws.send(storage.data.toString());
		//console.log(sourceWS);
		
		wss.clients.forEach(function each(client){
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});
	var json = JSON.stringify(storage.data);
	ws.send(json);
});


function printIP(port) {
	var ip = require("ip");
	console.log("server is: %s:%s", ip.address(), port);
	
}


