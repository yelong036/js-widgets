import { Ctrl, Props } from '../../../core/main/index'
import px from './px'
import PickOptionalProps from '../internal/types/PickOptionalProps'

export default function useProps<P extends Props>(
  c: Ctrl<P>,
  defaultProps?: Partial<PickOptionalProps<P>>
): [P, () => P] {
  const
    getProps = c.consumeProps(),

    getDefaultedProps = defaultProps
      ? () => Object.assign({}, defaultProps, getProps())
      : getProps

  return [px.bindData(getDefaultedProps), getDefaultedProps]
}