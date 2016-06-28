import { makeDOMDriver, DOMSource, div, h2, label, input, textarea, VNode } from '@cycle/dom'
import flattenConcurrently from 'xstream/extra/flattenConcurrently'
import { run } from '@cycle/xstream-run'
import xs, { Stream } from 'xstream'

import * as libsUtil from './libs.ts'

interface Sources {
  DOM: DOMSource
}
interface Drivers {
  [name: string]: Function
}
interface Sinks {
  DOM: Stream<VNode>
}
interface Event {
  target: EventTarget
}
interface EventTarget {
  value: string
}
interface ViewState {
  story: string,
  libs: Lib[],
  output: string
}
// TODO: determine if exports/storage place is idiomatic ts
export interface Lib {
  name: string,
  label: string,
  value: string
}

export interface LibInput {
  index: number,
  value: string
}

function intent(DOMSource: DOMSource) {
  const story$ = DOMSource
    .select('.story')
    .events('keyup')
    .map((evt: Event) => evt.target.value)
    .startWith('')

  let values$ = DOMSource
    .select('.libInput')
    .events('input')
    .map((evt: Event) => {
      const el = (<HTMLInputElement> evt.target)
      return {
        index: el.id.replace('libId', ''),
        value: el.value
      }
    })
    .fold((acc: string[], input: LibInput) => {
      acc[input.index] = input.value
      return acc
    }, [])

  return { story$, values$ }
}

function model(story$: Stream<string>, values$: Stream<string[]>): Stream<ViewState> {
  return xs.combine(story$, values$)
    .map(([story, values]) => {
      const libNames = libsUtil.extractNames(story)
      const libs = libNames.map((name, i) => {
        return {
          name,
          label: libsUtil.formatNameLabel(name),
          value: values[i]
        }
      })

      const output = libsUtil.replaceLibs(story, libs)

      return { story, libs, output }
    })
}

function view(state$: Stream<ViewState>): Stream<VNode> {
  return state$.map(state => {
    const libs = state.libs.map((lib, i) => {
      return label([
        lib.label,
        input('#libId' + i + '.libInput', { id: i, value: lib.value })
      ])
    })

    return div([
      h2('MadLibs'),
      textarea('.story', state.story)
    ].concat(libs).concat([
      div(state.output)
    ]))
  })
}

function main(sources: Sources): Sinks {
  const { story$, values$ } = intent(sources.DOM)
  const state$ = model(story$, values$)
  const vtree$ = view(state$)
  return {
    DOM: vtree$
  }
}

const drivers: Drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
