
var chai      = require('chai'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai')

chai.use(sinonChai)

window.expect = chai.expect
window.sinon  = sinon

var Paradigm  = require('../../../../src/paradigm')
