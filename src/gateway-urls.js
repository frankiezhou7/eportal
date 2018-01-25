module.exports = {
  FILES_URL: '/files/',
  GATEWAY_URL: __GATEWAY__,
  GATEWAY_URLS: DEBUG ? {
    'epds': 'http://' + __HOST__ + ':10000',
    'user': 'http://' + __HOST__ + ':10100',
    'order': 'http://' + __HOST__ + ':11000',
    // 'event': 'http://' + __HOST__ + ':11200',
    'message': 'http://' + __HOST__ + ':20100',
    // 'chatting': 'http://' + __HOST__ + ':20200',
    'session': 'http://' + __HOST__ + ':10300',
    'auth': 'http://' + __HOST__ + ':10500'
  } : {}
};
