import React, { useEffect, useState } from "react";
import TicketCard from "./components/Card";
import {
  NoPriority,
  UrgentSVG,
  HighSVG,
  LowSVG,
  MediumSVG,
  TodoSVG,
  InProgressSVG,
  BackLogSVG,
  AddSVG,
  ThreeDotSVG,
  DisplaySVG,
  DownArrowSvg,
  DoneSVG,
  CancelledSVG,
} from "./components/SVGS";
import useFetchData from "./Hooks/TicketDataHook";
import "./App.css";

const svgDictionary = {
  Urgent: <UrgentSVG />,
  High: <HighSVG />,
  Low: <LowSVG />,
  Medium: <MediumSVG />,
  "No priority": <NoPriority />,
  Todo: <TodoSVG />,
  "In progress": <InProgressSVG />,
  Backlog: <BackLogSVG />,
  Done: <DoneSVG />,
  Cancelled: <CancelledSVG />,
};

const SvgDisplay = ({ type }) => {
  return <div>{svgDictionary[type]}</div>;
};

const App = () => {
  const [grouping, setGrouping] = useState(
    localStorage.getItem("grouping") || "status"
  ); // Load from local storage or set default
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "priority"
  ); // Load from local storage or set default

  // Save grouping and sorting options to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    localStorage.setItem("sortBy", sortBy);
  }, [grouping, sortBy]);

  const { tickets, users, error } = useFetchData();

  const getGroupedTickets = () => {
    let groupedTickets = {};

     // Only initialize "Done" and "Cancelled" groups if grouping is by status
    if (grouping === "status") {
      groupedTickets["Done"] = [];
      groupedTickets["Cancelled"] = [];
    }
    
    tickets.forEach((ticket) => {
      let groupKey;
      switch (grouping) {
        case "user":
          groupKey =
            users.find((user) => user.id === ticket.userId)?.name || "Unknown";
          break;
        case "priority":
          groupKey = ["No priority", "Low", "Medium", "High", "Urgent"][
            ticket.priority
          ];
          break;
        default: // Assuming "status" as the default grouping
          groupKey = ticket.status;
          break;
      }

      // Initialize the group if it doesn't exist
      if (!groupedTickets[groupKey]) groupedTickets[groupKey] = [];
      groupedTickets[groupKey].push(ticket);
    });

    // Sort tickets within each group based on sortBy criteria
    if (sortBy === "priority") {
      for (const group in groupedTickets) {
        groupedTickets[group].sort((a, b) => b.priority - a.priority);
      }
    } else if (sortBy === "title") {
      for (const group in groupedTickets) {
        groupedTickets[group].sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return groupedTickets;
  };

  const groupedTickets = getGroupedTickets();

  const DropDown = () => (
    <div class="dropdown">
      <button class="dropbtn">
        <DisplaySVG /> Display <DownArrowSvg />
      </button>
      <div class="dropdown-content">
        <div className="dropdown-container">
          <div className="dropdown-1">
            <div className="sort-order-text">Grouping</div>
            <label>
              <select
                value={grouping}
                className="select-dropdown"
                onChange={(e) => setGrouping(e.target.value)}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </label>
          </div>
          <div className="dropdown-1">
            <div className="sort-order-text">Ordering</div>
            <label>
              <select
                value={sortBy}
                className="select-dropdown"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <p>Error loading data.</p>;
  return (
    <div className="body">
      {DropDown()}
      <div className="kanban-container">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <div className="header">
              <div className="header-group">
                {grouping != "user" ? (
                  <SvgDisplay type={group} />
                ) : (
                  <img
                    className="image"
                    src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
                  />
                )}
                {group}{" "}
                <span className="number-text">
                  {" "}
                  {groupedTickets[group].length}{" "}
                </span>
              </div>
              <AddSVG className="icon add-icon" />
              <ThreeDotSVG className="icon menu-icon" />
            </div>
            <div className="tickets">
              {groupedTickets[group].map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  grouping={grouping}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
