var app = require('app');

var BrowserWindow = require('browser-window');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  app.commandLine.appendSwitch('js-flags', '--harmony_collections');

  var height = 550;
  if (process.platform == 'win32')
    height += 60;
  else if (process.platform == 'linux')
    height += 30;

  mainWindow = new BrowserWindow({ width: 800, height: height, center:true, title:"Notes" });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

});
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}
// In browser.
var ipc = require('ipc');
var fs = require("fs");
var dir = "/home/krizzmp/Notes";
function search(file, arg) {
    var g = arg.split(" ");
    return g.every(function(st){
        var g = (read(file).toLowerCase()+file);
        //console.log(g);
        return g.contains(st);
    })
}
function read(file){
    var s = fs.readFileSync(dir+"/"+file,{encoding:'utf8'});
    //console.log(s);
    return s;
}
ipc.on('get-files', function(event, arg) {
    //console.log(arg);  // prints "ping"
    fs.readdir(dir, function(e,files){
        if (e) throw e;
        var f = files.filter(function(file){
            return fs.statSync(dir+"/"+file).isFile() && file.substr(-4)==".txt";
        });
        var f3 = f.filter(function(file){
            return search(file,arg);
        });
        var f2 = f3.map(function(file){
            return [file,fs.statSync(dir+"/"+file).mtime.toDateString()];
        });
        event.sender.send('send-files', f2);
    });

});
ipc.on('get-file', function(event, file) {
    //console.log(arg);  // prints "ping"
    event.sender.send('send-file', read(file));

});
ipc.on('write-file',function(event, path_file){
    //console.log(path_file[0]);
    fs.writeFile(dir+"/"+path_file[0], path_file[1], function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
});
ipc.on("quit",function(){
   app.quit();
});
