import { makeDOMDriver, DOMSource, div, textarea, VNode } from '@cycle/dom'
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
interface ViewState {
  story$: Stream<string>
}
interface Event {
  target: EventTarget
}
interface EventTarget {
  value: string
}

function intent(DOMSource: DOMSource) {
  const story$ = DOMSource
    .select('.story')
    .events('keyup')
    .map((evt: Event) => evt.target.value)
    .startWith('')

  return { story$ }
}

function model(story$: Stream<string>): ViewState {
  return { story$ }
}

function view(state: ViewState): Stream<VNode> {
  return state.story$.map(story =>
    textarea('.story', story)
  )
}

function main(sources: Sources): Sinks {
  const { story$ } = intent(sources.DOM)
  const state$ = model(story$)
  const vtree$ = view(state$)
  return {
    DOM: vtree$
  }
}

const drivers: Drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
