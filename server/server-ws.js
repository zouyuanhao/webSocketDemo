
let webSocketServer = new (require('ws')).Server({ port: (3000) }),
    webSockets = {}; // userID: webSocket

// CONNECT /:userID
// wscat -c ws://localhost:3000/1

webSocketServer.on('connection', function (webSocket, req) {
    let userID = parseInt(req.url.substr(1), 10);
    console.log('---客户端链接成功----userID-------', userID,);
    webSockets[userID] = webSocket;
    // console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))

    // Forward Message
    //
    // Receive               Example
    // [toUserID, text]       {"to":12345,"type":"ttttt","from":"","message":"我要发给unity..."}
    //
    // Send                  Example
    // [fromUserID, text]    {"to":12345,"type":"ttttt","from":123,"message":"我要发给unity..."}
    webSocket.on('message', function (message) {
        // console.log('received from ' + userID + ': ' + message);
        var messageObj = JSON.parse(message);
        if (messageObj.to) {
            var toUserWebSocket = webSockets[messageObj.to];
            if (toUserWebSocket) {
                messageObj['from'] = userID;
                console.log('sent to ' + messageObj.to + ': ' + JSON.stringify(messageObj));
                toUserWebSocket.send(JSON.stringify(messageObj));
            } else {
                messageObj['error'] = "要发送的客户端不在线";
                messageObj['from'] = userID;
                console.log('sent to ' + userID + ': ' + JSON.stringify(messageObj));
                webSocket.send(JSON.stringify(messageObj));
            }
        } else {
            messageObj['error'] = "服务端收到数据，要发送的客户端to为空";
            messageObj['from'] = userID;
            console.log('sent to ' + userID + ': ' + JSON.stringify(messageObj));
            webSocket.send(JSON.stringify(messageObj));
        }
    })

    webSocket.on('close', function () {
        delete webSockets[userID];
        console.log('deleted: ' + userID);
    })
})

