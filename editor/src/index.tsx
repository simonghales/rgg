export * from  './editor/Editor'
export * from './editable/Editable'
import {useEditableProp} from './editable/context'
import TemporaryComponents from './editor/TemporaryComponents';
import {registerComponent} from './state/creatables';

export {
  useEditableProp,
  registerComponent,
  TemporaryComponents,
}