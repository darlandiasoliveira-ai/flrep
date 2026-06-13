const https = require('https');
https.get('https://en.wikipedia.org/w/api.php?action=query&titles=File:Bandeira_de_Sergipe.svg|File:Bandeira_de_Alagoas.svg&prop=imageinfo&iiprop=url&format=json', { headers: { 'User-Agent': 'Nodejs/1.0' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log(data));
});
