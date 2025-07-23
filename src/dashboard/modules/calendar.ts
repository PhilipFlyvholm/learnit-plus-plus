import type { DashboardModule } from '../types';

export function createCalendarModule(): DashboardModule {
  return {
    id: 'calendar',
    name: 'Calendar',
    component: createCalendarComponent,
    enabled: true,
    order: 2
  };
}

function createCalendarComponent(): HTMLElement {
  // The calendar is already handled by calendarRoot.tsx as a separate Plasmo content script
  // We create a placeholder that will be replaced by the actual calendar component
  const placeholder = document.createElement("div");
  placeholder.id = "calendar-module-placeholder";
  placeholder.className = "block_timeedit block card mb-3";
  placeholder.setAttribute("role", "complementary");
  placeholder.setAttribute("data-block", "cohortspecifichtml");
  
  // Check if calendar is already rendered and move it here
  const existingCalendar = document.querySelector('[data-block="cohortspecifichtml"].block_timeedit');
  if (existingCalendar && existingCalendar !== placeholder) {
    return existingCalendar.cloneNode(true) as HTMLElement;
  }
  
  // If not found, create a minimal placeholder that the calendar script will enhance
  const div = document.createElement("div");
  div.className = "card-body p-3";
  
  const header = document.createElement("h5");
  header.className = "card-title d-inline";
  header.textContent = "Calendar";
  
  const content = document.createElement("div");
  content.textContent = "Loading calendar...";
  
  div.appendChild(header);
  div.appendChild(content);
  placeholder.appendChild(div);
  
  return placeholder;
}