/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var messages = [];
var fs = require('fs');

var key = 1;

exports.handleRequest = function (request, response) {

  var headers = defaultCorsHeaders;

  if(request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    return(response.end());
  }

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  headers['Content-Type'] = 'application/json';
  response.writeHead(statusCode, headers);

  if (request.url === '/1/classes/chatterbox/') {

    if (request.method === 'GET') {
      response.end(JSON.stringify(messages));

    } else if (request.method === 'POST') {
      var message = '';

      request.addListener('data', function(data){
        message += data.toString();
      });

      request.addListener('end', function() {
        var messageObject = JSON.parse(message);

        messageObject.createdAt = new Date();
        messageObject.objectID = ++key;
        messages.push(messageObject);

        response.end(JSON.stringify(messageObject));
      });

    }
  } else {
    fs.readFile('../client/index.html', function (err, html) {
      if (err) {
        throw err;
      }
      console.log(html);
      response.writeHeader(200, {'Content-Type': 'text/html'});  // <-- HERE!
      response.write(html);
      response.end();

    });

    //sresponse.end("Nothing here!");
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 60 // Seconds.
};
