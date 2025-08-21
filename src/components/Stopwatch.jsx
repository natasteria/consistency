import { useEffect, useState, useRef } from 'react'
import '../styles/stopwatch.css';

function convertMilliSecToDifferentTimeUnits(timeInMilliSec){
    let hours = Math.floor(timeInMilliSec/ (1000 * 60 * 60));
    let minutes = Math.floor(timeInMilliSec / (1000 * 60) % 60);
    let seconds = Math.floor(timeInMilliSec / (1000) % 60);

    return {hours, minutes, seconds}
}

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElpasedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);
  const startDetailsRef = useRef(null);
  const endDetailsRef = useRef(null);


  useEffect(() => {
    if(isRunning){
        intervalIdRef.current = setInterval(() => {
            setElpasedTime(Date.now() - startTimeRef.current);
        }, 10);
    }
    return () => {
      clearInterval(intervalIdRef.current)
    };
  }, [isRunning]);

  function start(){
    setIsRunning(true);
    if(elapsedTime === 0){
      const now = new Date();
      startDetailsRef.current = now;
    } 
    startTimeRef.current = Date.now() - elapsedTime; 
  }

  function stop(){
    setIsRunning(false);
    const now = new Date();
    endDetailsRef.current = now;
    duration();
  }

  function pause(){
    setIsRunning(false);
  }

  function reset(){
    setElpasedTime(0);
    setIsRunning(false);
    startDetailsRef.current = null;
  }

function duration() {
  const duration = endDetailsRef.current - startDetailsRef.current;

  const {hours, minutes, seconds} = convertMilliSecToDifferentTimeUnits(duration);

  console.log(
    `Session started at: ${startDetailsRef.current.toLocaleString()}\n` +
    `Session ended at: ${endDetailsRef.current.toLocaleString()}\n` +
    `Duration: ${hours}h ${minutes}m ${seconds}s`
  );
}

  function formatTime(){

    const {hours, minutes, seconds} = convertMilliSecToDifferentTimeUnits(elapsedTime);

    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }

  return (
    <div className="stopwatch">
        <div className="display">{formatTime()}</div>

        <div className="controls">
          <button onClick={start} className='start-button'>Start</button>
          <button onClick={pause} className='pause-button'>Pause</button>
          <button onClick={stop} className='stop-button' disabled={!isRunning}>stop</button>
          <button onClick={reset} className='reset-button'>reset</button>
        </div>
    </div>
  )
}

export default Stopwatch


