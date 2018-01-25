const _ = require('eplodash');
const agent = require('superagent');
const cache = require('./cache');
// const cookies = require('cookies-js');
const URLS = require('./gateway-urls');

const {
  SESSION_ID,
  DEVICE_ID,
  REMEMBER_ME,
} = cache;

module.exports = {
  send: function(request, files, uploadProgressHandler) {
    const gateway = URLS.GATEWAY_URLS[request.service] || URLS.GATEWAY_URL;

    return new Promise((resolve, reject) => {

      function done(err, res) {
        let target = null;
        let func = null;

        if(err) {
          if(res && res.body) {
            err.code = res.body.errorCode;
            err.message = res.body.errorMessage || err.message;
          }
          target = err;
          func = reject;

          if(err.code === 'SESSION_EXPIRED') {
            clearIds();
            global.tools.toSubPath('/login');
          }

          if(global.captureException) {
            global.captureException(err);
          }

          // 处理版本冲突以及内部报错等情况
          if(global.register && global.register.errorAlert) {
            global.register.errorAlert(err);
          }
        } else if(res) {
          if(res.body && res.body.status === 'NOK') {
            target = {
              code: res.body.errorCode,
              message: res.body.errorMessage,
            };
            func = reject;
          } else {
            getIds(res.headers);

            target = res.body;
            func = resolve;
          }
        }

        if(!target) {
          throw Error('Invalid ajax response/error');
        }

        target.action = request.action;
        target.request = request;

        func(target);
      }

      // A. 检查是否有上传文件, 如果没有，直接POST
      if(!files || _.keys(files).length <= 0) {
        setIds(agent.post(gateway))
        .send(request)
        .end(done);
        return;
      }

      // B. multipart方式attach上传的文件，并将request按照约定序列化后放入其中一part
      let handle = setIds(agent.post(gateway));
      if(_.isFunction(uploadProgressHandler)) {
        handle.on('progress', (e) => {
          uploadProgressHandler(e.percent);
        });
      }

      for(let filename in files) {
        handle = handle.attach(filename, files[filename], files[filename].name);
      }

      let strRequest = null;

      try {
        strRequest = JSON.stringify(request);
      } catch(e) { return done(e); }

      handle.field('request', strRequest);
      handle.end(done);
    });
  }
}

function setIds(handle) {
  let did = cache.get(DEVICE_ID);
  let sid = cache.get(SESSION_ID);

  if(did) {
    handle.set('x-device-id', did);
  }
  if(sid) {
    handle.set('x-session-id', sid);
  }

  return handle;
}

function getIds(headers) {
  let sid = headers['x-session-id'];
  let did = headers['x-device-id'];

  if(sid === 'null' || sid === '') {
    clearIds();
  } else if(sid) {
    let remember = cache.get(REMEMBER_ME);
    cache.set(SESSION_ID, sid, remember ? false : 0);
  }

  if(did) {
    cache.set(DEVICE_ID, did);
  }
}

function clearIds() {
  cache.remove(SESSION_ID);
  global.Raven && Raven.setUserContext();
}
