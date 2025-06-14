import { Buffer } from "buffer";

import {invitation, newSave, productive, save, version} from './savestate'
import {spaces, notify, stringifyProperly} from './utilities'
import MultiOptionButton from './MultiOptionButton'

export default function OptionScreen({state, popup, updateState, setTotalClicks}) {
  const saveGame = ()=>{
    save(state)
    notify.success("Game Saved")
  }

  const exportGame = ()=>{
    const encodedState = Buffer.from(stringifyProperly(state)).toString("base64");
    const success = ()=>notify.success("Copied to Clipboard")
    const failed = ()=>notify.error("Export failed")
    if(navigator.clipboard)
      navigator.clipboard.writeText(encodedState).then(success, failed)
    else
      fallbackCopyTextToClipboard(encodedState, success, failed)
  }

  const exportAsFile = ()=>{
    const encodedState = Buffer.from(stringifyProperly(state)).toString("base64");
    const element = document.createElement("a")
    const file = new Blob([encodedState], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "IdleFormulas.txt"
    document.body.appendChild(element)
    element.click()
    element.remove()
  }


  function fallbackCopyTextToClipboard(text, success, failed) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      if (successful)
        success()
      else
        failed()
    } catch (err) {
      failed()
      console.error(err)
    }
  
    document.body.removeChild(textArea);
  }


  const importGame = ()=>{
    popup.prompt("IMPORT", "Paste your savestring here...", ["IMPORT", "CANCEL"], (option, popupState)=>{
      const encodedState = popupState.inputText;
      if (option==="CANCEL" || !encodedState) return

      try {
        const decodedState = JSON.parse(Buffer.from(encodedState,"base64").toString())
        const stateToLoad = {...structuredClone(newSave), ...decodedState, settings:{...structuredClone(newSave.settings), ...decodedState.settings}, saveTimeStamp: Date.now(), currentEnding: decodedState.currentEnding, justLaunched: true}
        popup.confirm("This will overwrite your current save! Are you sure?", ()=>{
          console.log("Attempting to load")
          updateState({name: "load", state: stateToLoad})
          setTotalClicks((x)=>x+1)
          notify.success("Save Imported")
        })
      } catch (error) {
        console.error(error)
        notify.error("IMPORT FAILED")
        return
      }
    })
  }

  const resetSave = ()=>{
    popup.confirm("This resets everything and you do not get anything in return. Are you really sure?",()=>{
      popup.confirm("Are you really really sure?",()=>{
        popup.confirm("Are you totally absolutely enthusiastically sure?",()=>{
          updateState({name: "hardreset"})
          setTotalClicks((x)=>x+1)
          notify.warning("Game Reset")
        })
      })
    })
  }

  const cheat = ()=>{
    updateState({name: "cheat"})
    notify.warning("CHEATER", "You cheated not only the game, but yourself!")
  }

  return (<div style={{marginLeft: "20px"}}>
    <h1>Options</h1>
      <p>
        {spaces()}<button title={"Perform a manual save. The game also automatically saves every 10 seconds"} onClick={saveGame} disabled={state.mileStoneCount < 1}>Manual Save</button><br/><br/>
        {spaces()}<button title={"Exports the current game state as a text string to the clipboard"} onClick={exportGame} disabled={state.mileStoneCount < 1}>Export</button>
        {spaces()}<button title={"Exports the current game state as a text file for download"} onClick={exportAsFile} disabled={state.mileStoneCount < 1}>Export File</button>
        {spaces()}<button title={"Imports a previously exported text string and restores its game state"} onClick={importGame}>Import</button>
      </p>
      {!!window.installPromptPWAevent && <p>{spaces()}<button onClick={()=>{window.installPromptPWAevent.prompt(); window.installPromptPWAevent = null; popup.alert(<>IMPORTANT NOTE:<br/><br/>The game data is still stored in the browser even when using the app.<br/>Therefore deleting the browser cache also resets the app including your save.</>)}}>Install as Web-App</button></p>}
      <p>
        {spaces()}<MultiOptionButton settingName="numberFormat" statusList={["LETTER","SCIENTIFIC","AMBIGUOUS"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
          description="Number Format" tooltip="Controls how numbers are displayed" tooltipList={["Use letters for thousands: K,M,B,T,Q,P,S,V,O,N,D","Use scientific notation", "Use ambigous notation"]}/>
      </p>
      <p>
        {spaces()}<button title={"Starts a new game. This will overwrite your current save file."} onClick={resetSave}>Hard Reset</button>
      </p>
      {false && !productive && <p>
        {spaces()}<button onClick={cheat}>Cheat</button>
      </p>}
      <details>
        <summary>Pop-Up-Settings</summary>
        <p>
          {spaces()}<MultiOptionButton settingName="offlineProgressPopup" statusList={["ON","LAUNCH","OFF"]} state={state} updateState={updateState} setTotalClicks={setTotalClicks}
            description="Offline Progress Pop-Up" tooltip="Controls whether the offline progress popup is shown" tooltipList={["Shown at launch and after inactive periods","Only shown at launch/loading", "Never shown"]}/>
        </p>
      </details>
      <br/>
      <details>
        <summary>Hotkey-Settings</summary>
      </details>

      <br/>
      <p>Version:&nbsp;&nbsp;{version}{!productive && <>&nbsp;&nbsp;[Development Build]</>}</p>
      <p>This game is created by Zilvarro.</p>
        <p><a href={"https://discord.gg/" + invitation} target="_blank" rel="noopener noreferrer">Join the Discord Community</a></p>
  </div>)
}