const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),

   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'gz', // Change the default file extension
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'appendFile',
  path = require('path');

// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

 // Change the limits according to your response size
//app.use(bodyParser.json({limit: '50mb', extended: true}));
//app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.use(bodyParser.raw({ limit: '10gb', type: 'application/octet-stream' }));
app.use(bodyParser.urlencoded({ limit: '10gb', extended: false })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filename = 'downloadedFile' //`${req.body.requestName}${uniqueIdentifier || ''}`,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    options = req.body.options || undefined;

  console.log('Saving file: ',filePath);
 // console.log('Saving req.body: ',atob(req.body));
     fs[fsMode](filePath, atob(req.body), 'binary', (err) => {

    if (err) {
      console.log(err);
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  });
});

app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});