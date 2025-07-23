import React, { useEffect, useRef } from 'react';

export const CalendarModule: React.FC = () => {
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if calendar is already rendered elsewhere and move/copy it here
    const existingCalendar = document.querySelector('[data-block="cohortspecifichtml"].block_timeedit:not(#calendar-module-placeholder)');
    
    if (existingCalendar && placeholderRef.current) {
      // Clone the existing calendar to avoid moving the original
      const calendarClone = existingCalendar.cloneNode(true) as HTMLElement;
      calendarClone.id = 'calendar-module-clone';
      
      // Replace the placeholder content with the calendar
      placeholderRef.current.innerHTML = '';
      placeholderRef.current.appendChild(calendarClone);
    }
  }, []);

  return (
    <div
      ref={placeholderRef}
      id="calendar-module-placeholder"
      className="block_timeedit block card mb-3"
      role="complementary"
      data-block="cohortspecifichtml"
    >
      <div className="card-body p-3">
        <h5 className="card-title d-inline">Calendar</h5>
        <div>Loading calendar...</div>
      </div>
    </div>
  );
};

export default CalendarModule;