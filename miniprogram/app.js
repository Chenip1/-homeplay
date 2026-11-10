const { startPresence, stopPresence } = require('./utils/pk-client')
App({ onShow: startPresence, onHide: stopPresence })
