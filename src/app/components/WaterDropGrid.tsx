"use client"
import {animate, stagger} from "animejs"

const WaterDropGrid = () => {
    return (
        <div className='absolute grid max-w-full h-screen lg:place-content-center place-content-end sm:w-screen max-w-screen bg-slate-900  px-8 ' >
            <DotGrid/>
        </div>
    );
};
const GRID_WIDTH = 25;
const GRID_HEIGHT = 20;

const DotGrid = () => {
    const handleDotClick = (e: any) => {
        animate('.dot-point', {
            scale: [
                {to:1.5,ease:'outSine',duration: 250},
                {to:1,ease:'inOutQuad',duration: 500},
            ],
            translateY: [
                {to:-15,ease:'outSine',duration: 250},
                {to:0,ease:'inOutQuad',duration: 500},
            ],
            opacity: [
                {to:1,ease:'outSine',duration: 250},
                {to:.15,ease:'inOutQuad',duration: 500},
            ],
            delay: stagger(100,{
                grid: [GRID_WIDTH,GRID_HEIGHT],
                from: Number(e.target.dataset.index)
            }),
        })
    };
    const dots = []
    let index = 0;
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            dots.push(<div onClick={handleDotClick} className='group cursor-crosshair rounded-full p-2 transition-colors hover:bg-slate-600' data-index={index} key={`${i}-${j}`}>
                <div className='dot-point h-2 w-2 rounded-full bg-linear-to-b from-slate-700 to-slate-400 opacity-15' data-index={index}>

                </div>
            </div>)
            index++;
        }
    }
    return (
        <div style={{gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`, zIndex: 4}} className=' grid w-fit'>{dots}</div>
    )
}

export default WaterDropGrid;