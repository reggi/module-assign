// var _ = require('lodash')
// var util = require('util')
var assert = require('assert')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')
var chdirTemp = require('../test-chdir-temp')
var DESC = path.basename(__filename, path.extname(__filename))
var moduleAssign = require('../module-assign')

/* global describe, it */

describe(DESC, function () {
  chdirTemp(); if (!GLOBAL.fsmock) throw new Error('no mock')

  describe('moduleAssign()', function () {
    it('should assign module', function () {
      fs.writeFileSync('./package.json', '{}')
      fs.writeFileSync('./alpha.js')
      fs.mkdirSync('node_modules')
      return moduleAssign('./alpha.js').then(function () {
        var moduleDst = fs.readdirSync('node_modules/alpha')
        var modulePkg = fs.readJsonSync('node_modules/alpha/package.json')
        var thisPkg = fs.readJsonSync('package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha',
          'assignedModule': true
        })
        assert.deepEqual(thisPkg, {
          'localDependencies': {
            'alpha': './alpha.js'
          }
        })
      })
    })
  })

  describe('moduleAssign.all()', function () {
    it('should assign all modules', function () {
      fs.writeFileSync('./package.json', '{}')
      fs.writeFileSync('./alpha.js')
      fs.mkdirSync('node_modules')
      return moduleAssign.all(['./alpha.js']).then(function () {
        var moduleDst = fs.readdirSync('node_modules/alpha')
        var modulePkg = fs.readJsonSync('node_modules/alpha/package.json')
        var thisPkg = fs.readJsonSync('package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha',
          'assignedModule': true
        })
        assert.deepEqual(thisPkg, {
          'localDependencies': {
            'alpha': './alpha.js'
          }
        })
      })
    })
  })

  describe('moduleAssign.install()', function () {
    it('should assign modules from package', function () {
      fs.writeJsonSync('./package.json', {
        'localDependencies': {
          'alpha': './alpha.js'
        }
      })
      fs.mkdirSync('node_modules')
      return moduleAssign.install().then(function () {
        var moduleDst = fs.readdirSync('./node_modules/alpha')
        var modulePkg = fs.readJsonSync('./node_modules/alpha/package.json')
        assert.deepEqual(moduleDst, ['package.json'])
        assert.deepEqual(modulePkg, {
          'main': '../../alpha.js',
          'name': 'alpha',
          'assignedModule': true
        })
      })
    })
  })

})
