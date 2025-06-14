import React from "react";

import {save} from './savestate'

//Tries to save the game right before the tab is closed
class AutoSave extends React.Component{
  constructor(props){
    super(props);
    this.onUnload = this.onUnload.bind(this)
    this.save = save
  }

  onUnload(e){
    if (this.props.saveState.settings.autoSave === "ON") {
      this.save(this.props.saveState)
    }
  }

  render(){
    return undefined
  }

  componentDidMount(){
    window.addEventListener("beforeunload", this.onUnload);
  }

  componentWillUnmount(){
    window.removeEventListener("beforeunload", this.onUnload);
  }
}
 
export default AutoSave;