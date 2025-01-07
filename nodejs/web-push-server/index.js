const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Replace with your own VAPID keys
const VAPID_PUBLIC_KEY = "BHCstLUaRnN7ATTgaIYBUaBBWfPOi_wwJPE5Z5SxkQ6wERzm6n6pdY6UBrr3YEmf2ppPaFSLuHi7YrnXXJ5RjZQ";
const VAPID_PRIVATE_KEY = "IrZLgGks4nymSMG94i8EcmBEfSZR2R8cA9Dl4DjNvvs";

webPush.setVapidDetails(
    'mailto:ksos73@nate.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);


app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    subscriptions.push(subscription);
    console.log('Subscritption added:', subscription);

    res.status(201).json({message: 'Subsbritption successful'});
});

app.post('/send-notification', (req, res) => {
    const {title, body} = req.body;

    console.log('send-notification');

    const notificationPayload = JSON.stringify({
        title: title || 'Default Title',
        body: body || 'Default Message',
    });

    console.log('send-notification');
    const promises = subscriptions.map((subscription) => 
        webPush
            .sendNotification(subscription, notificationPayload)
            .catch((err) => console.error('Error sending notifiaction:', ret))
    );

    console.log('send-notification');
    Promise.all(promises)
        .then(() => res.status(200).json({message: 'Notifications sent'}))
        .catch((err) => res.status(500).json({ error: err.message}));
});

app.get('/vapid-public-key', (req, res) => {
    res.json({publickey : VAPID_PUBLIC_KEY});
});

app.listen(PORT, () => {
    console.log(`Server ruuning on http://localhost:${PORT}`);
})