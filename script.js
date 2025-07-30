const timerDisplay = document.querySelector('#timer');
const startStopBtn = document.querySelector('#start-stop-btn');
const resetBtn = document.querySelector('#reset');

// don't forget that this refers to the current object instance that is assesing a method like the constructor or custom methods
class Session {
    topic = '';
    shortSummary = '';
    static allSessions = [];


    constructor(sessionDate, sessionStartTime, SessionEndTime, sessionDuration){
        this.sessionDate = sessionDate;
        this.sessionDuration = sessionDuration;
        this.sessionStartTime = sessionStartTime;
        this.SessionEndTime = SessionEndTime;
        this.topics = [];
        Session.allSessions.push(this);
    }

    addTopic(title, summary){
        this.topics.push({ title: title, summary: summary});
    }


    sessionDetails(){
        return {
            date: this.sessionDate,
            duration: this.sessionDuration,
            startTime: this.sessionStartTime,
            endTime :this.SessionEndTime,
            topics: this.topics
        }
    }

    showTopics(){
        return this.topics;
    }

    static showAllSessions(){
        return Session.allSessions;  
    }

};



function getSessionDetails(){ // this function will run both at the start of a secsion and at the end of a session
    const now = new Date();
    let hrs = now.getHours();
    const amPm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    let mins = now.getMinutes().toString().padStart(2, '0');
    const timeDetail= `${hrs.toString().padStart(2, '0')}:${mins}/${amPm}`;

    const day = now.toLocaleDateString('en-US', { weekday: 'long'});
    const date = now.getDate();
    const month = now.toLocaleString('default', {month: 'long'});
    const year = now.getFullYear();
    const DateDetail = `${day}/${date}/${month}/${year}`;

    return `${timeDetail} | ${DateDetail}`;
}

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



startStopBtn.addEventListener('click', () => {
    timeStarted = !timeStarted;
    

    if(timeStarted){
        
        session.start = new Date();
        session.formattedStart = getSessionDetails();
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
        session.formattedEnd = getSessionDetails();

        const durationMs = session.end - session.start;
        const durationSecs = Math.floor(durationMs / 1000);
        const hrs = Math.floor(durationSecs / 3600);
        const mins = Math.floor((durationSecs % 3600) / 60);
        const duration = `${hrs.toString().padStart(2, '0')}:` + `${mins.toString().padStart(2, '0')}`;

        const date = session.formattedStart.split('|')[1].trim(); // e.g., "Wednesday/30/July/2025"
        const startTime = session.formattedStart.split('|')[0].trim();
        const endTime = session.formattedEnd.split('|')[0].trim();

        const studySession = new Session(
            date,
            startTime,
            endTime,
            duration
        )

        console.log(studySession.sessionDetails());

        //console.log(session);
        timerDisplay.textContent = '00:00:00';        
        seconds = 0; 
        
        console.log(Session.showAllSessions());

    }
});


resetBtn.addEventListener('click', () => {
    clearInterval(intervalidId);
    timeStarted = false;
    seconds = 0; 
    timerDisplay.textContent = '00:00:00';
});









