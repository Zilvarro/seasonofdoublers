import React, { useState, useEffect, useReducer} from 'react'

import './App.css';
import {saveReducer, getSaveGame} from './savestate'
import TabContent from './TabContent'
import OptionScreen from './OptionScreen'
import AutoSave from './AutoSave'
import {PopupDialog, makeShowPopup} from './PopupDialog'
import KeyBoardHandler from './KeyBoardHandler';
import { schedulePeriodicUpdateChecks } from './serviceWorkerRegistration';
import DoublerScreen from './doublers/DoublerScreen';
import SeasonScreen from './season/SeasonScreen';

function App() {
  const [ playTime, setPlayTime ] = useState(0)
  const [ , setTimer ] = useState()
  const [ , setTotalClicks ] = useState(0) 
  const [ popupState , setPopupState ] = useState({text: "", options: [], visible:false}) 
  
  const [ state, updateState] = useReducer(saveReducer, playTime === 0 && getSaveGame())

  const popup = makeShowPopup(popupState, setPopupState)
  
  useEffect(()=>{
    setTimer((t)=>{
      setInterval(()=>{
        setPlayTime((x)=>x + 1)
      }, 100)
    })
  },[])

  useEffect(()=>{
    if (playTime > 0)
      updateState({name: "idle", popup:popup, playTime:playTime})
  },[playTime, popup])

  //Checks for updates once per hour if online
  useEffect(()=>{
    setTimer((t)=>{
      schedulePeriodicUpdateChecks(3600,()=>{console.log("Attempt Update Check")},()=>{console.log("Update Check Completed")})
    })
  },[])

  const selectTab = (tabKey)=>{
    updateState({name: "selectTab", tabKey: tabKey})
    window.scrollTo(0,0)
    setTotalClicks((x)=>x+1)
  }

  return (<>
    <AutoSave saveState={state}/>
    <KeyBoardHandler state={state} updateState={updateState} popup={popup}/>
    <PopupDialog popupState={popupState} setPopupState={setPopupState} discardable={state.settings.hotkeyDiscardPopup === "ON"}/>
    <TabContent selectedTabKey={state.selectedTabKey}>
      <DoublerScreen tabKey="DoublerScreen" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
      <SeasonScreen tabKey="SeasonScreen" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
      <OptionScreen tabKey="OptionScreen" popup={popup} state={state} updateState={updateState} setTotalClicks={setTotalClicks}/>
    </TabContent>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <footer>
    <span style={{display:"inline-block"}}>
      {<button style={{backgroundColor: "#AAAAAA", border:"2px solid", padding:"5px", margin:"5px", fontWeight:"bold"}} onClick={()=>selectTab("DoublerScreen")}>Doublers</button>}
      {state.seasons > 0 && <button style={{backgroundColor: "#FFFF00", border:"2px solid", padding:"5px", margin:"5px", fontWeight:"bold"}} onClick={()=>selectTab("SeasonScreen")}>Season</button>}
    </span>
    <span style={{display:"inline-block"}}>
      <button style={{margin:"5px"}} onClick={()=>selectTab("OptionScreen")}>Options</button>
    </span>
    </footer>
  </>);
}

export default App;
