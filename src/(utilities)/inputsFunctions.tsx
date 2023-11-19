const onEnterPress = (ev, tabIndex:number) => {
    if (ev.key !== "Enter") return;
    
    if(tabIndex === 99 || ev.shiftKey) {
        document.getElementById("MainButton").click();
        (document.querySelector(`[tabindex="1"]`) as any).focus();
    } else {
        (document.querySelector(`[tabindex="${tabIndex+1}"]`) as any).focus();
    }
}

export default onEnterPress;