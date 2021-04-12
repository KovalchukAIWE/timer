// import React from "react";
// import { useEffect, useState } from "react";
// import { interval, Subject } from "rxjs";
// import { takeUntil } from "rxjs/operators";

// function Timer() {
//   const [sec, setSec] = useState(0);
//   const [status, setStatus] = useState("stop");

// useEffect (() => {
// let stream$ = new Subject();
// let myObservable = interval(1000);
// myObservable.pipe(takeUntil(stream$)).subscribe(
//   () => {
//     if(status ==='start'){
//       setSec(val => val + 1000);
//     }
//   }
// );
// return () => {
//   stream$.next();
//   stream$.complete()
// }
// }, [status])

//   const start = () => {
//     setStatus("start");
//   }
//   const stop = () => {
//     setStatus("stop");
//     setSec(0);
//   }
 
//   const reset = () => {
//     setSec(0);
//   }
 
//   const wait = () => {
//     setStatus("wait");
//   }
 
//   return (
//     <div>
//        <div> {new Date(sec).toISOString().slice(11, 19)} </div> 
//        <button onClick = {start}>Start</button>
//        <button onClick = {stop}>Stop</button>
//        <button onClick = {reset}>Reset</button>
//        <button onClick = {wait}>Wait</button>

//     </div>
//   );
// }

// export default Timer;

import { useState, useRef } from 'react';
import { fromEvent } from 'rxjs';
import {
    map,
    buffer,
    debounceTime,
    filter
} from 'rxjs/operators';

export const App = () => {
    const [time, setTime] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const intervalId = useRef(null);

    const mouse$ = fromEvent(document.getElementById('wait'), 'click');

    const buff$ = mouse$.pipe(
        debounceTime(300)
    );

    const click$ = mouse$.pipe(
        buffer(buff$),
        map(list => list.length),
        filter(x => x === 2)
    );

    const startHandler = () => {
        intervalId.current = setInterval(() => setTime(prevS => prevS + 1), 1000);
        setIsDisabled(true);
    };

    const stopHandler = () => {
        clearInterval(intervalId.current);
        setTime(0);
        intervalId.current = null;
        setIsDisabled(false);
    };

    const resetHandler = () => {
        clearInterval(intervalId.current);
        setTime(0);
        setIsDisabled(true);
        intervalId.current = setInterval(() => setTime(prevS => prevS + 1), 1000);
    };

    const waitHandler = () => {
        click$.subscribe(() => {
            clearInterval(intervalId.current);
            setIsDisabled(false);
            intervalId.current = null;
        });
    };

    return (
        <div>
            <div className="buttons">
                <button onClick={startHandler} disabled={isDisabled}>Start</button>
                <button onClick={stopHandler}>Stop</button>
                <button id="wait" onClick={waitHandler}>Wait</button>
                <button onClick={resetHandler}>Reset</button>
            </div>
            <div className="timer">
                <div className="time">{new Date(time * 1000).toISOString().substr(11, 8)}</div>
            </div>
        </div>
    );
};