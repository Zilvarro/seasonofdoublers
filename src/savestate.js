import { Buffer } from "buffer";
import {notify, secondsToHms, stringifyProperly} from './utilities'
import Decimal from "decimal.js";

export const majorversion = "1"
export const version = "1.00d"
export const productive = false
export var invitation = "efHyDkqGRZ"

export const newSave = {
    version: version,
    productive: productive,
    progressionLayer: 0,
    selectedTabKey: "DoublerScreen",
    selectedDoublerTabKey: "DoublerFastTab",
    
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
    points2: 0,
    pointrate2: 1,
    doublers2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    bestpoints: 0,
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

        //Points for Season of Doubling
        state.points += state.pointrate * deltaMilliSeconds / 1000
        //debugger;
        state.points2 += state.pointrate2 * deltaMilliSeconds / 1000
        //state.points2 = state.points2.plus(state.pointrate2.times(deltaMilliSeconds / 1000) ) 

        break;
    case "selectTab":
        state.selectedTabKey = action.tabKey
        break;
    case "selectDoublerTab":
        state.selectedDoublerTabKey = action.tabKey
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
        state.points -= action.cost
        break;
    case "resetSeason2":
        state.doublers2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        state.points2 = 0 //new Decimal(0)
        state.pointrate2 = 1 // new Decimal(1)
        state.bestpoints = 0
        break;
    case "nextSeason":
        state.bestpoints = state.points2
        state.doublers2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        state.points2 = 0 //new Decimal(0)
        state.pointrate2 = 1 // new Decimal(1)
        break;
    case "buyDoubler2":
        state.pointrate2 *= 2
        state.doublers2[action.index]++
        state.points2 -= action.cost
        break;
    default:
        console.error("Action " + action.name + " not found.")
    }
    return state;
}