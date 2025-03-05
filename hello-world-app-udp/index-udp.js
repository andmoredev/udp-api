const dgram = require('dgram');
const net = require('net');

// Define the UDP and TCP ports
const port = 53;

// UDP server setup
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  console.log(`UDP message received: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`);
  // Optionally send a response
  const responseMessage = 'Hello from UDP server!';
  console.log(`Hello from UDP server!`);

  const messages = [
    msg.toString(),
    'Hello from UDP server! 1111',
    'Hello from UDP server! 2222',
    'Hello from UDP server! 3333',
  ];

  udpServer.send('WHAT IS HAPPENING', rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error('Error sending UDP response:', err);
    }
  });

  // messages.forEach((message) => {
  //   setTimeout(() => {
  //     console.log(`Sending UDP response: ${message}`);

  //     udpServer.send(message, rinfo.port, rinfo.address, (err) => {
  //       if (err) {
  //         console.error('Error sending UDP response:', err);
  //       }
  //     });
  //   }, 200);
  // });

  // console.log(`Sending UDP response: ${responseMessage}`);

  // udpServer.send(responseMessage, rinfo.port, rinfo.address, (err) => {
  //   if (err) {
  //     console.error('Error sending UDP response:', err);
  //   }
  // });
});

udpServer.on('error', (err) => {
  console.error('UDP Server error:', err);
});

udpServer.bind(port, '0.0.0.0', () => {
  console.log(`UDP server listening on port ${port}`);
});

// TCP server setup for health checks
const tcpServer = net.createServer((socket) => {
  // console.log('TCP connection established for health check');
  socket.end(); // Close the connection immediately since it's only a health check
});

tcpServer.on('error', (err) => {
  console.error('TCP Server error:', err);
});

tcpServer.listen(port, '0.0.0.0', () => {
  console.log(`TCP server listening on port ${port}`);
});