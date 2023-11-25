const onEnterPress = (ev, tabIndex:number, lastInput:boolean=false) => {
    if (ev.key !== "Enter") return;
    
    if(lastInput || ev.shiftKey) {
        document.getElementById("MainButton").click();
        (document.querySelector(`[tabindex="1"]`) as any).focus();
    } else {
        (document.querySelector(`[tabindex="${tabIndex+1}"]`) as any).focus();
    }
}

export default onEnterPress;