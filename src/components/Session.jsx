import './../styles/session.css';

function formatDateTime(dateString){
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString('en-US', {weekday: 'short'}),
    date: date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
    time: date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
  };
}

function Session({sessionDetails}) {
  return (
    <div className='session-container'>
      <div className="session-header">
        <div className="header-cell">Start Time</div>
        <div className="header-cell">End Time</div>
        <div className="header-cell">Duration</div>
        <div className="header-cell">Actions</div>
      </div>
      
      {sessionDetails.length === 0 ?  <div className='empty-list'>No Sessions Yet</div> : sessionDetails.map((session, index) => {
        const startFormatted = formatDateTime(session.startedAt);
        const endFormatted = formatDateTime(session.endedAt);
        
        return (
          <div className="session-row" key={index}>
            <div className='session-cell start-time'>
                <div className='time-main'>{startFormatted.time}</div>
                <div className='date-sub'>{startFormatted.day}, {startFormatted.date}</div>
            </div>
            <div className='session-cell end-time'>
                <div className='time-main'>{endFormatted.time}</div>
                <div className='date-sub'>{endFormatted.day}, {endFormatted.date}</div>
            </div>
            <div className="session-cell duration">
              <div className='duration-main'>
                {session.duration?.hours || 0}h {session.duration?.minutes || 0}m {session.duration?.seconds || 0}s
              </div>
            </div>
            <div className='session-cell actions'>
              <button className="action-btn title-btn">Add Title</button>
              <button className="action-btn note-btn">Add Note</button>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Session