# js-widgets

*js-widgets* is a UI library with a different API that you may usally
see for virtual DOM base UI libraries.<br>
It's just a R&D project to noodle around with some alternative approaches
and APIs for UI development.<br>
*js-widget* uses the fabulous Dyo UI library internally (https://dyo.js.org).

Important: It is not planned that *js-widgets* will ever be used in production.

Disclaimer: This is just an initial draft of README. A lot is missing ....

### Examples

#### Example 1 (pure ECMAScript / no JSX)

```javascript
import { component, mount } from 'js-widgets'
import { div } from 'js-widgets/html'
import { Spec } from 'js-spec' // third-party validation library

const SayHello = component({
  displayName: 'SayHello',

  validate: Spec.checkProps({
    optional: {
      name: Spec.string
    }
  }),

  render({ name: 'World' }) {
    return div(`Hello, ${name}!`)
  }
})

const content =
  div(
    SayHello()
    SayHello({ name: 'Jane Doe' }))

mount(content, document.getElementById('app'))
```
#### Example 2 (ECMAScript + JSX)

```tsx
import { h, component, mount, useState, useOnUpdate } from 'js-widgets'
import { Spec } from 'js-spec' // third-party validation library

const Counter = component({
  displayName: 'Counter',
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  defaultProps: {
    initialValue: 0,
    label: 'Counter'
  },

  main(c, props) {
    const
      [state, setState] = useState(c, {
        count: props.initialValue
      }),

      onIncrement = () => setState({ count: state.count + 1 }),
      onDecrement = () => setState({ count: state.count - 1 })

    useOnUpdate(c, () => {
      console.log( `Update - ${props.label}: ${state.count}`)
    })

    return () =>
      <div className="counter">
        <label>{props.label}: </label> 
        <button onClick={onDecrement}>
          -1
        </button>
        <span>
          {state.count}
        </span>
        <button onClick={onIncrement}>
          +1
        </button>
      </div>
    )
  }
})

mount(<Counter/>, document.getElementById('app'))
```

### Motivation

What are the main difference to React's API?

* Implementing components with *js-wigets* is (obviously) more
  verbose than doing the same in React.
  Some advantages on the other hand are:
  No magic, no special Linter support needed, only
  decent programming techniques are use, no hook order
  dependency (hooks are just "normal functions - there
  is nothing special here), hooks are not part of the core
  (means, all hook functions are quasi custom hooks),
  no special challenges for the garbage collector, etc.

* React's API is quite "optimized" for the use of JSX:

  While the following JSX syntax is really nice...

  ```jsx
  <FancyHeader>Some headline</FancyHeader>
  ```
  ... its non-JSX counterpart looks quite verbose ...

  ```javascript
  React.createElement(FancyHeader, null, 'Some headline')
  ```

  ... while it would be much nicer just to write ...
  
  ```javascript
  FancyHeader('Some headline')
  ```

  Be aware that you should ALWAYS use JSX with TypeScript
  the non-JSX usage is only meant for those who want to
  UIs in pure ECMAScript. Also be aware that it's possible that
  future transpilers wil perform some great optimizations when
  transforming JSX expressions - so JSX is really a great thing.

  In React's API, the main representation of component types are
  render functions (for function components) or component classes.
  Neither will component classes be instantiated by the user directly
  nor will render functions be called directly. The only useful
  usage of component types are that they will be passed as first argument to
  the `React.createElement` function. Same for context provider
  and consumers and the `Fragment` symbol.

  In js-widgets things are different: Everything that can be used as first
  argument of the `h` function besides strings is a factory
  function that returns the result of a corresponding `h` call.
  Besides the second argument (`props`) of the `h` function
  and also for all the component factories is optional to provide a concice
  syntax: All component types, `Fragment`, context providers, context
  consumers are factory functions with an optional second `props` argument:

  ```jsx
  SomeComponent('some text')

  // or when using jsWidgets with JSX
  <SomeComponent>Some text</SomeComponent>
  ```

  ```jsx
  Fragment(
    SomeComponent('some text'),
    SomeComponent({ className: 'some-class'}, 'some text'))

  // or when using jsWidgets with JSX
  <>
    <SomeComponent>Some text</SomeComponent>
    <SomeComponent className="some-class">some text</SomeComponent>
  </>
  ```
  
  ```jsx
  Fragment({ key: someKey },
    SomeComponent(),
    SomeOtherComponent())
  
  // or when using jsWidgets with JSX
  <Fragment key={someKey}>
    <SomeComponent/>
    <SomeOtherComponent/>
  </>
  ```

  ```jsx
  SomeCtx.Provider({ value: someValue },
    SomeComponent(),
    SomeOtherComponent())
  
  // or when using jsWidgets with JSX
  <SomeCtx.Provider value={someValue}>
    <SomeComponent/>
    <SomeOtherComponent/>
  </SomeCtx.Provider>
  ```

  ```jsx
  SomeCtx.Consumer(value =>
    SomeComponent(value))
  
  // or when using jsWidgets with JSX
  <SomeCtx.Consumer>
    { it => <SomeComponent/> }
  </SomeCtx.Consumer>
  ```

  Here's another non-JSX demo example:

  ```js
  const content =
    div({ className: 'news-list' },
      h3('Latest news'),
      NewsTicker(),
      hr(),
      ul(
        newsFeed.forEach(news =>
          li(
            NewsBox({
              date: news.date,
              headline: news.headline,
            },
              news.content
            )
          )
        )
      )
    )
  ```

* Reacts provides the possibility for a sophisticated validation of the
  components' properties, which is great.
  Normally for that purpose a add-on library called "props-types".
  While it's great that "props-types" is not part of React itself, yet
  unfortunatelly all the validation function of "props-types" are only
  meant to be used with React, it's not meant as a general purpose validation
  library as the signature of the validation functions are very React-specific.
  This has some advantages of course (maybe shorter error messages and a bit
  smaller production bundle sizes) but the disadvantage that you cannot just use
  a general purpose validation library are really heavy.
  jsWidgets on the other hand allows the use of such general-purpose validation
  libraries - while it recommended to use the jsWidgets independent validation
  library ["js-spec"](https://github.com/js-works/js-spec).

* In jsWidgets component types are represented by a corresponding factory
  function (that does create a virtual element by using the `h` function).
  That's simplifies the implemention of user interfaces in pure ECMAScript
  if desired - nevertheless it is recommended to use JSX as this is the
  de-facto standard in React-like UI development.

### Current API (not complete yet)

#### Module "_js-widgets_"
* `component(config)`
* `context(config)`
* `h(type, props?, ...children)`
* `typeOf(element)`
* `propsOf(element)`
* `Boundary(props?, ...children)`
* `Fragment(props?, ...children)`
* `mount(content, container)`
* `unmount(container)`

#### Module "_js-widgets/util_":
* `createRef(value)`
* `isElement(it)`
* `isNode(it)`
* `childCount(children)`
* `forEachChild(children, action)`
* `mapChildren(children, mapper)`
* `onlyChild(children)`
* `toChildArray(children)`
* `withChildren(f)`

#### Module "_js-widgets/hooks_":
* `useContext(...)`
* `useDataProxy(...)`
* `useEffect(...)`
* `useForceUpdate(...)`
* `useInterval(...)`
* `useMousePosition(...)`
* `useOnMount(...)`
* `useOnUnmount(...)`
* `useOnUpdate(...)`
* `usePrevious(...)`
* `useState(...)`
* `useTime(...)`
* `useValue(...)`

#### Module "_js-widgets/tools_"
* `componentActions(...)`
* `componentStore(...)`
* `proxify(...)`
* `toProxy(...)`
* `consuming(...)`
* `wrap(...)`

#### Module "_js-widgets/html_"

Factory functions for all HTML entities (to be used in non-JSX context: `div('some text')`)

#### Module "_js-widgets/svg_"

Factory functions for all SVG entities

### Project status

**Important**: This project is in a very early state and it is not and never will be meant to be used in production.
