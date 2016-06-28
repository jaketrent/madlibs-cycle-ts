import test from 'ava'

import * as subject from '../libs.ts'

test('#extractNames is a fn', t => {
  t.truthy(typeof subject.extractNames === 'function')
})

test('#extractNames returns a single name', t => {
  const story = 'here is a <name> to extract'
  t.deepEqual(subject.extractNames(story), ['name'])
})

test('#extractNames returns a multiple names', t => {
  const story = 'here is a <name> and <another> to extract'
  t.deepEqual(subject.extractNames(story), ['name', 'another'])
})

test('#extractNames recognizes underscores in names', t => {
  const story = 'here is a <name_combo> and <another_winner> to extract'
  t.deepEqual(subject.extractNames(story), ['name_combo', 'another_winner'])
})

test('#replaceLibs replaces a single name', t => {
  const story = '<name>'
  const libs = [{
    name: 'name',
    label: 'Name',
    value: 'someValue'
  }] 
  t.truthy(subject.replaceLibs(story, libs) === 'someValue')
})

test('#replaceLibs replaces a single name in a string', t => {
  const story = 'here is a <name> to replace'
  const libs = [{
    name: 'name',
    label: 'Name',
    value: 'someValue'
  }] 
  t.truthy(subject.replaceLibs(story, libs) === 'here is a someValue to replace')
})

test('#replaceLibs replaces a multiple names in a string', t => {
  const story = 'here is a <name> and <another> to replace'
  const libs = [{
    name: 'name',
    label: 'Name',
    value: 'someValue'
  }, {
    name: 'another',
    label: 'Another',
    value: 'diffValue'
  }] 
  t.truthy(subject.replaceLibs(story, libs) === 'here is a someValue and diffValue to replace')
})
