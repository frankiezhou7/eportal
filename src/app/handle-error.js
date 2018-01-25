if(global.Raven) {
  let fetchMe403 = false;

  Raven.config('https://efe0a46ffb5748cc84c21a582f939b7e@app.getsentry.com/65328', {
    release: __VERSION__,
    serverName: __GATEWAY__,
    tags: {
      commit: __COMMIT__,
      debug: DEBUG
    },
    shouldSendCallback: function(data) {
      return false;

      // if(fetchMe403) { return true; }
      // if(data.message === 'Error: access to action fetchMe is denied') {
      //   fetchMe403 = true;
      //   return false;
      // }
      // return true;
    }
  }).install();

  global.captureException = Raven.captureException.bind(Raven);
} else {
  global.captureException = () => {};
}

global.onerror = global.captureException;
