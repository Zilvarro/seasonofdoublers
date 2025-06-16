import { Buffer } from "buffer";
import {notify, secondsToHms, stringifyProperly} from './utilities'

export const majorversion = "1"
export const version = "1.00d"
export const productive = false
export var invitation = "efHyDkqGRZ"

export const newSave = {
    version: version,
    productive: productive,
    progressionLayer: 0,
    saveTimeStamp: 0,
    calcTimeStamp: 0,
    fileStartTimeStamp: -1,
    millisSinceHoldEvent: 0,
    holdAction: null,
    isHolding: false,
    justLaunched: true,
    lastPlayTime: 0,
    points: 0,
    pointrate: 1,
    doublers: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    auto: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    seasons: 0,
    seasonMult: 1,
    seasonMultLevel: 0,
    autoLevel: 0,
    autoSeason: false,
    autoSeasonActive: false,
    autoSeasonDoubler: false,
    autoSeasonDoublerActive: false,
    win: false,
    settings: {
        valueReduction: "ON",
        offlineProgress: "ON",
        offlineProgressPopup: "ON",
        autoSave: "ON",
        autoLoad: "ON",
        numberFormat: "SCIENTIFIC",
        hotKeys: "ON",
    }
}

export const getSaveGame = ()=>{
    const savedversion = window.localStorage.getItem('majorversion')
    let savedgame
    if (savedversion && window.location.href.split("/").pop() !== "?newgame")
        savedgame = window.localStorage.getItem('seasonofdoublers_v' + savedversion)
    if (!savedgame) {
        return ({...structuredClone(newSave), saveTimeStamp: Date.now(), calcTimeStamp: Date.now(), fileStartTimeStamp: Date.now()})
    }
    else{
        const decodedGame = Buffer.from(savedgame,"base64").toString()
        const savedgamejson = JSON.parse(decodedGame)
        if (savedgamejson.settings.autoLoad === "OFF") {
            notify.warning("Auto Load disabled")
            let newgame = {...structuredClone(newSave), saveTimeStamp: Date.now(), calcTimeStamp: Date.now(), fileStartTimeStamp: Date.now()}
            newgame.settings.autoSave = "OFF"
            newgame.settings.autoLoad = "OFF"
            return newgame
        } else {
            return {...structuredClone(newSave), ...savedgamejson, settings:{...structuredClone(newSave.settings), ...savedgamejson.settings}, saveTimeStamp: Date.now(), currentEnding: newSave.currentEnding, justLaunched: true}
        }
    }
}

export const loadGame = ()=>{
    const savedversion = window.localStorage.getItem('majorversion')
    let savedgame
    if (savedversion)
        savedgame = window.localStorage.getItem('seasonofdoublers_v' + savedversion)

    if (!savedgame) {
        notify.error("No savegame found!")
        return undefined
    }
    else {
        notify.success("Game Loaded")
        const savedgamejson = JSON.parse(savedgame)

        return {...structuredClone(newSave), ...savedgamejson, settings:{...structuredClone(newSave.settings), ...savedgamejson.settings}, saveTimeStamp: Date.now(), currentEnding: newSave.currentEnding, justLaunched: true}

    }
}

export const save = (state)=>{
    state.version = version
    state.saveTimeStamp = Date.now()
    let currentgame = stringifyProperly({...state, holdAction:null})
    const encodedGame = Buffer.from(currentgame).toString("base64");
    window.localStorage.setItem('majorversion', majorversion)
    window.localStorage.setItem('seasonofdoublers_v' + majorversion, encodedGame)
}

const finishSeason = (state)=>{
  state.seasons++
  state.doublers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  state.points = 0 
  state.pointrate = state.seasonMult
}

const buySeasonDoubler = (state)=>{
  state.seasonMult *= 2
  state.pointrate *= 2
  state.seasonMultLevel++
}

export const saveReducer = (state, action)=>{
    const popup = action.popup
    switch(action.name){
    case "idle":
        if (action.playTime === state.lastPlayTime) break

        state.productive = state.productive && productive

        state.lastPlayTime = action.playTime
        const timeStamp = Date.now()
        let deltaMilliSeconds = Math.max(timeStamp - state.calcTimeStamp, 0)

        //Offline Progress Popup
        if (deltaMilliSeconds > 120000 && (state.settings.offlineProgressPopup === "ON" || (state.settings.offlineProgressPopup === "LAUNCH" && state.justLaunched))){
            const timeText = <>You were away for {secondsToHms(Math.floor(deltaMilliSeconds / 1000))}</>
            popup.alert(<>{timeText}</>)
        }

        state.calcTimeStamp = timeStamp
        state.justLaunched = false

        //Autosave
        const lastSaveMilliseconds = (timeStamp - state.saveTimeStamp)
        if (state.settings.autoSave === "ON" && lastSaveMilliseconds >= 10000) {
            save(state)
        }

        const calcProgress = (state, deltaMilliSeconds)=>{
          //Points for Season of Doubling
          state.points += state.pointrate * deltaMilliSeconds / 1000
  
          //Auto Doublers
          const factors = [1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]
          for (let i = 0; i < state.doublers.length; i++) {
            if (state.auto[i]) {
              let cost = factors[i]*Math.pow(10,(state.doublers[i]+1)*(i+1))
              if (state.points >= cost) {
                state.pointrate *= 2
                state.doublers[i]++
                if (cost !== Infinity) state.points -= cost
              }
            }
          }
  
          //Auto Season
          if (state.autoSeasonActive && state.points === Infinity) {
            finishSeason(state)
          }

          //Auto Season Doubler
          if (state.autoSeasonDoublerActive && state.seasons > state.seasonMultLevel) {
            buySeasonDoubler(state)
          }

          //Prevent NaN
          if (isNaN(state.points))
            state.points = Infinity
        }

        //Calculate 120 ticks in Offline Progress usecase
        if (deltaMilliSeconds > 120000) {
          for (let i = 0; i < 120; i++) {
            calcProgress(state, deltaMilliSeconds / 120)
          }
        } else {
          calcProgress(state, deltaMilliSeconds)
        }

        break;
    case "selectTab":
        state.selectedTabKey = action.tabKey
        break;
    case "hardreset":
        state = {...structuredClone(newSave), calcTimeStamp: Date.now(), saveTimeStamp: Date.now(), fileStartTimeStamp: Date.now()};
        break;
    case "load":
        state = action.state || loadGame() || state;
        break;
    case "changeSetting":
        state.settings[action.settingName] = action.nextStatus
        break;

    case "resetSeason":
        state.doublers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        state.points = 0
        state.pointrate = 1
        break;
    case "buyDoubler":
        state.pointrate *= 2
        state.doublers[action.index]++
        if (action.cost !== Infinity) state.points -= action.cost
        break;
    case "buySeasonDoubler":
        buySeasonDoubler(state)
        break;
    case "buyAuto":
        state.autoLevel++
        break;
    case "finishSeason":
        finishSeason(state)
        break;
    case "toggleAuto":
        state.auto[action.index] = !state.auto[action.index]
        break;
    case "toggleAutoSeason":
        state.autoSeasonActive = !state.autoSeasonActive
        break;
    case "toggleAutoSeasonDoubler":
        state.autoSeasonDoublerActive = !state.autoSeasonDoublerActive
        break;
    case "buyAutoSeason":
        state.autoSeason = true
        break;
    case "buyAutoSeasonDoubler":
        state.autoSeasonDoubler = true
        break;
    case "buyWin":
        state.win = true
        break;
    default:
        console.error("Action " + action.name + " not found.")
    }
    return state;
}