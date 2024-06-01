export function replaceResourceTags(){
    const resourceLinks = document.querySelectorAll(".resource .activityname a.aalink");
    if(resourceLinks.length == 0) return;
    resourceLinks.forEach((item: Element) => {
        item.setAttribute("target", "_blank");
        item.removeAttribute("onclick");
        item.setAttribute("href", item.getAttribute("href") + "&redirect=1");
    });

}