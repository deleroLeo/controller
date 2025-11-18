
import React, { useState, useEffect, useRef } from "react";

const CountdownTimer = () => {
  const Ref = useRef(null);

    // The state for our timer
    const [timer, setTimer] = useState("00:00:00");
    const [currTime, setCurrTime] = useState(0);
    const [gameTime, setGameTime] = useState(0);

    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
            setCurrTime(total);
        }
    };

    const clearTimer = (e) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        //setTimer("00:00:10");

        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = (e) => {
        let deadline = new Date();

        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + e);
        return deadline;
    };

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        clearTimer(getDeadTime(gameTime));
    }, [gameTime]);

    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
    const onClickReset = () => {
        clearTimer(getDeadTime(gameTime));
    };

    const addTime = (e) => {
    
        clearTimer(getDeadTime(e*60+Math.floor((currTime/ 1000) % 60)));

        setGameTime(e*60 + Math.floor(currTime/1000));

    }

 return (
 <div className="countdown-timer-container">

      
        <form className="countdown-form">  
          <label htmlFor="date-picker">Game-Time in Min</label>
          <input
            name="PlayTime"
            type="number"
            onChange={(e) => setGameTime(e.target.value*60)}
            //onClick={(e) => (e.target.type = "number")}
          />
        </form>
        <h2>{timer}</h2>
        <button onClick={onClickReset}>Reset</button>
        <button onClick ={() => addTime(5)}>Add 5mins</button>

    </div>
  );
};
export default CountdownTimer;