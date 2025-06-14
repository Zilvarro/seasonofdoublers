import { formatNumber } from "../utilities";

export default function DoublerSlowTab({state, popup, updateState, setTotalClicks}) {

  const onResetClick = ()=>{
    updateState({name: "resetSeason"})
  }

  const buyDoubler = (index, cost)=>{
    updateState({name: "buyDoubler", index: index, cost: cost})
  }
  const labels = [<>&nbsp;1st</>,<>&nbsp;2nd</>,<>&nbsp;3rd</>,<>&nbsp;4th</>,<>&nbsp;5th</>,<>&nbsp;6th</>,<>&nbsp;7th</>,<>&nbsp;8th</>,<>&nbsp;9th</>,"10th","11th","12th","13th","14th","15th","16th"]
  const factors = [1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]
  return <div>
    You have {formatNumber(state.points, state.settings.numberFormat, 3,false,false)} points.<br/>
    You gain {formatNumber(state.pointrate, state.settings.numberFormat, 3,false,false)} points per second.<br/><br/>

    {state.doublers.map((level,index)=>{
      return <div key={index}><button  style={{color:"black", width:"100px"}} onClick = {()=>buyDoubler(index,factors[index]*Math.pow(10,(level+1)*(index+1)))} disabled = {state.points < factors[index]*Math.pow(10,(level+1)*(index+1))}>{labels[index]} Doubler</button>&nbsp;&nbsp;Cost: {formatNumber(factors[index]*Math.pow(10,(level+1)*(index+1)), state.settings.numberFormat)}<br/></div>
    })}
    
    
    <br/><br/><button style={{color:"black"}} onClick={onResetClick}>Reset</button><br/>
  </div>
}