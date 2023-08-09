const { Expo } = require('expo-server-sdk');

const infraHandler = async (req, res) => {

  let expo = new Expo();
  let messages = [];
  
  messages.push({
      to: 'ExponentPushToken[zNEVG1GGFcWDi2OHMqZJGQ]',
      title: `New infrastructure issue: ${req.body.record.type}`,
      sound: 'default',
      body: req.body.record.details,
  })

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk[0]);
      res.send(ticketChunk[0]);
    }
  })();

};

module.exports = infraHandler;