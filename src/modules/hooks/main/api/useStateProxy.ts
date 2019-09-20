import { Ctrl, Props } from '../../../core/main/index'
import useStateObject from './useStateObject'
import toProxy from '../../../util/main/api/toProxy'

type Updater<T extends object> = Partial<T> | ((oldState: T) => Partial<T>)

export default function useStateProxy<S extends object, P extends Props>(
  c: Ctrl<P>,
  init: S | ((props: P) => S)
): [S, (updater: Updater<S>) => void] {
  const [getState, setState] = useStateObject(c, init)

  return [toProxy(getState), setState]
}