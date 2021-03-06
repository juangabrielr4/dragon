var HandlebarsMixin = require('../../../../../src/dragon/views/mixins/handlebars'),
    Dragon        = require('../../../../../src/dragon')

describe('Unit: View: Mixins: Handlebars', function() {

  it.skip('should render and attach to <body>', function(done) {

    class View extends Dragon.View {

      constructor() {
        super()

        this.container = 'body'
        this.template = function() {return '<div id="foo"><p>Hello World!</p></div>'}

        console.log("this.$container", this.container)

      }

    }

    Object.assign(View.prototype, HandlebarsMixin)

    var renderSpy = sinon.spy(View.prototype, 'render')
    var attachSpy = sinon.spy(View.prototype, 'attach')

    var view = new View()
    console.log("view", view)

    //expect(view.id).to.equal('foo')
    //expect($('#foo')).to.be.an('object')

    expect(renderSpy).to.have.been.calledOnce
    expect(attachSpy).to.have.been.calledOnce

    //View.prototype.render.restore()

    done()

  })

})
