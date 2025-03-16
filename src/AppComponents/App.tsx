import { useReducer } from 'react'
import './App.css'
import { AppRibbon } from './AppRibbon'
import { Panel } from '../Widgets/Panel'
import { defaultAppState, rootReducer } from '../Store/reducer'
import { StoreContext, DispatchContext } from '../Store/context'
import { LayersPanel } from './LayersPanel'
import { CompositionTreePanel } from './CompositionTreePanel'
import { ToolSelector } from './ToolSelector'

function App() {
  const [store, dispatch] = useReducer(rootReducer, defaultAppState);

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
