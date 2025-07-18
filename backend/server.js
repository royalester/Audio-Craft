const express = require('express');
const cors = require('cors');
const { Vonage } = require('@vonage/server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Vonage (Nexmo) credentials
const vonage = new Vonage({
  apiKey: '088f9878',
  apiSecret: 'vBxVjlkn5jeCeFkX'
});

const from = 'Audio Craft'; // or your virtual number
const to = '639618179619'; // PH number without '+', or use '+639618179619'

app.post('/notify-owner', (req, res) => {
  const { name, phone, email, date, packageName, message } = req.body;
  const sms = `New rental inquiry from ${name}\nPhone: (${phone})\nEmail: ${email}\nDate: ${date}\nPackage: ${packageName}\nMessage: ${message}`;

  vonage.sms.send({to, from, text: sms})
    .then(resp => {
      if (resp.messages[0].status === "0") {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: resp.messages[0]['error-text'] });
      }
    })
    .catch(err => {
      console.error('Vonage error:', err);
      res.status(500).json({ error: err.message });
    });
});

app.listen(3001, () => console.log('SMS server running on port 3001'));