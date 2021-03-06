import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as _ from '../../../src/util/underscore'

const expect = chai.expect
chai.use(sinonChai)

describe('util/underscore', function () {
  describe('.isString()', function () {
    it('should return true for literal string', function () {
      expect(_.isString('foo')).to.be.true
    })
    it('should return true String instance', function () {
      expect(_.isString(String('foo'))).to.be.true
    })
    it('should return false for 123 ', function () {
      expect(_.isString(123)).to.be.false
    })
  })
  describe('.stringify()', function () {
    it('should respect to to_liquid() method', function () {
      expect(_.stringify({ to_liquid: () => 'foo' })).to.equal('foo')
    })
    it('should respect to toLiquid() method', function () {
      expect(_.stringify({ toLiquid: () => 'foo' })).to.equal('foo')
    })
    it('should recursively call toLiquid()', function () {
      expect(_.stringify({ toLiquid: () => ({ toLiquid: () => 'foo' }) })).to.equal('foo')
    })
    it('should return "" for null', function () {
      expect(_.stringify(null)).to.equal('')
    })
    it('should return "" for undefined', function () {
      expect(_.stringify(undefined)).to.equal('')
    })
    it('should use Object.prototype.toString if no toString method exists', function () {
      const obj = { toString: undefined }
      expect(_.stringify(obj)).to.equal('[object Object]')
    })
    it('should return regex string for RegExp', function () {
      const reg = /foo/g
      expect(_.stringify(reg)).to.equal('/foo/g')
    })
    it('should return locale string for date', function () {
      const date = new Date('2018-10-01T14:51:00.000Z')
      // Mon Oct 01 2018 22:51:00 GMT+0800 (CST)
      expect(_.stringify(date)).to.equal(date.toString())
    })
  })
  describe('.forOwn()', function () {
    it('should iterate all properties', function () {
      const spy = sinon.spy()
      const obj = {
        foo: 'bar'
      }
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should default to empty object', function () {
      const spy = sinon.spy()
      _.forOwn(undefined, spy)
      expect(spy).to.have.not.been.called
    })
    it('should not iterate over properties on prototype', function () {
      const spy = sinon.spy()
      const obj = Object.create({
        bar: 'foo'
      })
      obj.foo = 'bar'
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should break when returned false', function () {
      const spy = sinon.stub().returns(false)
      _.forOwn({
        'foo': 'foo',
        'bar': 'foo'
      }, spy)
      expect(spy).to.have.been.calledOnce
    })
  })
  describe('.range()', function () {
    it('should return a range of integers', function () {
      expect(_.range(3, 5)).to.deep.equal([3, 4])
    })
    it('should start from 0 if begin omitted', function () {
      expect(_.range(3)).to.deep.equal([0, 1, 2])
    })
  })
  describe('.isObject()', function () {
    it('should return true for function', function () {
      expect(_.isObject((x: any) => x)).to.be.true
    })
    it('should return true for plain object', function () {
      expect(_.isObject({})).to.be.true
    })
    it('should return false for null', function () {
      expect(_.isObject(null)).to.be.false
    })
    it('should return false for number', function () {
      expect(_.isObject(2)).to.be.false
    })
  })
})
