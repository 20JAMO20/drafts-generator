export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>https://backuponcall.com/boc.mp3</Play>
</Response>`);
}