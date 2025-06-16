import TabContent from '../TabContent'
import SeasonMainTab from './SeasonMainTab'

export default function SeasonScreen({state, popup, updateState, setTotalClicks}) {
      
return (
    <div style={{color:"#FFFF00"}}>
        <TabContent selectedTabKey="SeasonMainTab">
          <SeasonMainTab tabKey="SeasonMainTab" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
        </TabContent>
    </div>)
}