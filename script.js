const timerDisplay = document.querySelector('#timer');
const startStopBtn = document.querySelector('#start-stop-btn');
const resetBtn = document.querySelector('#reset');
const sessionsDisplay = document.querySelector('#sessions');

// don't forget that this refers to the current object instance that is assesing a method like the constructor or custom methods
class Session {
    topic = '';
    shortSummary = '';
    static allSessions = [];


    constructor(sessionStart, sessionEnd){
        this.sessionStart = sessionStart; //stores Date object which contains all date related values.
        this.sessionEnd = sessionEnd;
        this.sessionDuration = sessionEnd - sessionStart; 
        this.topics = [];

        Session.allSessions.push(this);
    }

    addTopic(title, summary){
        this.topics.push({ title: title, summary: summary});
    }


    sessionDetails(){
        return {
            startTime: this.sessionStart,
            endTime :this.sessionEnd,
            duration: this.sessionDuration,
            topics: this.topics
        }
    }

    getFormatedSessionDetails() {
        const seconds = Math.floor(this.sessionDuration / 1000);
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const options = {
            weekday: 'long',    
            year: 'numeric',    
            month: 'long',      
            day: 'numeric',     
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true       
        };

        return {
            sessionStart: this.sessionStart.toLocaleString('en-US', options),
            sessionEnd: this.sessionEnd.toLocaleString('en-US', options),
            sessionDuration: `${hrs.toString().padStart(2, '0')}:` +
                            `${mins.toString().padStart(2, '0')}:` +
                            `${secs.toString().padStart(2, '0')}`
        };
    }

    showTopics(){
        return this.topics;
    }

    static showAllSessions(){
        return Session.allSessions;  
    }

};


let timeStarted = false;
let intervalidId;
let seconds = 0;
let session = {
    start: null, // needed to calculate the duration 
    end: null, // needed to calculate the duration
    formattedStart: '', // the formated one are used so that they are human readable
    formattedEnd: '',
    formattedDuration: ''
};

function displaySessions() {
    sessionsDisplay.innerHTML = '';

    Session.allSessions.forEach((session) => {
        const sessionContainer = document.createElement('div');
        sessionContainer.classList.add('session-container');

        const formatted = session.getFormatedSessionDetails(); 

        const sessionStartDetails = document.createElement('p');
        sessionStartDetails.textContent = `Start: ${formatted.sessionStart}`;
        sessionStartDetails.classList.add('session-details')

        const sessionEndDetails = document.createElement('p');
        sessionEndDetails.textContent = `End: ${formatted.sessionEnd}`;
        sessionEndDetails.classList.add('session-details')

        const sessionDuration = document.createElement('p');
        const totalSeconds = Math.floor(session.sessionDuration / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        sessionDuration.textContent = `Duration: ${hrs.toString().padStart(2, '0')}:` +
                                      `${mins.toString().padStart(2, '0')}:` +
                                      `${secs.toString().padStart(2, '0')}`;
        sessionDuration.classList.add('session-details');

        sessionContainer.appendChild(sessionStartDetails);
        sessionContainer.appendChild(sessionEndDetails);
        sessionContainer.appendChild(sessionDuration);

        sessionsDisplay.appendChild(sessionContainer);
    });
}


startStopBtn.addEventListener('click', () => {
    timeStarted = !timeStarted;
    

    if(timeStarted){
        
        session.start = new Date();

        intervalidId = setInterval(() => {
            seconds++;

            const hrs = Math.floor(seconds/3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            const formatted = 
                `${hrs.toString().padStart(2, '0')}:` +
                `${mins.toString().padStart(2, '0')}:` +
                `${secs.toString().padStart(2, '0')}`;
            
            timerDisplay.textContent = formatted;
        
        }, 1000);
    }else {
        clearInterval(intervalidId);
        timeStarted = false;

        session.end = new Date();

        const studySession = new Session(session.start, session.end);
        console.log(Session.allSessions);
        displaySessions();

        timerDisplay.textContent = '00:00:00';        
        seconds = 0; 

    }
});


resetBtn.addEventListener('click', () => {
    clearInterval(intervalidId);
    timeStarted = false;
    seconds = 0; 
    timerDisplay.textContent = '00:00:00';
});









