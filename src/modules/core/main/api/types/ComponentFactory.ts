import VirtualElement from './VirtualElement'
import ComponentMeta from './ComponentMeta'
import Props from './Props'

type ExtProps<P extends Props> = P & {
  key?: string | number
}

type ComponentFactory<P extends Props = {}> =
  (props?: P & { key?: string | number }, ...children: any[]) => VirtualElement

export default ComponentFactory
