export default function MultiOptionButton({state, updateState, settingName, disabled, description, statusList, visible=true, tooltip, tooltipList}) {
    if (!visible) return undefined

    const currentStatus = state.settings[settingName]
    const currentIndex = statusList.indexOf(currentStatus)
    const nextIndex = (currentIndex + 1) % statusList.length
    const nextStatus = statusList[nextIndex]
    const changeSetting = ()=>{
        updateState({name:"changeSetting", settingName: settingName, nextStatus})
    }

    let fullToolTip = ""
    if (tooltipList)
        fullToolTip = tooltip + ((currentStatus && tooltipList[currentIndex]) ? "\n" + currentStatus + ": " + tooltipList[currentIndex] : "")
    else if (tooltip)
        fullToolTip = tooltip

    return (
        <button style={{color:"black"}} title={fullToolTip} disabled={disabled} onClick={changeSetting}>{description}: {currentStatus}</button>
    )
}