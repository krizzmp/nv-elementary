var ipc = require('ipc');
var $  = require('./jquery-2.1.1.js');
//var ace  = require('./src-noconflict/ace');
var ul = $(".sidebar > ul");
var input = $(".toolbar input");
var main = $(".main");

ipc.on('send-files', function(arg) {
    handleNotes(arg); // prints "pong"
});
ipc.send('get-files', '');

var handleNotes = function(notes){
    ul.children().remove();
    for(var i=0;i<notes.length;i++){
        //console.log(notes[i]+"h");
        ul.append(
            $("<li> <span class=\"title\">" +
                notes[i][0] +
                "</span> <span class=\"time\">" +
                notes[i][1] +
                "</span> <div class=\"desc\">" +
                "~/Notes/" +
                "</div></li>"
            )
        );
    }
    ul.children().first().addClass("active");
    ul.children().first().click();
};

$(".sidebar").on("click","li",function(){
    $("li").removeClass("active");
    $(this).addClass("active");
    ipc.send('get-file', $( ".title", this).text());

});

ipc.on('send-file', function(arg) {
    //console.log("sendfile");
    displayNote(arg);
    // prints "pong"
});
//editor.setTheme("ace/theme/monokai");
//editor.getSession().setMode("ace/mode/markdown");
//editor.getSession().setUseWrapMode(true);
//editor.setHighlightActiveLine(false);
//editor.getSession().setWrapLimitRange(null, null);
//editor.setShowPrintMargin(false);
//editor.setOption("showLineNumbers", false);

var displayNote = function(note){
    //console.log("displaynote");
    editor.setValue(note); //text(note)
    editor.clearSelection();
    editor.blur();
};

input.on("keyup",function(e){
    if(e.which == 40){
        $(".active").next().click();
    }else if(e.which == 38){
        $(".active").prev().click();
    }else if(e.which == 37){

    }else if(e.which == 39){

    }else if(e.which == 9){

    }else {
        ipc.send('get-files', this.value);
    }
});
input.on("keydown",function(e){
    if(e.which == 40){
        e.preventDefault();
    }else if(e.which == 38){
        e.preventDefault();
    }else if(e.which == 13){
        e.preventDefault();
        ipc.send("write-file",[this.value+".txt",""]);
    }else if(e.which == 27){
        e.preventDefault();
        ipc.send("quit","");
    }
});
main.on("input",function(){
    console.log(this.value);
    ipc.send("write-file",[$(".active .title").text(),editor.getValue()]);
});

