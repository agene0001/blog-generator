"use client"
import anime from "animejs"

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
        anime({
            targets:'.dot-point',
            scale: [
                {value:1.5,easing:'easeOutSine',duration: 250},
                {value:1,easing:'easeInOutQuad',duration: 500},
            ],
            translateY: [
                {value:-15,easing:'easeOutSine',duration: 250},
                {value:0,easing:'easeInOutQuad',duration: 500},
            ],
            opacity: [
                {value:1,easing:'easeOutSine',duration: 250},
                {value:.15,easing:'easeInOutQuad',duration: 500},
            ],
            delay: anime.stagger(100,{
                grid: [GRID_WIDTH,GRID_HEIGHT],
                from: e.target.dataset.index
            }),
        })
    };
    const dots = []
    let index = 0;
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            dots.push(<div onClick={handleDotClick} className='group cursor-crosshair rounded-full p-2 transition-colors hover:bg-slate-600' data-index={index} key={`${i}-${j}`}>
                <div className='dot-point h-2 w-2 rounded-full bg-gradient-to-b from-slate-700 to-slate-400 opacity-15' data-index={index}>

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