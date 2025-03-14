import { useReducer } from 'react'
import './App.css'
import { AppRibbon } from './AppRibbon'
import { Panel } from '../Widgets/Panel'
import { ImageProject } from '../types'
import { rootReducer } from '../Store/reducer'
import { ProjectContext, ProjectDispatchContext } from '../Store/context'
import { LayersPanel } from './LayersPanel'
import { CompositionTreePanel } from './CompositionTreePanel'

function App() {
  const [store, dispatch] = useReducer(rootReducer, {project: null as ImageProject|null});


  return (
    <ProjectContext.Provider value={store.project}>
      <ProjectDispatchContext.Provider value={dispatch}>

        <AppRibbon />
        <Panel row>
          <div className='bg-red-200 w-16'/>
          <div className='bg-blue-100 flex-2'>
            { store.project && <LayersPanel project={store.project} /> }
          </div>
          <div className='bg-teal-100 flex-1'>
            { store.project && <CompositionTreePanel project={store.project} /> }
          </div>
        </Panel>
      </ProjectDispatchContext.Provider>
    </ProjectContext.Provider>
  )
}

export default App
