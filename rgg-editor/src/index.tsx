import { predefinedPropKeys } from './editor/componentEditor/config';
import { Editor } from './editor/Editor';
import { useIsEditMode } from './editor/state/editor';
import { registerAddable } from './scene/addables';
import { Editable } from './scene/Editable';
import { EditCanvas, useEditCanvasProps } from './scene/EditCanvas';
import { InteractiveMesh } from './scene/InteractiveMesh';
import { useEditableProp } from './scene/useEditableProp';

export {
  Editor,
  EditCanvas,
  Editable,
  useEditableProp,
  predefinedPropKeys,
  registerAddable,
  InteractiveMesh,
  useEditCanvasProps,
  useIsEditMode,
}