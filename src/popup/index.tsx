import "./index.css"
import "./nice-forms/nice-forms.css"
import "./nice-forms/nice-forms-theme.css"

import React, { useEffect, useId, useMemo, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { DarkModeState, defaultTheme, themes } from "~/styles/main"

type Settings = {
  theme: string
  darkMode: boolean
  moreTargetBlank: "off" | "external" | "all"
  customCSS: string
}

const DEFAULTS: Settings = {
  theme: defaultTheme,
  darkMode: false,
  moreTargetBlank: "off",
  customCSS: ""
}

export default function IndexPopup() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<"basic" | "advanced" | "dev">("basic")

  useEffect(() => {
    try {
      chrome.storage.local.get(
        ["theme", "darkMode", "moreTargetBlank", "customCSS"],
        (result) => {
          if (chrome.runtime?.lastError) {
            console.warn("storage.get error", chrome.runtime.lastError)
          }
          const merged: Settings = { ...DEFAULTS, ...result }
          merged.theme = merged.theme in themes ? merged.theme : DEFAULTS.theme
          setSettings(merged)
          setLoaded(true)
        }
      )
    } catch (e) {
      console.warn("storage.get failed", e)
      setLoaded(true)
    }
  }, [])

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    try {
      sendToBackground({
        name: "awaiken",
        body: { id: 123 } // Dummy body to keep the function call valid
      }).catch((err) => console.debug("bg message failed:", err))
    } catch {}
    try {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime?.lastError) {
          console.warn("storage.set error", chrome.runtime.lastError)
        }
        setSettings((prev) => ({ ...prev, [key]: value }))
      })
    } catch (e) {
      setSettings((prev) => ({ ...prev, [key]: value }))
    }
  }

  function restoreDefault(key: string, backupKeyPostfix = "backup") {
    try {
      chrome.storage.local.get([key + backupKeyPostfix], (result) => {
        const defaultValue = result[key + backupKeyPostfix]
        if (defaultValue !== undefined) {
          chrome.storage.local.set({ [key]: defaultValue }, () => {
            if (chrome.runtime?.lastError) {
              console.warn("storage.set error", chrome.runtime.lastError)
            }
            console.log("Restored: " + key);
          })
        } else {
          console.error("No backup found for " + key)
          console.log("Removes " + key + " from storage instead.")
          chrome.storage.local.remove([key], () => {
            if (chrome.runtime?.lastError) {
              console.warn("storage.remove error", chrome.runtime.lastError)
            }
            console.log("Removed: " + key);
          })
        }
      })
    } catch (e) {
      console.warn("restoreDefault failed", e)
    }
  }

  const themeInfo = useMemo(
    () => themes[settings.theme] ?? themes[defaultTheme],
    [settings.theme]
  )

  return (
    <div
      className="popup-root
        w-[360px] max-h-[560px] overflow-hidden
        bg-[var(--card-bg-color)]
        text-[var(--page-fg-color)]
      ">
      <Header />

      <div className="px-3 pt-2 pb-3">
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          options={[
            { label: "Basic", value: "basic" },
            { label: "Advanced", value: "advanced" },
            ...(process.env.NODE_ENV === "development"
              ? [{ label: "Dev", value: "dev" as const }]
              : [])
          ]}
        />
      </div>

      <Divider />

      <div className="px-3 pb-3">
        {!loaded ? (
          <Skeleton />
        ) : (
          <div className="max-h-[400px] overflow-auto pr-1 content-scroll">
            {tab === "basic" && (
              <SectionCard title="Basic settings" subtitle="Everyday controls">
                <FormRow label="Theme" hint="Pick a predefined theme">
                  <Select
                    id="themes"
                    value={settings.theme}
                    onChange={(v) => update("theme", v)}
                    options={Object.keys(themes).map((t) => ({
                      label: t,
                      value: t
                    }))}
                  />
                </FormRow>

                {themeInfo.darkModeState === DarkModeState.OPTIONAL && (
                  <FormRow
                    label="Enable dark mode"
                    hint="Only if the selected theme supports it">
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onChange={(v) => update("darkMode", v)}
                    />
                  </FormRow>
                )}

                <FormRow
                  label="Open links in new tab"
                  hint="Control target behavior">
                  <Segmented
                    value={settings.moreTargetBlank}
                    onChange={(v) =>
                      update(
                        "moreTargetBlank",
                        v as Settings["moreTargetBlank"]
                      )
                    }
                    options={[
                      { label: "Off", value: "off" },
                      { label: "External", value: "external" },
                      { label: "All", value: "all" }
                    ]}
                  />
                </FormRow>
              </SectionCard>
            )}

            {tab === "advanced" && (
              <SectionCard title="Advanced settings" subtitle="For power users">
                {/* <FormRow
                  label="Custom CSS"
                  hint="Applied to pages where the extension runs">
                  <TextArea
                    id="customCSS"
                    value={settings.customCSS}
                    placeholder="Paste your CSS here"
                    onChange={(v) => update("customCSS", v)}
                  />
                </FormRow> */}

                <div className="pt-1">
                  <DangerZone
                    onResetDashboard={() => restoreDefault("dashboardLayout")}
                  />
                </div>
              </SectionCard>
            )}

            {tab === "dev" && process.env.NODE_ENV === "development" && (
              <SectionCard
                title="Developer"
                subtitle="Debug and maintenance"
                tone="subtle">
                <FormRow
                  label="Clear local storage"
                  hint="Removes all chrome.storage.local keys">
                  <Button
                    kind="ghost"
                    onClick={() => {
                      if (
                        confirm(
                          "Clear chrome.storage.local? This cannot be undone."
                        )
                      ) {
                        chrome.storage.local.clear(() =>
                          <MessageModal
                            open={true}
                            title="Storage cleared"
                          />
                        )
                      }
                    }}>
                    Clear storage
                  </Button>
                </FormRow>
              </SectionCard>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-[var(--page-fg-color-alt)]">
            Settings save automatically
          </span>
          <div className="flex gap-2">
            <Button kind="ghost" onClick={() => setSettings(DEFAULTS)}>
              Reset (UI)
            </Button>
            <Button
              onClick={() => {
                chrome.storage.local.set(settings, () => {
                  <MessageModal
                    open={true}
                    title="Saved"
                  />
                })
              }}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div
      className="
        flex items-center gap-3 px-3 py-3 border-b
        border-[var(--page-border-color)]
        bg-[var(--card-header-bg-color)]
      ">
      <img
        src="/assets/images/logo-128.png"
        alt="Logo"
        className="h-7 w-7 rounded-md"
      />
      <div className="flex min-w-0 flex-col">
        <h1 className="text-sm font-semibold tracking-wide">
          Extension Settings
        </h1>
        <p className="text-xs text-[var(--page-fg-color-alt)]">
          Minimal • Modern • Fast
        </p>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="px-3 pb-3">
      <div
        className="
          h-[1px] w-full rounded-full
          bg-[var(--page-border-color)] opacity-60
        "
      />
    </div>
  )
}

function SectionCard(props: {
  title: string
  subtitle?: string
  tone?: "default" | "subtle"
  children: React.ReactNode
}) {
  const tone = props.tone ?? "default"
  return (
    <section
      className={`
        mb-3 rounded-xl border p-3
        ${
          tone === "default"
            ? "bg-[var(--card-bg-color)]"
            : "bg-[var(--card-sub-bg-color)]"
        }
        ${
          tone === "default"
            ? "border-[var(--card-border-color)]"
            : "border-[color-mix(in_srgb,var(--card-border-color),#fff_5%)]"
        }
      `}>
      <div className="mb-2">
        <h2 className="text-[13px] font-semibold">{props.title}</h2>
        {props.subtitle && (
          <p className="text-xs text-[var(--page-fg-color-alt)]">
            {props.subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">{props.children}</div>
    </section>
  )
}

function FormRow(props: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-xs font-medium">
          {props.label}
        </label>
        {props.hint && (
          <p className="text-xs text-[var(--page-fg-color-alt)]">
            {props.hint}
          </p>
        )}
      </div>
      <div className="shrink-0">
        {React.isValidElement(props.children)
          ? React.cloneElement(props.children as any, { id })
          : props.children}
      </div>
    </div>
  )
}

function Tabs<T extends string>(props: {
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div
      role="tablist"
      className="
        inline-flex rounded-xl bg-[var(--field-bg-color)]
        p-1 border border-[var(--field-border-color)]
      ">
      {props.options.map((opt) => {
        const selected = props.value === opt.value
        return (
          <button
            key={opt.value as string}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => props.onChange(opt.value)}
            className={`
              relative px-3 py-1.5 text-xs font-medium rounded-lg
              transition-colors
              ${
                selected
                  ? "bg-gradient-to-tr from-[var(--lpp-blue)] to-[var(--lpp-blue-darker)] text-black"
                  : "text-[var(--page-fg-color-alt)] hover:text-[var(--page-fg-color)]"
              }
            `}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function Segmented<T extends string>(props: {
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div
      className="
        inline-flex rounded-lg bg-[var(--field-bg-color)]
        p-0.5 border border-[var(--field-border-color)]
      ">
      {props.options.map((opt) => {
        const active = props.value === opt.value
        return (
          <button
            key={opt.value as string}
            type="button"
            aria-pressed={active}
            onClick={() => props.onChange(opt.value)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-md
              transition-colors
              ${
                active
                  ? "bg-[var(--button-noticed-bg-color)] text-black"
                  : "text-[var(--page-fg-color-alt)] hover:text-[var(--page-fg-color)]"
              }
            `}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function Switch(props: {
  id?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      id={props.id}
      type="button"
      role="switch"
      aria-checked={props.checked}
      onClick={() => props.onChange(!props.checked)}
      className={`
        relative inline-flex h-6 w-10 items-center rounded-full
        border transition-colors focus:outline-none focus:ring-2
        focus:ring-[var(--link-focus-color)]
        ${
          props.checked
            ? "bg-[var(--button-noticed-bg-color)] border-transparent"
            : "bg-[var(--field-bg-color)] border-[var(--field-border-color)]"
        }
      `}>
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${props.checked ? "translate-x-4" : "translate-x-1"}
        `}
      />
    </button>
  )
}

function Select(props: {
  id?: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <div
      className="
        relative inline-flex items-center rounded-lg border
        border-[var(--field-border-color)]
        bg-[var(--field-bg-color)]
      ">
      <select
        id={props.id}
        className="
          appearance-none bg-transparent px-3 py-1.5 pr-7 text-xs
          text-[var(--page-fg-color)] focus:outline-none focus:ring-2
          focus:ring-[var(--link-focus-color)] rounded-lg
        "
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}>
        {props.options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-[var(--popupmenu-bg-color)]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 h-3.5 w-3.5
        text-[var(--page-fg-color-alt)]"
      />
    </div>
  )
}

function TextArea(props: {
  id?: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      id={props.id}
      className="
        w-[240px] h-[120px] rounded-lg border
        border-[var(--field-border-color)]
        bg-[var(--field-bg-color)]
        px-3 py-2 text-xs font-mono leading-5
        text-[var(--page-fg-color)]
        placeholder:text-[var(--lpp-gray-blue-300)]
        focus:outline-none focus:ring-2
        focus:ring-[var(--link-focus-color)]
      "
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      spellCheck={false}
    />
  )
}

function Button(props: {
  children: React.ReactNode
  onClick?: () => void
  kind?: "primary" | "ghost"
}) {
  const kind = props.kind ?? "primary"
  const base =
    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs " +
    "font-semibold transition-colors focus:outline-none " +
    "focus:ring-2 focus:ring-[var(--link-focus-color)]"
  const styles =
    kind === "ghost"
      ? "bg-[var(--button-unnoticed-bg-color)] text-[var(--button-unnoticed-fg-color)] hover:bg-[var(--lpp-gray-700)]"
      : "bg-[var(--button-noticed-bg-color)] text-black hover:brightness-110"
  return (
    <button
      type="button"
      className={`${base} ${styles}`}
      onClick={props.onClick}>
      {props.children}
    </button>
  )
}

function DangerZone(props: { onResetDashboard: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div
      className="
        rounded-lg border border-[var(--card-border-color)]
        bg-[color-mix(in_srgb,var(--lpp-blue),#000_94%)] p-3
      ">
      <div className="mb-2 flex items-center gap-2">
        <WarningIcon className="h-4 w-4 text-[var(--lpp-blue)]" />
        <span className="text-xs font-semibold">Caution</span>
      </div>
      <p className="mb-2 text-xs text-[var(--page-fg-color-alt)]">
        Reset dashboard layout to the backed-up defaults.
      </p>
      <Button
        kind="ghost"
        onClick={() => setConfirmOpen(true) }>
        Reset dashboard layout
      </Button>
      <MessageModal
        open={confirmOpen}
        title="Reset dashboard layout"
        onClose={() => setConfirmOpen(false)}
        children={
          <p className="text-sm text-[var(--page-fg-color-alt)]">
            Are you sure you want to reset the dashboard layout? This action
            cannot be undone.
          </p>
        }
        actions={[
          { label: "Cancel", onClick: () => setConfirmOpen(false) , kind: "ghost"},
          { label: "Reset", onClick: () => { 
              props.onResetDashboard();
              setConfirmOpen(false); 
            }, kind: "primary"
          }
        ]}
      />
    </div>
  )
}

/* Icons */

function ChevronDown(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={props.className}
      aria-hidden="true">
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WarningIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={props.className}
      aria-hidden="true">
      <path
        d="M12 3l9 16H3L12 3z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M12 9v4m0 3h.01"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-20 rounded-xl bg-[var(--lpp-gray-700)]/60" />
      <div className="h-32 rounded-xl bg-[var(--lpp-gray-700)]/60" />
    </div>
  )
}

function MessageModal(props: {
  open: boolean
  title?: string
  children?: React.ReactNode
  onClose?: () => void
  actions?: { label: string; onClick: () => void; kind?: "primary" | "ghost" }[]
}) {
  const { open, title, children, onClose, actions } = props
  console.log("MessageModal:", { title, children, actions })

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  console.log("Rendering MessageModal:", { title, children, actions })

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose?.()}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-[320px] max-w-[92%] rounded-lg border p-4 shadow-xl
                   bg-[var(--card-bg-color)] border-[var(--card-border-color)] text-[var(--page-fg-color)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onClose?.()}
            className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md
                       text-[var(--page-fg-color-alt)] hover:bg-[var(--field-bg-color)]"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 text-sm text-[var(--page-fg-color-alt)]">
          {children}
        </div>

        {actions && actions.length > 0 && (
          <div className="mt-4 flex justify-end gap-2">
            {actions.map((a, i) => (
              <Button
                key={i}
                kind={a.kind ?? "primary"}
                onClick={() => {
                  a.onClick()
                }}
              >
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}