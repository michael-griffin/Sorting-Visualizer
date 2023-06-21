import React from "react"
import {useState} from "react"
import svgIcons from "./icons/svg_icons"
import sortmethods from "./sortmethods.js"

function App() {
  let {bubbleSort, selectionSort, insertionSort, mergeSort, heapSort, quickSort} = sortmethods;
  
  //Still to do:
    //Need play to be unclickable to prevent double animations

  //Styling:
    //For bars, gradient color based on height with no swap changes looked nice.
      //bar height is based on pixels, not % of screen.
    //For 'finishing' sorting, could have a custom animation.
    //For bottom controls needs some clean up on colors, also play+pause don't stay within box.
      //Could add a top label (Controls, like in demo)
    
  const baseColor = '#01cdfe';
  const compareColor = "#00b159";
  const swapColor = '#c51f5d';//"#d11141";
  //Could have a 'resting/completed' color, like purple, after sorting is done/before it starts.

  const heightmult = 10;      //multiplied by bar value to get height in pixels
  const barValMin = 5;
  const barValMax = 50;

  const barWidthBase = 1100;   //width = (base - gap*nbars) / nbars
  const pixelGap = 4;          //should match gap CSS in array-container
  const numBarsMin = 4;
  const numBarsMax = 100;
  

  const sortSpeedMin = 2;  
  const sortSpeedMax = 100; //Should depend on slider for speed!
  const sortSpeedBase = 102;  //speed in ms will be base - speed.

  //sortspeed formula is: subtraction for now, but should have a better idea.

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
    let keyMod = evt.target.id;

    let newFunc;
    if (keyMod === "bubbleChoice")  newFunc = bubbleSort;
    else if (keyMod === "selectionChoice")  newFunc = selectionSort;
    else if (keyMod === "insertionChoice")  newFunc = insertionSort;
    else if (keyMod === "mergeChoice")  newFunc = mergeSort;
    else if (keyMod === "heapChoice")  newFunc = heapSort; 
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
    console.log('sortChoice is ', sortChoice)
  }

  let [sortSpeed, setSortSpeed] = useState(sortSpeedMax/2);
  function handleSpeedChange(evt) {
    setSortSpeed(evt.target.value);
  }

  let [numBars, setNumBars] = useState(numBarsMin*3);
  let barWidth = (barWidthBase - numBars*pixelGap) / numBars; //subtraction accounts for gaps between pixels. 

  function getBarVals(numEls){
    let newArr = [];
    let barRange = barValMax-barValMin;
    for (let n = 0; n < numEls; n++){
      let val = barValMin + Math.floor(Math.random() * barRange);
      newArr.push(val);
    }
    return newArr;
  }

  const [barsMain, setBarsMain] = useState({
    vals: getBarVals(numBars), 
    colors: Array(numBars).fill(baseColor)
  });
  

  function handleNumBarsChange(evt) {
    let newN = +evt.target.value; //evt.target.value starts as a string.

    setNumBars(newN);
    setBarsMain(prevBars => {
      let newbars = {
        vals: getBarVals(newN), 
        colors: Array(newN).fill(baseColor) 
      };
      return newbars;
    });
  }

  let timeouts = React.useRef([]); //A record of setTimeouts, used to clear timeouts by their ID.
  function animateSort(sortFunc) {

    //pauseSort(timeouts.current); //Still has lingering color issues if used.
    let holding = barsMain.vals;
    let anims = sortFunc(holding);

    //add tail to anims to reset color to baseline.
    anims.push({ first: anims[anims.length-1].first, second: anims[anims.length-1].second, type: "baseline" });

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
        let {vals: newVals, colors: newColors} = {...barsMain}; //preswap bars/colors

        //Change vals
        if (type === "swap") {
          let temp = newVals[first];
          newVals[first] = newVals[second];
          newVals[second] = temp;
        }

        //Change color
        let newColor = baseColor;
        if (type == "swap" || type == "preswap") {
          newColor = swapColor;
        } else if (type == "compare") {
          newColor = compareColor;
        }
        //let newColor = type === "compare" ? compareColor : swapColor; //swapColor if type=swap or preswap
        newColors[prevFirst] = baseColor;
        newColors[prevSecond] = baseColor;
        newColors[first] = newColor;
        newColors[second] = newColor;

        setBarsMain(prevBars => {
          let newBars = {vals: newVals, colors: newColors};
          return newBars; 
        });
      };

      //make the setTimeout
      delay = 100 + (sortSpeedBase - sortSpeed)*i;
      //setTimeout(updateBars, delay)
      timeouts['current'].push(setTimeout(updateBars, delay));
    }
  }

  //https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
  function pauseSort(timeoutIDs) {
    //timeoutIDs are timeouts.current from useRef().
    //allows IDs to be maintained between renders. 
    for (let i=0; i<timeoutIDs.length; i++) {
      clearTimeout(timeoutIDs[i]);
    }
    //We also reset timeouts from useRef
    timeouts.current = [];

    //Finally, reset bars to baseline color.  //Nicer if this was at start of animate, but can't just copy over 
    //setState doesn't immediately update state, so animations get based on old state's colors.
      //A hacky solution would be to initialize a 'fake' barsMain with baseline colors, and work off that for animateSort.
    setBarsMain(prevBars => {
      let baselineBars = {...prevBars, colors: Array(numBars).fill(baseColor)};
      return baselineBars; 
    });
  }

  function handleRefresh(timeoutIDs){
    pauseSort(timeoutIDs);
    setBarsMain(prevBars => {
      let newbars = {
        vals: getBarVals(numBars), 
        colors: Array(numBars).fill(baseColor) 
      };
      return newbars;
    });
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

  //<button onClick={() => {animateSort(sortChoice.sortFunc)} }>Test Animations</button>
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
              <button id="pause-btn" onClick={ () => {pauseSort(timeouts.current)} }>
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
            <button id="refresh-btn" onClick={ () => {handleRefresh(timeouts.current)} }>
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