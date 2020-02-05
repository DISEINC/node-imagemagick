var sys = require('sys'),
    fs = require('fs'),
    im = require('../index.js'),
	path = require('path');

var image_path = path.normalize(__dirname + '/img.jpg');
var imdata = fs.readFileSync(image_path, 'binary');

im.identify(image_path, function(err, features){
  if (err) return console.error(err.stack || err);

  if (features.geometry !== '1024x786+0+0')
    throw 'Could not load geometry';
  if (features.width !== 1024)
    throw 'Could not load width';
  if (features.height !== 786)
    throw 'Could not load height';

  console.log('Identify on path ok!');
})

im.identify({data:imdata}, function(err, features){
  if (err) return console.error(err.stack || err);

  if (features.geometry !== '1024x786+0+0')
    throw 'Could not load geometry';
  if (features.width !== 1024)
    throw 'Could not load width';
  if (features.height !== 786)
    throw 'Could not load height';

  console.log('Identify on buffer ok!');
})

im.readMetadata(image_path, function(err, metadata){
  if (err) return console.error(err.stack || err);
  console.log('metadata: '+sys.inspect(metadata));
})

im.readMetadata({data:imdata}, function(err, metadata){
  if (err) return console.error(err.stack || err);
  console.log('metadata: '+sys.inspect(metadata));
})

var timeStarted = new Date;
im.resize({
  srcPath: image_path,
  dstPath: image_path+'.resized.jpg',
  width: 256
}, function(err, stdout, stderr){
  if (err) return console.error(err.stack || err);
  console.log('real time taken for convert: '+((new Date)-timeStarted)+' ms')
  im.identify(['-format', '%b', image_path+'.resized.jpg'], function(err, r){
    if (err) throw err;
    console.log('size: '+r.substr(0,r.length-2)+' Bytes');
  })
})

timeStarted = new Date;
im.resize({
  srcData: imdata,
  width: 256
}, function(err, stdout, stderr){
  if (err) return console.error(err.stack || err);
  console.log('real time taken for convert (with buffers): '+((new Date)-timeStarted)+' ms');
  fs.writeFileSync(image_path+'.resized-io.jpg', stdout, 'binary');
  console.log('size: '+stdout.length+' Bytes');
})
