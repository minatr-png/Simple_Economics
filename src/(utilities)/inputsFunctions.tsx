const onEnterPress = (ev, tabIndex:number) => {
    if (ev.key !== "Enter") return;
    
    if(tabIndex === 99) {
        document.getElementById("MainButton").click();
    } else {
        (document.querySelector(`[tabindex="${tabIndex+1}"]`) as any).focus();
    }
}

export default onEnterPress;