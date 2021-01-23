
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./babel-plugin-react-engine.cjs.production.min.js')
} else {
  module.exports = require('./babel-plugin-react-engine.cjs.development.js')
}
