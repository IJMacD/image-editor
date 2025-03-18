import { useEffect, useReducer } from 'react'
import './App.css'
import { AppRibbon } from './AppRibbon'
import { Panel } from '../Widgets/Panel'
import { defaultAppState, rootReducer } from '../Store/reducer'
import { StoreContext, DispatchContext } from '../Store/context'
import { LayersPanel } from './LayersPanel'
import { CompositionTreePanel } from './CompositionTreePanel'
import { ToolSelector } from './ToolSelector'
import { useKeyboardShortcuts } from '../Hooks/useKeyboardShortcuts'
import { UIState } from '../types'
import { useSavedState } from '../Hooks/useSavedState'
import { useThrottle } from '../Hooks/useThrottle'

function App() {
  const [savedUIState, saveUIState] = useSavedState("image-editor.uiState", {} as Partial<UIState>);
  const [store, dispatch] = useReducer(rootReducer, { ...defaultAppState, ui: { ...defaultAppState.ui, ...savedUIState }});

  const dampedUIState = useThrottle(store.ui)
  useEffect(() => {
    saveUIState(dampedUIState);
  }, [dampedUIState]);

  useKeyboardShortcuts(store, dispatch);

  return (
    <StoreContext.Provider value={store}>
      <DispatchContext.Provider value={dispatch}>

        <AppRibbon />
        <Panel row>
          <div className='bg-red-200 w-16 flex flex-col place-items-center'>
            <ToolSelector />
          </div>
          <div className='bg-blue-100 flex-2'>
            { store.project && <LayersPanel project={store.project} /> }
          </div>
          <div className='bg-teal-100 flex-1'>
            { store.project && <CompositionTreePanel project={store.project} /> }
          </div>
        </Panel>
      </DispatchContext.Provider>
    </StoreContext.Provider>
  )
}

export default App
