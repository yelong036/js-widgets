import { VirtualNode } from '../../../core/main/index'

type Props = Record<string, any>
type Renderer<P extends Props> = ((props: P) => VirtualNode)

export default function prepareView<P extends Props>(actionBefore: (props: P) => void) {
  return (renderer: Renderer<P>) => {
    return (props: P) => {
      actionBefore(props)
      return renderer(props)
    }
  }
}