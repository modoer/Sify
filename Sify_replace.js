var outercontent = "";

var dictionary = {
    "s": "SELECT",
};


function popitup(url) {
	newwindow=window.open(url,'name','height=400,width=600');
	if (window.focus) {newwindow.focus()}
	return false;
}

function ReplaceContentInContainer(id,content) {
var container = document.getElementById(id);
container.innerHTML = content;
}

function sify (indata) 
{
var content = indata;
content = replaceUsingDictionary(dictionary, content, function(key, dictionary){
    return '' + dictionary[key] + '';
});
outercontent = content;

function replaceUsingDictionary(dictionary, content, replacehandler) {
    if (typeof replacehandler != "function") {
        // Default replacehandler function.
        replacehandler = function(key, dictionary){
            return dictionary[key];
        }
    }

    var patterns = [], 
        patternHash = {},
        oldkey, key, index = 0,
        output = [];
    for (key in dictionary) {
        key = (oldkey = key).toLowerCase();
        dictionary[key] = dictionary[oldkey];

        patterns.push('\\b(?:' + key.replace(/([[^$.|?*+(){}])/g, '\\$1') + ')\\b');

        patternHash[key] = index++;
    }
    var pattern = new RegExp(patterns.join('|'), 'gi'),
        lastIndex = 0;

    while (key = pattern.exec(content)) {
        key = key[0].toLowerCase();

        output.push(content.substring(lastIndex, pattern.lastIndex - key.length));
        output.push(replacehandler(key, dictionary));

        lastIndex = pattern.lastIndex;

        pattern = new RegExp(patterns.join('|'), 'gi');

        pattern.lastIndex = lastIndex;
    }
    output.push(content.substring(lastIndex, content.length));
    return output.join('');
}
}


function Sify_Redraw() {
	sify(document.getElementById('new').value);
	ReplaceContentInContainer('thecode',outercontent);
}

window.onbeforeunload = closingCode;
function closingCode(){
	 localStorage.removeItem( "SaveStateOnClose" );
   localStorage.setItem( "SaveStateOnClose", document.getElementById('new').value );
   return null;
}

document.addEventListener("DOMContentLoaded", function(e){
  var ExitTextRestore = localStorage.getItem("SaveStateOnClose");
  ReplaceContentInContainer('new', ExitTextRestore);
  Sify_Redraw();
});

function SaveSify() {
 var saveName = "";
 var saveAs = prompt("Save as: ", saveName);
 if (saveAs != null) {
      localStorage.removeItem(saveAs);
      localStorage.setItem( saveAs, document.getElementById('new').value );
 }
}

function LoadSify() {
 var loadName = "";
 var loadWhat = prompt("Load what? ", loadName);
 if (loadWhat != null)
  {
 var loadText = localStorage.getItem(loadWhat);
      ReplaceContentInContainer('new', loadText);
      Sify_Redraw();
  }
}


if (document.layers) {
  document.captureEvents(Event.KEYDOWN);
}

document.onkeydown = function (evt) {
  // Enter
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 0 || keyCode == 32) {
    Sify_Redraw();
  }
  if (keyCode == 27) {
    // For Escape.
    copyContent = outercontent.split("<br>").join("\n");
    window.prompt("Copy to clipboard: Ctrl+C, Enter", copyContent);
  } 
  else {
    return true;
  }
};
