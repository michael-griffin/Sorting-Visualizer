import React from "react"
import {useState} from "react"
import svgIcons from "./icons/svg_icons"
import sortmethods from "./sortmethods.js"

function App() {
  let {bubbleSort, selectionSort, insertionSort} = sortmethods;
  let sortFunc = bubbleSort; //by default, switches with handleSortChoice
  //console.log(hmm.bubbleFunc([15,40,20,10]));
  let heightval = 100;
  //Still to do:
    //Merge, Heap, QuickSort.
  //Refresh button needs to hook up with startarr right now startarr is being run too much
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
    
  const baseColor = 'aqua';
  const compareColor = "green";
  const swapColor = "red";
  //Could have a 'resting/completed' color, like purple, after sorting is done/before it starts.

  //Work out sorting visualizer for bubbleSort
  const heightmult = 10;      //multiplied by bar value to get height in pixels
  const barValMin = 5;
  const barValMax = 50;

  const barWidthBase = 800;   //width = base / nbars
  const numBarsMin = 4;
  const numBarsMax = 100;
  
  const sortSpeedMin = 2;  
  const sortSpeedMax = 100; //Should depend on slider for speed!
  const sortSpeedBase = 102;  //speed in ms will be base - speed.

  //sortspeed formula is: Just subtraction for now, but should have a better idea.

  //what do I want the range to look like?
  //Lower 3rd: 200-50ms. Middle: 50-10ms, Top: 10-1ms
  //could make a formula that switches based on value. Little messy.

  //for Side-menu handling: (still need to tie this to a CSS class),
  //Could programmatically generate side-menu JSX on the basis of sortChoice I suppose.
  let [sortChoice, setSortChoice] = useState({
    bubbleSort: false, selectionSort: false,
    insertionSort: false, mergeSort: false,
    heapSort: false, quickSort: false,
    sortFunc: bubbleSort
  });

  function handleSortChoice(evt) {
    //console.log(evt.target.id);
    let keyMod = evt.target.id; //bubbleChoice, selectionChoice, 
    //setSortChoice(prevChoice => ({...prevChoice, [keyMod]: true}));

    let newFunc;
    if (keyMod === "bubbleChoice")  newFunc = bubbleSort;
    else if (keyMod === "selectionChoice")  newFunc = selectionSort;
    else if (keyMod === "insertionChoice")  newFunc = insertionSort;
    //else if (keyMod === "bubbleSort")  newFunc = bubbleSort;
    //else if (keyMod === "bubbleSort")  newFunc = bubbleSort;
    //else if (keyMod === "bubbleSort")  newFunc = bubbleSort;
    setSortChoice(prevChoice => {
      let newChoice = {...prevChoice,
        [keyMod]: true,
        sortFunc: newFunc
      };
      return newChoice;
    }); //have to wrap implicit return in parens for object.
  }

  let [sortSpeed, setSortSpeed] = useState(sortSpeedMax/2);
  function handleSpeedChange(evt) {
    //console.log(evt.target.value);
    setSortSpeed(evt.target.value);
  }

  let [numBars, setNumBars] = useState(numBarsMin*3);
  let barWidth = barWidthBase / numBars; 


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


  /*
  let animDemo = [
    {first: 0, second: 0, type:'nochange'},
    {first: 0, second: 1, type:'compare'},
    {first: 0, second: 2, type:'compare'},
    {first: 0, second: 3, type:'compare'},
    {first: 1, second: 2, type:'compare'},
    {first: 1, second: 3, type:'compare'},
    {first: 2, second: 3, type:'preswap'},
    {first: 2, second: 3, type:'swap'}
  ];
  */
  function animateSort(sortFunc) {    
    //previous version of App already had animations prepared. Now generating anims here.
    let holding = barsMain.vals;
    let anims = sortFunc(holding);

    //loop through animArr, 
    //Set up setTimeout() functions with a custom callback
      //Callback defines new bar values and colors, and then calls setBars to modify state.
      //Delay is determined by our sortSpeed variable
    console.log('began animateSort');
    let delay;
    for (let i = 1; i < anims.length; i++){
      //Set up setTimeout callback and delay
      let cAnim = anims[i];
      let prevAnim = anims[i-1];
      if (cAnim.type === "nochange") continue; //Maybe unneeded, since we start at 1.


      //if (i == 2) console.log('made it past continue');
      //Make the callback function for setTimeout
      let updateBars = () => {
        //Updates state of bars! Does three things:
          //Resets colors of previous indices to baseline.
          //Updates colors for current indices (regardless of type)
          //Updates bar values for current indices (if type is 'swap')
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

  let barsJSX = writebarJSX();

  //<div className="arrBar" style={{height: '100px', width: '20px'}}></div>
  //<div className="arrBar" style={{height: '100px', width: '20px'}}></div>
  return (
    <div className="App">
      <aside className="sideMenu">
        <p> Sorting Visualizer</p>
        <div className="side-choices">
          <button id="bubbleChoice"     onClick={handleSortChoice}>Bubble Sort</button>
          <button id="selectionChoice"  onClick={handleSortChoice}>Selection Sort</button>
          <button id="insertionChoice"  onClick={handleSortChoice}>Insertion Sort</button>
          <button id="mergeChoice"      onClick={handleSortChoice}>Merge Sort</button>
          <button id="heapChoice"       onClick={handleSortChoice}>Heap Sort</button>
          <button id="quickChoice"      onClick={handleSortChoice}>Quick Sort</button>
          <button onClick={() => {animateSort(sortChoice.sortFunc)} }>Test Animations</button>
        </div>
        <footer className="side-bottom">
          <div className="side-bottom github-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.github} fill="#fff"/>
            </svg>
          </div>
          <div className="side-bottom github-text">
            <p>Michael Griffin's</p>
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

        <footer className="controls">
          <div className="controls-buttons">
            <button>
              <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.play} fill="#000"/>
              </svg>
             </button>
            <button>
              <svg className="pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.pause} fill="#000"/>
              </svg>
            </button>
          </div>
          <div className="controls-speed">
            <svg className="speed-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.speed} fill="#000"/>
            </svg>
            <label htmlFor="speed">Sorting Speed</label>
            <input type="range" name="speed" onChange={handleSpeedChange} value={sortSpeed}
              min={sortSpeedMin} max={sortSpeedMax} ></input>
          </div>
          <div className="controls-nbars">
            <label htmlFor="nbars"># of Bars</label>
            <input type="range" name="nbars" onChange={handleNumBarsChange} value={numBars}
              min={numBarsMin} max={numBarsMax} ></input>
          </div>
          <button className="controls-newArray" onClick={handleRefresh}>
            <svg className="refresh-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.refresh} fill="#000"/>
            </svg>
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;