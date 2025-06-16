import TabContent from '../TabContent'
import DoublerSlowTab from './DoublerSlowTab'

export default function DoublerScreen({state, popup, updateState, setTotalClicks}) {

return (
    <div style={{color:"#AAAAAA"}}>
        <TabContent selectedTabKey="DoublerSlowTab">
          <DoublerSlowTab tabKey="DoublerSlowTab" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
        </TabContent>
    </div>)
}