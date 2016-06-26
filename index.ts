import { makeDOMDriver, DOMSource, div, VNode } from '@cycle/dom'
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

function main(sources: Sources): Sinks {
  return {
    DOM: xs.of(div('Madlibs'))
  }
}

const drivers: Drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
