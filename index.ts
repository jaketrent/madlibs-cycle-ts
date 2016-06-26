import { makeDOMDriver, DOMSource, div, h2, textarea, VNode } from '@cycle/dom'
import { run } from '@cycle/xstream-run'
import xs, { Stream } from 'xstream'

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
  libs: Lib[]
}
interface Lib {
  name: string,
  label: string,
  value: string
}

function intent(DOMSource: DOMSource) {
  const story$ = DOMSource
    .select('.story')
    .events('keyup')
    .map((evt: Event) => evt.target.value)
    .startWith('')

  const values$ = DOMSource
    .select('.libInput')
    .events('keyup')
    .map((evt: Event) => evt.target.value)
    .startWith([''])

  return { story$, values$ }
}

function model(story$: Stream<string>, values$: Stream<string[]>): Stream<ViewState> {
  return xs.combine(story$, values$)
    .map(([story, values]) => {
      const libs = values.map(value => {
        return {
          name: 'name',
          label: 'label',
          value
        }
      })
      return { story, libs }
    })
}

function view(state$: Stream<ViewState>): Stream<VNode> {
  return state$.map(state => {
    return div([
      h2('MadLibs'),
      textarea('.story', state.story)
    ])
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
