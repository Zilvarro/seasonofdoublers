import TabContent from '../TabContent'
import DoublerSlowTab from './DoublerSlowTab'
import DoublerFastTab from './DoublerFastTab'
import DoublerMediumTab from './DoublerMediumTab'

export default function DoublerScreen({state, popup, updateState, setTotalClicks}) {
      
const setDoublerTab = (tabKey)=>{
    updateState({name: "selectDoublerTab", tabKey: tabKey})
}

return (
    <div style={{color:"#AAAAAA"}}>
        <button style={{marginLeft: "20px"}} onClick={()=>setDoublerTab("DoublerSlowTab")}>Slow</button>&nbsp;
        <button onClick={()=>setDoublerTab("DoublerMediumTab")}>Medium</button>&nbsp;
        <button onClick={()=>setDoublerTab("DoublerFastTab")}>Fast</button>&nbsp;
        <TabContent selectedTabKey={state.selectedDoublerTabKey}>
          <DoublerSlowTab tabKey="DoublerSlowTab" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
          <DoublerMediumTab tabKey="DoublerMediumTab" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
          <DoublerFastTab tabKey="DoublerFastTab" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
        </TabContent>
    </div>)
}