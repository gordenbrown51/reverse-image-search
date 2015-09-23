'use strict';

/**** wrapper (start) ****/
var isFirefox = typeof require !== 'undefined';

if (isFirefox) {
  var app = require('./firefox/firefox');
  var config = require('./config');
}
/**** wrapper (end) ****/

// welcome
(function () {
  var version = config.welcome.version;
  if (app.version() !== version) {
    app.timer.setTimeout(function () {
      app.tab.open('http://mybrowseraddon.com/tineye.html?v=' + app.version() + (version ? '&p=' + version + '&type=upgrade' : '&type=install'));
      config.welcome.version = app.version();
    }, config.welcome.timeout);
  }
})();

function page () {
  app.content_script.send('capture');
}

var ffDfsdfd;
app.content_script.receive('capture', function (obj) {
  app.screenshot(obj.left, obj.top, obj.width, obj.height, obj.devicePixelRatio).then(function (blob) {
    app.content_script.send('notify', 'Uploading image to TinEye. Please wait ...');
    var formData = new app.FormData();
    formData.processData = false;
    formData.contentType = false;
    formData.append('image', blob, 'screenshot.png');
    var req = new app.XMLHttpRequest();
    ffDfsdfd = false;
    req.onreadystatechange = function () {
      if (req.responseURL && !ffDfsdfd) {
        ffDfsdfd = true;
        app.content_script.send('notify', '');
        app.tab.open(req.responseURL);
        req.abort();
      }
    };
    req.open('POST', 'http://www.tineye.com/search', true);
    req.send(formData);
  });
});

var geWRddf;
function link (url) {
  app.content_script.send('notify', 'Uploading image link to TinEye. Please wait ...');
  var formData = new app.FormData();
  formData.processData = false;
  formData.contentType = false;
  formData.append('url', url);
  var req = new app.XMLHttpRequest();
  geWRddf = false;
  req.onreadystatechange = function () {
    if (req.responseURL && !geWRddf) {
      geWRddf = true;
      app.content_script.send('notify', '');
      app.tab.open(req.responseURL);
      req.abort();
    }
  };
  req.open('POST', 'http://www.tineye.com/search', true);
  req.send(formData);
}

app.context_menu.create('Reverse Image Search (image url)', 'icons/16.png', 'img', link);
app.context_menu.create('Reverse Image Search (capture)', 'icons/16.png', 'page', page);
