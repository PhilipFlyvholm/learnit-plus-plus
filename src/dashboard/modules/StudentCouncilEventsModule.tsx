import React, { useState, useEffect } from 'react';
import { getEvents, type EventData } from "../../studentcouncil/eventLoader";

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const date = new Date(event.dtstart);
  const weekDay = date.toLocaleDateString("en-GB", { weekday: "short" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const time = date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric"
  });
  const dateString = `${weekDay}, ${date.getDate()}. ${month}. ${time}`;

  const daysLeftString = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const daysLeft = Math.round(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft === 0) return "Its TODAY!! 🎉🎉🎉";
    if (daysLeft === 1) return "Tomorrow 👀";

    return `In ${daysLeft} days`;
  };

  const description = event.description.endsWith("Read more") 
    ? event.description.substring(0, event.description.length - 9)
    : event.description;

  const shouldShowReadMore = description.length > 100;
  const shortDescription = shouldShowReadMore 
    ? description.substring(0, 100) + "..."
    : description;

  return (
    <div 
      className="card dashboard-card"
      role="listitem"
      data-region="course-content"
      style={{
        width: "48%",
        margin: "1%"
      }}
    >
      <div className="card-body pr-1 course-info-container">
        <div className="w-100">
          <h5 className="coursename mr-2">
            {event.summary}
          </h5>
          <div className="text-muted muted d-flex mb-1 justify-content-between">
            <div className={`expandedText ${!isExpanded ? 'hide-content' : ''}`}>
              <p style={{ fontSize: "0.8rem" }}>
                {isExpanded ? description : shortDescription}
              </p>
              {shouldShowReadMore && (
                <button
                  className="btn btn-custom"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
            <p className="text-truncate">
              {dateString} | {daysLeftString(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentCouncilEventsModule: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section 
        className="block_sc block card mb-3"
        role="complementary"
        data-block="cohortspecifichtml"
      >
        <div className="card-body p-3">
          <h5 id="instance-118819-header" className="card-title d-inline">
            Student Council Events
          </h5>
          <div className="card-text content">
            Loading events...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="block_sc block card mb-3"
      role="complementary"
      data-block="cohortspecifichtml"
    >
      <div className="card-body p-3">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5 id="instance-118819-header" className="card-title d-inline">
            Student Council Events
          </h5>
        </div>
        <div 
          className="card-text content"
          style={{
            display: "flex",
            flexWrap: "wrap",
            ...(events.length === 0 && {
              alignItems: "center",
              justifyContent: "center",
              height: "100%"
            })
          }}
        >
          {events.length === 0 ? (
            <div style={{
              width: "60%",
              textAlign: "center",
              marginTop: "-47px" // Yes sry for magic value but other methods didnt work
            }}>
              <h5>
                There are currently no events planned by the student council
              </h5>
              <p>
                If you believe this is an error then check{" "}
                <a href="https://studentcouncil.dk/events">
                  https://studentcouncil.dk/events
                </a>
                .
              </p>
            </div>
          ) : (
            events.slice(0, 6).map((event, index) => (
              <EventCard key={`${event.summary}-${index}`} event={event} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentCouncilEventsModule;