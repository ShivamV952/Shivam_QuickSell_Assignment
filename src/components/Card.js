// TicketCard.js
import React from 'react';
import { ThreeDotSVG } from './SVGS';

const TicketCard = ({ ticket, grouping }) => {
  return (
    <div className="ticket-card">
      <div>
        <div className="ticket-id">{ticket.id}</div>
        <div className="ticket-title">{ticket.title}</div>
        <div className="tags">
          <ThreeDotSVG/>
          {ticket.tag.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {grouping !== "user" && (
        <div>
          <img
            className="image"
            src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
            alt="Profile"
          />
        </div>
      )}
    </div>
  );
};

export default TicketCard;
