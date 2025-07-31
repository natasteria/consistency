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

    getTopics(){
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

    Session.allSessions.forEach((session, index) => {
        const sessionContainer = document.createElement('div');
        sessionContainer.classList.add('session-container');
        sessionContainer.dataset.sessionIndex = index;

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

        const addTopicBtn = document.createElement('button');
        addTopicBtn.textContent = "Add Topic";
        addTopicBtn.addEventListener('click', addTopicBtnHandler); 

        const topicsContainer = document.createElement('div');
        topicsContainer.classList.add('topics-container');
        
        sessionTopics = session.getTopics();
        console.log(sessionTopics);
        if(sessionTopics.length === 0){
            const message = document.createElement('p');
            message.textContent =  "No Notes Yet!";
            message.classList.add('empty-topic-message');
            topicsContainer.appendChild(message);
        }
        else{
            sessionTopics.forEach( (topic) => {
                const topicTitle = document.createElement('p');
                topicTitle.textContent = topic.title;
                topicTitle.classList.add('topic-title');
                const topicSummary = document.createElement('p');
                topicSummary.textContent = topic.summary;
                topicSummary.classList.add('topics-summary')
                
                topicsContainer.appendChild(topicTitle);
                topicsContainer.appendChild(topicSummary);
            })
        }

        sessionContainer.appendChild(sessionStartDetails);
        sessionContainer.appendChild(sessionEndDetails);
        sessionContainer.appendChild(sessionDuration);
        sessionContainer.appendChild(topicsContainer)
        sessionContainer.appendChild(addTopicBtn);
        

        sessionsDisplay.appendChild(sessionContainer);

    });
}

let currentSessionIndex = null;

const overlayWrapper = document.querySelector('.hidden');
const closeOverlayBtn = document.querySelector('#close-overlay-btn');
const overlay = document.querySelector('#topic-overlay');
overlay.addEventListener('click', closeOverlay);
closeOverlayBtn.addEventListener('click', closeOverlay);

function closeOverlay(e){
    const clickedOutsideForm = !e.target.closest('.form-container');

    if(e.target.id === 'close-overlay-btn' || clickedOutsideForm){
        overlayWrapper.classList.add('hidden');
    }
}

const saveTopicBtn = document.querySelector('#save-topic-btn');
const userMessage = document.querySelector('#user-message');

saveTopicBtn.addEventListener('click', () => {
    const topic = document.querySelector('#topic-input').value;
    const summary = document.querySelector('#summary-input').value;

    if (currentSessionIndex !== null && topic !== "" && summary !== "") {
        Session.allSessions[currentSessionIndex].addTopic(topic, summary);
        overlayWrapper.classList.add('hidden');

        console.log(Session.allSessions[currentSessionIndex].sessionDetails());

        document.querySelector('#topic-input').value = '';
        document.querySelector('#summary-input').value = '';    

        displaySessions();
    }else{
        userMessage.textContent = "Please fill in both Topic and Summary.";
        userMessage.classList.remove('hidden');
    }
});


function addTopicBtnHandler(e){
    const selectedSession = e.target.closest('.session-container');
    currentSessionIndex = selectedSession.dataset.sessionIndex;

    overlayWrapper.classList.remove('hidden');
    
    
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









