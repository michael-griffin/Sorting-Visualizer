import React from "react"
import {useState} from "react"
import svgIcons from "./icons/svg_icons"
import sortmethods from "./sortmethods.js"

function App() {
  let {bubbleSort, selectionSort, insertionSort, mergeSort, heapSort, quickSort} = sortmethods;
  
  //Still to do:
    //Merge, (QuickSort might be working?).
  //Refresh button needs to hook up with startarr. right now startarr might be run too much
    //on every state-change of nbars it runs
    //maybe useMemo with some value that tracks refresh (count? toggle?)

  //Need a finish/clean up step for animations.
  //Excessive remaking of animations array during animate?
    //Currently, animations array are regenerated as animations play. We really only want a new animation list
    //when a new array is generated. Not sure whether useEffect/useMemo makes sense here, but if so could set
    //dependency array equal to the randomly generated array. For now, as long as the animation only runs once
    //it's fine.

  //Styling wise, couple of options:

  //For animations:
    //gradient color for bars? (maybe a little too fancy)
    //value below bars (only appear if barnum < constant)
  //For side menu
    //could bring selected to the top
    //OR could bold, increase text-size. (slightly prefer this)
    //For above, might make sense to have a separate state for sort choice options (re-make list of buttons?)
    //For footer, need to fix spacing (should have an overall container with space-between to spread out the stuff?)
  //For bottom controls
    //Could add a top header (controls, like in demo)
    
  const baseColor = '#01cdfe';
  const compareColor = "#00b159";
  const swapColor = '#c51f5d';//"#d11141";
  //Could have a 'resting/completed' color, like purple, after sorting is done/before it starts.

  //Work out sorting visualizer for bubbleSort
  const heightmult = 10;      //multiplied by bar value to get height in pixels
  const barValMin = 5;
  const barValMax = 50;

  const barWidthBase = 1100;   //width = (base - gap*nbars) / nbars
  const pixelGap = 4;
  const numBarsMin = 4;
  const numBarsMax = 100;
  

  const sortSpeedMin = 2;  
  const sortSpeedMax = 100; //Should depend on slider for speed!
  const sortSpeedBase = 102;  //speed in ms will be base - speed.

  //sortspeed formula is: Just subtraction for now, but should have a better idea.

  //what do I want the range to look like?
  //Lower 3rd: 200-50ms. Middle: 50-10ms, Top: 10-1ms
  //could make a formula that switches based on value. Little messy.

  //for Side-menu handling: (tied sortChoice to CSS class to highlight chosen-sort), also holds sortFunc
  let [sortChoice, setSortChoice] = useState({
    bubbleChoice: true, selectionChoice: false,
    insertionSort: false, mergeSort: false,
    heapSort: false, quickSort: false,
    sortFunc: bubbleSort
  });

  function handleSortChoice(evt) {
    let keyMod = evt.target.id; //bubbleChoice, selectionChoice, 

    let newFunc;
    if (keyMod === "bubbleChoice")  newFunc = bubbleSort;
    else if (keyMod === "selectionChoice")  newFunc = selectionSort;
    else if (keyMod === "insertionChoice")  newFunc = insertionSort;
    else if (keyMod === "mergeChoice")  newFunc = mergeSort; //still needed
    else if (keyMod === "heapChoice")  newFunc = heapSort; //still needed 
    else if (keyMod === "quickChoice")  newFunc = quickSort;
    console.log(keyMod);
    setSortChoice(prevChoice => {
      let newChoice = {...prevChoice};
      for (let key in newChoice) if (key !== 'sortFunc') newChoice[key] = false;
      newChoice = {...newChoice,
        [keyMod]: true,
        sortFunc: newFunc
      };
      return newChoice;
    });
    console.log('sortChoice var is ', sortChoice)
  }

  let [sortSpeed, setSortSpeed] = useState(sortSpeedMax/2);
  function handleSpeedChange(evt) {
    //console.log(evt.target.value);
    setSortSpeed(evt.target.value);
  }

  let [numBars, setNumBars] = useState(numBarsMin*3);
  let barWidth = (barWidthBase - numBars*pixelGap) / numBars; //numbars*4 accounts for gaps between pixels. 


  function getNewArray(numEls){
    let newArr = [];
    let barRange = barValMax-barValMin;
    for (let n = 0; n < numEls; n++){
      let val = barValMin + Math.floor(Math.random() * barRange);
      newArr.push(val);
    }
    return newArr;
  }

  //let startarr = [40, 25, 10, 5, 30, 20, 35, 37];
  //let startcolors = Array(startarr.length).fill(baseColor);
  //const [barsMain, setBarsMain] = useState({vals: startarr, colors: startcolors});

  const [barsMain, setBarsMain] = useState({
    vals: getNewArray(numBars), 
    colors: Array(numBars).fill(baseColor)
  });
  
  function handleNumBarsChange(evt) {
    let newN = +evt.target.value; //evt.target.value starts as a string.

    setNumBars(newN);
    setBarsMain(prevBars => {
      let newbars = {
        vals: getNewArray(newN), 
        colors: Array(newN).fill(baseColor) 
      };
      return newbars;
    });
  }

  function handleRefresh(){
    setBarsMain(prevBars => {
      let newbars = {
        vals: getNewArray(numBars), 
        colors: Array(numBars).fill(baseColor) 
      };
      return newbars;
    });
  }


  //console.log('arr vals is', barsMain.vals);
  //let animArr = selectionSort(barsMain.vals);
  //console.log('selectSort animation list is', animArr);


  function animateSort(sortFunc) {    
    let holding = barsMain.vals;
    let anims = sortFunc(holding);

    //loop through animArr, 
    //Set up setTimeout() functions with a custom callback
      //Callback defines new bar values and colors, and then calls setBars to modify state.
      //Delay is determined by our sortSpeed variable
    console.log('animateSort started, sortFunc is:', sortFunc);
    console.log('began animateSort, anims are:', anims);
    let delay;
    for (let i = 1; i < anims.length; i++){
      //Set up setTimeout callback and delay
      let cAnim = anims[i];
      let prevAnim = anims[i-1];
      if (cAnim.type === "nochange") continue; //Maybe unneeded, since we start at 1.


      //if (i == 2) console.log('made it past continue');
      //Make the callback function for setTimeout
      let updateBars = () => {
        //Updates state of bars! Updates bar values + colors, and resets colors of previous animation. 
        let {first, second, type} = cAnim;
        let {first: prevFirst, second: prevSecond, type: prevType} = prevAnim;
        let {vals: newVals, colors: newColors} = {...barsMain}; //old bars/colors

        if (type === "swap") {
          let temp = newVals[first];
          newVals[first] = newVals[second];
          newVals[second] = temp;
        }

        let newColor = type === "compare" ? compareColor : swapColor; //swapColor if type=swap or preswap
        newColors[prevFirst] = baseColor;
        newColors[prevSecond] = baseColor;
        newColors[first] = newColor;
        newColors[second] = newColor;

        setBarsMain(prevBars => {
          console.log('setBars ran');
          let newBars = {vals: newVals, colors: newColors};
          return newBars; 
        });
      };

      //make the setTimeout
      delay = 100 + (sortSpeedBase - sortSpeed)*i;
      setTimeout(updateBars, delay);
    }

    //Note: if implementing a pause, can check:
    //https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
    //This allows you to iteratively clear all timeout functions you set.
  }

  let writebarJSX = () => {
    let {vals, colors} = barsMain;
    let bars = [];
    for (let i = 0; i < vals.length; i++){
      let styleJS = {
        height: `${vals[i]*heightmult}px`, 
        width: `${barWidth}px`,
        backgroundColor: colors[i]
      };
      let bar = <div className="arrBar" key={'bar-' + i} style={styleJS}></div>;
      bars.push(bar);
    }
    return bars;
  };

  //Build bars in JSX, to be placed in array-container.
  let barsJSX = writebarJSX();


  return (
    <div className="App">
      <aside className="sideMenu">
        <p className="side-header"> Sorting Visualizer</p>
        <div className="side-choices">
          <button id="bubbleChoice"     onClick={handleSortChoice}
          className={sortChoice.bubbleChoice ? "chosen-sort" : null}>Bubble Sort</button>
          <button id="selectionChoice"  onClick={handleSortChoice}
          className={sortChoice.selectionChoice ? "chosen-sort" : null}>Selection Sort</button>
          <button id="insertionChoice"  onClick={handleSortChoice}
          className={sortChoice.insertionChoice ? "chosen-sort" : null}>Insertion Sort</button>
          <button id="mergeChoice"      onClick={handleSortChoice}
          className={sortChoice.mergeChoice ? "chosen-sort" : null}>Merge Sort</button>
          <button id="heapChoice"       onClick={handleSortChoice}
          className={sortChoice.heapChoice ? "chosen-sort" : null}>Heap Sort</button>
          <button id="quickChoice"      onClick={handleSortChoice}
          className={sortChoice.quickChoice ? "chosen-sort" : null}>Quick Sort</button>
          <button onClick={() => {animateSort(sortChoice.sortFunc)} }>Test Animations</button>
        </div>
        <footer className="side-bottom">
          <a href="https://github.com/michael-griffin/Sorting-Visualizer">
            <div className="side-bottom github-logo">    
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.github} fill="#fff"/>
                </svg>
            </div>
          </a>
          <div className="side-bottom github-text">
            <p>Project's</p>
            <p>Github</p>
          </div>
          <button className="side-bottom min-button">
            <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.minimize} fill="#fff"/>
            </svg>
          </button>
        </footer>
        
      </aside>

      <main>
        <section className="array-container">
          {barsJSX /*does 90% of the work*/}        
        </section>

        <footer>
          <div className="controls">
            <div className="controls-buttons">
              <button id="play-btn" onClick={ () => {animateSort(sortChoice.sortFunc)} } >
                <svg id="play-icon" className="svg-controls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.play}/>
                </svg>
              </button>
              <button id="pause-btn">
                <svg id="pause-icon" className="svg-controls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.pause}/>
                </svg>
              </button>
            </div>
            <div className="controls-speed">
              <svg id="speed-icon" className="svg-controls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.speed}/>
              </svg>
              <div className="speed-slider">
                <label htmlFor="speed">Sorting Speed</label>
                <input type="range" name="speed" onChange={handleSpeedChange} value={sortSpeed}
                  min={sortSpeedMin} max={sortSpeedMax} ></input>
              </div>
            </div>
            <div className="controls-nbars">
              <svg id="bar-icon" className="svg-controls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.bars}/>
              </svg>
              <div className="nbars-slider">
                <label htmlFor="nbars"># of Bars</label>
                <input type="range" name="nbars" onChange={handleNumBarsChange} value={numBars}
                  min={numBarsMin} max={numBarsMax} ></input>
              </div>
            </div>
            <button id="refresh-btn" onClick={handleRefresh}>
              <svg id="refresh-icon" className="svg-controls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.refresh} fill="#000"/>
              </svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;