const timerDisplay = document.querySelector('#timer');
const startStopBtn = document.querySelector('#start-stop-btn');
const resetBtn = document.querySelector('#reset');


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









