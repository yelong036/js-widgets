import Props from './Props'
import VirtualNode from './VirtualNode'
import Component from './Component'
import PickOptionalProps from '../../internal/types/PickOptionalProps'

type StatefulComponentConfig<P extends Props = {}> = {
  displayName: string,
  defaults?: PickOptionalProps<P>, 
  validate?(props: P): boolean | null | Error,
  memoize?: boolean,
  init: (c: Component<P>, getProps: () => P) => (props: P) => VirtualNode,
}

export default StatefulComponentConfig 
