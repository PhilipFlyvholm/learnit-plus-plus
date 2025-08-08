import { createSwapy } from "swapy"

// Stable identifiers
type ItemId = string // e.g. "block_starredcourses"
type SlotIndex = number // 0..n
type ItemToSlotMap = Record<ItemId, SlotIndex>

const SELECTORS = {
  region: "#block-region-content",
  sections: 'section[class*="block_"]',
  // IMPORTANT: This element should be the React root for widgets.
  itemWithinSection: ".card-body.p-3"
}

export function initializeDashboardSwappy() {
  const blockRegion = document.querySelector(SELECTORS.region) as HTMLElement
  if (!blockRegion) return

  // Prepare slots and items
  const sections = Array.from(
    blockRegion.querySelectorAll<HTMLElement>(SELECTORS.sections)
  )

  // Assign slots and items
  sections.forEach((section, idx) => {
    section.setAttribute("data-swapy-slot", String(idx))

    const itemEl = section.querySelector<HTMLElement>(
      SELECTORS.itemWithinSection
    )
    const blockId = getBlockId(section)

    if (!itemEl) {
      console.warn(
        "Swapy: No swappable item found in section, expected one .card-body.p-3",
        section
      )
      return
    }
    if (!blockId) {
      console.warn("Swapy: No unique block_* class on section", section)
      return
    }

    // Mark the draggable item with a stable id
    itemEl.setAttribute("data-swapy-item", blockId)
  })

  // Load saved layout and apply before enabling interactions
  loadLayout().then((saved) => {
    const effectiveMap = saved ?? buildDefaultMap(blockRegion)
    applyLayoutFromMap(blockRegion, effectiveMap)

    // Initialize Swapy
    const swapy = createSwapy(blockRegion, {
      animation: "dynamic",
      swapMode: "drop",
      autoScrollOnDrag: true,
      dragOnHold: true
      // If supported, prefer full control:
      // manualSwap: true
    })

    // Persist mapping on swap end
    swapy.onSwapEnd((event) => {
      if (!event.hasChanged) return

      // slot -> item mapping as strings, e.g. { "0": "block_x", ... }
      const slotToItem = event.slotItemMap.asObject as Record<string, ItemId>

      // Convert to item -> slot for persistence
      const itemToSlot: ItemToSlotMap = {}
      Object.entries(slotToItem).forEach(([slotStr, itemId]) => {
        const idx = Number(slotStr)
        if (!Number.isNaN(idx) && itemId) {
          itemToSlot[itemId] = idx
        }
      })

      chrome.storage.local.set({ dashboardLayout: itemToSlot }, () => {
        // Ensure DOM matches the saved mapping even if Swapy mutated DOM
        applyLayoutFromMap(blockRegion, itemToSlot)
      })
    })
  })
}

// Helpers
function getBlockId(section: Element): ItemId | null {
  const cls = Array.from(section.classList).find((c) => c.startsWith("block_"))
  return cls ?? null
}

function buildDefaultMap(root: HTMLElement): ItemToSlotMap {
  const map: ItemToSlotMap = {}
  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(SELECTORS.sections)
  )
  sections.forEach((section, idx) => {
    const blockId = getBlockId(section)
    const itemEl = section.querySelector(SELECTORS.itemWithinSection)
    if (blockId && itemEl) {
      map[blockId] = idx
    }
  })
  return map
}

// Move each [data-swapy-item="<id>"] into the section with data-swapy-slot="<slot>"
function applyLayoutFromMap(root: HTMLElement, map: ItemToSlotMap) {
  // Build lookup of slots by index
  const slots = new Map<SlotIndex, HTMLElement>()
  root.querySelectorAll<HTMLElement>("[data-swapy-slot]").forEach((slotEl) => {
    const idx = Number(slotEl.getAttribute("data-swapy-slot"))
    if (!Number.isNaN(idx)) slots.set(idx, slotEl)
  })

  Object.entries(map).forEach(([itemId, slotIdx]) => {
    const slotEl = slots.get(slotIdx)
    const itemEl = root.querySelector<HTMLElement>(
      `[data-swapy-item="${CSS.escape(itemId)}"]`
    )

    if (!slotEl || !itemEl) return

    // Only move if not already in the target slot
    if (itemEl.parentElement !== slotEl) {
      slotEl.appendChild(itemEl)
    }
  })
}

function loadLayout(): Promise<ItemToSlotMap | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["dashboardLayout"], (res) => {
      resolve((res.dashboardLayout as ItemToSlotMap | undefined) ?? null)
    })
  })
}
