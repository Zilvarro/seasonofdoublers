import { formatNumber } from "../utilities";

export default function DoublerSlowTab({state, popup, updateState, setTotalClicks}) {

  const onNextSeasonClick = ()=>{
    updateState({name: "finishSeason"})
  }

  const buyDoubler = (index, cost)=>{
    updateState({name: "buyDoubler", index: index, cost: cost})
  }

  const toggleAuto = (index)=>{
    updateState({name: "toggleAuto", index: index})
  }
  const toggleAutoSeason = (index)=>{
    updateState({name: "toggleAutoSeason", index: index})
  }
  const labels = [<>&nbsp;1st</>,<>&nbsp;2nd</>,<>&nbsp;3rd</>,<>&nbsp;4th</>,<>&nbsp;5th</>,<>&nbsp;6th</>,<>&nbsp;7th</>,<>&nbsp;8th</>,<>&nbsp;9th</>,"10th","11th","12th","13th","14th","15th","16th"]
  const factors = [1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]
  return <div>
    You have {formatNumber(state.points, state.settings.numberFormat, 3,false,false)} point{Math.floor(state.points) !== 1 && "s"}.<br/>
    You gain {formatNumber(state.pointrate, state.settings.numberFormat, 3,false,false)} point{Math.floor(state.pointrate) !== 1 && "s"} per second.<br/><br/>

    {state.doublers.map((level,index)=>{
      return <div key={index}><button  style={{color:"black", width:"100px"}} onClick = {()=>buyDoubler(index,factors[index]*Math.pow(10,(level+1)*(index+1)))} disabled = {state.points < factors[index]*Math.pow(10,(level+1)*(index+1))}>{labels[index]} Doubler</button>&nbsp;&nbsp;Cost: {formatNumber(factors[index]*Math.pow(10,(level+1)*(index+1)), state.settings.numberFormat)} {state.autoLevel > index && <><input type="checkbox" onClick={()=>toggleAuto(index)} checked={state.auto[index]}/> Auto</>}<br/></div>
    })}
    <br/>
    {state.autoSeason && <><input type="checkbox" checked={state.autoSeasonActive} onClick={toggleAutoSeason}/> Auto Season</>}
    <br/><br/>{state.points === Infinity && <button style={{color:"black"}} onClick={onNextSeasonClick}>Next Season</button>}<br/>
    {/* <br/><br/>{<button style={{color:"black"}} onClick={onNextSeasonClick}>Next Season (Cheat)</button>}<br/> */}
  </div>
}