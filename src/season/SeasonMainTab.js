import { formatNumber } from "../utilities";

export default function SeasonMainTab({state, popup, updateState, setTotalClicks}) {

  const buyAuto = ()=>{
    updateState({name: "buyAuto"})
  }

  const buyAutoSeason = ()=>{
    updateState({name: "buyAutoSeason"})
  }

  const buyWin = ()=>{
    updateState({name: "buyWin"})
  }

  const buySeasonDoubler = ()=>{
    updateState({name: "buySeasonDoubler"})
  }

  const buyAutoSeasonDoubler = ()=>{
    updateState({name: "buyAutoSeasonDoubler"})
  }

  const toggleAutoSeasonDoubler = ()=>{
    updateState({name: "toggleAutoSeasonDoubler"})
  }
  const labels = [<>&nbsp;1st</>,<>&nbsp;2nd</>,<>&nbsp;3rd</>,<>&nbsp;4th</>,<>&nbsp;5th</>,<>&nbsp;6th</>,<>&nbsp;7th</>,<>&nbsp;8th</>,<>&nbsp;9th</>,"10th","11th","12th","13th","14th","15th","16th"]

  return <div>
    You have completed {formatNumber(state.seasons, state.settings.numberFormat, 3,false,false)} season{Math.floor(state.seasons) !== 1 && "s"}.<br/><br/>
    Your point gain is multiplied by {formatNumber(state.seasonMult, state.settings.numberFormat, 3,false,false)}.<br/><br/>
    {state.autoLevel > 0 && state.autoLevel < 16 && <div>Automation is available up to the {labels[state.autoLevel - 1]} Doubler.</div>}<br/><br/>
    {state.autoLevel >=16 && <div>Automation is available for all Doublers.</div>}<br/><br/>
    {state.autoSeason && <div>Auto Season is available.</div>}<br/><br/>
    {state.win && <div>You have a shiny medal for winning the game!</div>}<br/><br/>


    {state.seasonMult < Infinity && <><button  style={{color:"black", width:"100px"}} onClick = {buySeasonDoubler} disabled = {state.seasons <= state.seasonMultLevel}>Season Doubler</button>&nbsp;&nbsp;Need: {formatNumber(state.seasonMultLevel + 1, state.settings.numberFormat)} {state.autoSeasonDoubler && <><input type="checkbox" onClick={toggleAutoSeasonDoubler} checked={state.autoSeasonDoublerActive}/> Auto</>}</>}<br/><br/> 
    {state.autoLevel < 16 && <><button  style={{color:"black", width:"100px"}} onClick = {buyAuto} disabled = {state.seasons <= state.autoLevel}>Auto Doubler</button>&nbsp;&nbsp;Need: {formatNumber(state.autoLevel + 1, state.settings.numberFormat)} </>} <br/><br/> 
    {!state.autoSeason && <><button  style={{color:"black", width:"100px"}} onClick = {buyAutoSeason} disabled = {state.seasons < 20}>Auto Season</button>&nbsp;&nbsp;Need: 20 <br/><br/></>}
    {!state.autoSeasonDoubler && <><button  style={{color:"black", width:"100px"}} onClick = {buyAutoSeasonDoubler} disabled = {state.seasons < 100}>Auto Season Doubler</button>&nbsp;&nbsp;Need: 100 <br/><br/></>}
    {!state.win && <><button  style={{color:"black", width:"100px"}} onClick = {buyWin} disabled = {state.seasons < 10000}>Win the Game</button>&nbsp;&nbsp;Need: 10000 <br/><br/></>}
    
  </div>
}