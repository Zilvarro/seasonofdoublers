import { formatNumber } from "../utilities"

export default function DoublerMediumTab({state, popup, updateState, setTotalClicks}) {
    const buyDoubler = (index, cost)=>{
      updateState({name: "buyDoubler3", index: index, cost: cost})
    }

    const nextSeason = ()=>{
      updateState({name: "nextSeason3"})
    }
    const labels = [<>&nbsp;&nbsp;1st</>,<>&nbsp;&nbsp;2nd</>,<>&nbsp;&nbsp;3rd</>,<>&nbsp;&nbsp;4th</>,<>&nbsp;&nbsp;5th</>,<>&nbsp;&nbsp;6th</>,<>&nbsp;&nbsp;7th</>,<>&nbsp;&nbsp;8th</>,<>&nbsp;&nbsp;9th</>,"10th","11th","12th","13th","14th","15th", "16th"]
    const factors = [1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]
    const unlock = [1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1] //[5e1,5e2,5e3,5e4,5e6,5e8,5e10,5e12,5e14,5e17,5e22,5e31,5e46,5e71,5e139]

    return <div>
      You have {formatNumber(state.points3, state.settings.numberFormat, 3,false,false)} point{Math.floor(state.points3) !== 1 && "s"}.<br/>
      You gain {formatNumber(state.pointrate3, state.settings.numberFormat, 3,false,false)} point{state.pointrate3 !== 1 && "s"} per second.<br/><br/>
  
      {state.doublers3.map((level,index)=>{
        if (state.bestpoints3 >= unlock[index])
          return <div key={index}><button style={{color:"black", width:"100px"}} onClick = {()=>buyDoubler(index,factors[index]*Math.pow(10,(level+1)*(index+1)))} disabled = {state.points3 < factors[index]*Math.pow(10,(level+1)*(index+1))}>{labels[index]} Doubler</button>&nbsp;&nbsp;Cost: {formatNumber(factors[index]*Math.pow(10,(level+1)*(index+1)), state.settings.numberFormat)}<br/></div>
        else if (state.points3 >= unlock[index])
          return <div key={index}>{labels[index]} Doubler: Unlocks Next Season!</div>
        else
          return <div key={index}>{labels[index]} Doubler:Reach {formatNumber(unlock[index], state.settings.numberFormat)} points!</div>
      })}
      <br/><br/>
      <button onClick={nextSeason}>Next Season</button><br/><br/>
    </div>
}