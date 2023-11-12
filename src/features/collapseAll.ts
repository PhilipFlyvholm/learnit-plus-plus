export function addCollapseAllButton(){
    const courseIndex = document.getElementById("courseindex")
    if(courseIndex == null) return;
    let collapseAllContainer = document.createElement("div");
    collapseAllContainer.id = "collapseAllContainer";
    collapseAllContainer.className = "collapsed";
    if(!isCollapsed(courseIndex)){
        collapseAll()
    }
    let collapseAllButton = document.createElement("button");
    collapseAllButton.innerHTML = "Collapse all";
    collapseAllButton.onclick = collapseAll;
    collapseAllButton.className = "collapseAllButton btn-link";
    collapseAllContainer.appendChild(collapseAllButton);
    let openAllButton = document.createElement("button");
    openAllButton.innerHTML = "Expand all";
    openAllButton.onclick = openAll;
    openAllButton.className = "openAllButton btn-link";
    collapseAllContainer.appendChild(openAllButton);
    courseIndex.prepend(collapseAllContainer);
}

export function removeChervonIfNoChildren(){
    const courseIndex = document.getElementById("courseindex")
    if(courseIndex == null) return;
    const chevrons = courseIndex.querySelectorAll(".courseindex-chevron");
    
    chevrons.forEach((item: Element) => {
        const grandParent = item.parentElement?.parentElement;
        if(grandParent == null) return;
        const itemContent = grandParent.querySelector(".courseindex-sectioncontent");
        if(itemContent == null) return;
        const subItems = itemContent.querySelectorAll("li");
        
        if(subItems.length == 0){
            item.classList.add("visibility-hidden");
            //item.parentElement?.removeChild(item);
        }
    });
}

function isCollapsed(container: HTMLElement){
    const openItems = container.querySelectorAll(".courseindex-item.show");
    return openItems.length != 0;
}

function collapseAll(){
    //Get the container
    const courseIndex = document.getElementById("courseindex")
    if(courseIndex == null) return;

    //Remove show to content
    const openItems = courseIndex.querySelectorAll(".courseindex-item-content.show");
    openItems.forEach((item: Element) => {
        item.classList.remove("show");
    });

    //Add collapsed to chevron
    const chevrons = courseIndex.querySelectorAll(".courseindex-chevron:not(.collapsed)");
    chevrons.forEach((item: Element) => {
        item.classList.add("collapsed");
    });

    // Add the collapsed class from the container
    const collapseAllButton = document.querySelector(".collapseAllButton");
    if(collapseAllButton == null) return;
    collapseAllButton.parentElement?.classList.add("collapsed");
}

function openAll(){
    //Get the container
    const courseIndex = document.getElementById("courseindex")
    if(courseIndex == null) return;
    
    //Add show to content
    const closedItems = courseIndex.querySelectorAll(".courseindex-item-content:not(.show)");
    closedItems.forEach((item: Element) => {
        item.classList.add("show");
    });
    //Remove collapsed to chevron
    const chevrons = courseIndex.querySelectorAll(".courseindex-chevron.collapsed");
    chevrons.forEach((item: Element) => {
        item.classList.remove("collapsed");
    });

    // Remove the collapsed class from the container
    const collapseAllButton = document.querySelector(".collapseAllButton");
    if(collapseAllButton == null) return;
    collapseAllButton.parentElement?.classList.remove("collapsed");
}