import { createSwapy, utils } from "swapy"

export function initializeDashboardSwappy() {
  const blockRegion = document.querySelector("#block-region-content") as HTMLElement
  if (!blockRegion) return

  // Ensure attributes are added on elements
  const sections = blockRegion.querySelectorAll('section[class*="block_"]')

  let slot = 0
  sections.forEach((section) => {
    // Add swapy-slot attribute to each section
    section.setAttribute("data-swapy-slot", String(slot))
    slot++

    // Add content as data-swapy-item
    const item = section.getElementsByClassName("card-body p-3")
    if (item && item.length == 1) {
      const className = section.classList.values().find((className) => className.startsWith("block_"))
      if (!className) {
        console.warn("No 'block_<name>' class found for section", section)
      } else {
        item[0].setAttribute("data-swapy-item", className)
      }
    } else {
      console.log("No single item found in section", section, item, "Make sure that only one item exists in each section")
    }
  })

  // Create swappy instance
  const swapy = createSwapy(blockRegion, {
    animation: 'dynamic',
    // enabled: false,
    swapMode: 'drop',
    autoScrollOnDrag: true,
    dragOnHold: true, // Start drag after holding, test this
    // dragAxis: 'both',
    // manualSwap: false, // Let framework handle swaps
  })

  

  // Store the original grid areas for restoration
  const originalGridAreas = new Map<HTMLElement, string>()

  sections.forEach((section) => {
    const computedStyle = window.getComputedStyle(section)
    originalGridAreas.set(section as HTMLElement, computedStyle.gridArea)
  })

  // Listen for swappy events
  swapy.onSwapEnd(event => {
    if (event.hasChanged) {
      // Update grid layout after swap
      chrome.storage.local.set({ dashboardLayout: event.slotItemMap.asObject })
    }
  })

  // on("swapy:end", (event) => {
  //   updateGridLayout(event.dragEl, event.overEl)
  //   saveLayoutToStorage()
  // })

  // Load saved layout on initialization
  // loadLayoutFromStorage()
}


function saveLayoutToStorage() {
  const layout: Record<string, string> = {}
  const sections = document.querySelectorAll(
    '#block-region-content section[class*="block_"]'
  )

  sections.forEach((section) => {
    const className = Array.from(section.classList).find((cls) =>
      cls.startsWith("block_")
    )
    if (className) {
      layout[className] = window.getComputedStyle(section).gridArea
    }
  })

  chrome.storage.local.set({ dashboardLayout: layout })
}

function loadLayoutFromStorage() {
  chrome.storage.local.get(["dashboardLayout"], (result) => {
    if (!result.dashboardLayout) return

    const layout = result.dashboardLayout
    Object.entries(layout).forEach(([className, gridArea]) => {
      const section = document.querySelector(
        `#block-region-content section.${className}`
      )
      if (section) {
        ;(section as HTMLElement).style.gridArea = gridArea as string
      }
    })
  })
}
