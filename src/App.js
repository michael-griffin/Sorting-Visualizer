import React from "react"
import {useState} from "react"
import svgIcons from "./icons/svg_icons"

function App() {
  let heightval = 100;
  console.log(svgIcons);
  //Still to do:
    //Merge, Heap, Selection, QuickSort.


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
    


  //Work out sorting visualizer for bubbleSort
  const heightmult = 10;
  const barWidth = 20;   //Should depend on arr size!
  const sortSpeed = 200; //Should depend on slider for speed!
  const baseColor = 'aqua';
  const compareColor = "green";
  const swapColor = "red";
  //Could have a 'resting/completed' color, like purple, after sorting is done/before it starts.

  //let startarr = [10,15,40,25]; //call something here to randomize vals based on nVals
  let startarr = [40, 25, 10, 5, 30, 20, 35, 37];

  let startcolors = Array(startarr.length).fill(baseColor);

  const [barsMain, setBarsMain] = useState({vals: startarr, colors: startcolors});

  //try a sorting algorithm
  //Must modify to add to animations rather than simply swap.
  function swap(arr, ind1, ind2){
    let temp = arr[ind1];
    arr[ind1] = arr[ind2];
    arr[ind2] = temp;

    return arr;
  }

  function bubbleSort(arrbase){
    let anims = []; //arr of objects, keys first (ind), second (ind), and type
    let arr = arrbase.slice(0); //needed? precaution: we are passing in a state-variable, so don't want to modify directly.

    for (let n = arr.length; n > 0; n--){
        let noSwaps = true;
        for (let o = 0; o < n - 1; o++){
            //if right neighbor < left, swap (then when o increments, a large number can get swapped up again)
            if (arr[o] > arr[o+1]) { //if swap, add TWO animations: pre-swap + swap
                anims.push({first: o, second: o+1, type:'preswap'})
                anims.push({first: o, second: o+1, type:'swap'})
                arr = swap(arr, o, o+1); 
                noSwaps = false;
            } else { //if no swap, add compare anim
              anims.push({first: o, second: o+1, type:'compare'}) 
            }
        }
        if (noSwaps) break;
    }
    return anims;
  }


  function selectionSort(arrbase){
    let arr = arrbase.slice(0);
    let anims = [];
    let cmin;

    for (let n = 0; n < arr.length; n++){
        cmin = n;
        for (let o = n+1; o < arr.length; o++){
            anims.push({first: n, second: o, type:'compare'}) 
            if (arr[o] < arr[cmin]) cmin = o;
        }
        if (cmin !== n){
            anims.push({first: n, second: cmin, type:'preswap'})
            anims.push({first: n, second: cmin, type:'swap'})
            swap(arr, n, cmin);
        } 
    }
    return anims;
  }

  
  console.log('arr vals is', barsMain.vals);
  let animArr = selectionSort(barsMain.vals);
  console.log('selectSort animation list is', animArr);

  let animArr1 = bubbleSort(barsMain.vals);
  console.log('bubbleSort animation list is', animArr1);



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

  function animateSort(anims) {    
    //tutorial seems to operate directly on the dom (basically, select bars based on class)
    //Trying a more React way: state is the bar values + colors, so animations + swaps change state + re-render

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
      //Currently, this changes colors, but doesn't change them back?
      //might have to grab prevAnim so we can switch stuff back.
      //Also need to add a check for anim Type (only switch colors if type=compare)
      if (cAnim.type === "nochange") continue; //Maybe unneeded, since we start at 1.


      //if (i == 2) console.log('made it past continue');
      //Make the callback function for setTimeout
      let updateBars = () => {
        //Updates state of bars! Does three things:
        //Resets colors of previous indices to baseline.
        //Updates colors for current indices (regardless of type)
        //Updates bar values for current indices (if type is 'swap')
        console.log('updateBars ran')
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
      delay = 100 + sortSpeed*i;
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
          <button>Bubble Sort</button>
          <button>Selection Sort</button>
          <button>Insertion Sort</button>
          <button>Merge Sort</button>
          <button>Heap Sort</button>
          <button>Quick Sort</button>
          <button onClick={() => {animateSort(animArr)} }>Test Animations</button>
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
          {barsJSX /*what does 90% of the work*/}        
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
            <input type="range" name="speed" min="10" max="100"></input>
          </div>
          <div className="controls-nbars">
            <input type="number" name="size" placeholder="# of bars" min="10" max="100"></input>
          </div>
          <button className="controls-newArray">
            <svg className="refresh-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d={svgIcons.refresh} fill="#000"/>
            </svg>
          </button>
        </footer>
      </main>
    </div>
  );
}
//<label for="size">Array Size</label>
export default App;

/*
//Play button
<svg style="width: 28.5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
  <path d="M19,3H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,
  2-0.897,2-2V5C21,3.897,20.103,3,19,3z M15.551,12.773 l-5.22,2.983C9.738,
  16.095,9,15.666,9,14.983V9.017c0-0.684,0.738-1.112,1.332-0.773l5.22,
  2.983 C16.15,11.569,16.15,12.431,15.551,12.773z" fill="#000"></path>
</svg>

//Pause button
<svg style="width: 28.5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
  <path d="M19,3H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,
  2-0.897,2-2V5C21,3.897,20.103,3,19,3z M15,9v6 c0,0.552-0.448,1-1,
  1s-1-0.448-1-1V9c0-0.552,0.448-1,1-1S15,8.448,15,9z M11,9v6c0,0.552-0.448,
  1-1,1s-1-0.448-1-1V9 c0-0.552,0.448-1,1-1S11,8.448,11,9z" fill="#000"></path>
</svg>

//Speedometer
<svg style="width: 28.5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
  <path d="M12,3C5.935,3,1,7.935,1,14c0,1.935,0.509,3.837,1.472,5.502c0,
  0,0.219,0.498,0.837,0.498C4.382,20,7,20,7,20 c0.552,0,1-0.448,1-1v0c0-0.552,
  0.448-1,1-1h6c0.552,0,1,0.448,1,1v0c0,0.552,0.448,1,1,1c0,0,3.162,0,3.669,
  0 s0.859-0.499,0.859-0.499C22.491,17.836,23,15.935,23,14C23,7.935,18.065,
  3,12,3z M12,5c0.552,0,1,0.448,1,1c0,0.552-0.448,1-1,1 s-1-0.448-1-1C11,5.448,
  11.448,5,12,5z M16.843,6.414c0.466,0.297,0.602,0.915,0.305,1.381c-0.297,0.465-0.915,
  0.602-1.381,0.305 c-0.466-0.297-0.602-0.916-0.305-1.381C15.759,6.253,16.377,6.117,
  16.843,6.414z M7.094,6.455c0.463-0.301,1.082-0.17,1.383,0.293 c0.301,0.463,0.17,
  1.082-0.293,1.383c-0.463,0.301-1.082,0.17-1.383-0.293C6.499,7.375,6.631,6.756,
  7.094,6.455z M4.145,9.608 c0.27-0.482,0.879-0.654,1.361-0.385c0.482,0.27,0.654,
  0.879,0.385,1.361c-0.27,0.482-0.879,0.654-1.361,0.385 C4.047,10.699,3.875,10.09,
  4.145,9.608z M4,15c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1s1,0.448,1,1C5,14.552,
  4.552,15,4,15z M13.323,15.493l-0.001-0.002c-0.46,0.409-1.102,0.618-1.799,
  0.453c-0.708-0.168-1.295-0.742-1.464-1.45 c-0.273-1.142,0.434-2.165,
  1.446-2.424l-0.001-0.003l0.059-0.015c0.011-0.002,4.467-1.503,6.524-2.035 c0.458-0.119,
  0.777,0.444,0.443,0.78L13.323,15.493z M20,15c-0.552,0-1-0.448-1-1c0-0.552,
  0.448-1,1-1s1,0.448,1,1 C21,14.552,20.552,15,20,15z" fill="#000"></path>
</svg>

//Refresh (get new array)
<svg style="width: 28.5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
  <path d="M 11 0 C 10.74 0 10.483969 0.10196875 10.292969 0.29296875 L 7.2929688 
  3.2929688 C 6.9019688 3.6839688 6.9019687 4.3170313 7.2929688 4.7070312 L 10.292969 
  7.7070312 C 10.578969 7.9930312 11.007812 8.0778281 11.382812 7.9238281 C 11.756813 
  7.7688281 12 7.405 12 7 L 12 5 C 15.877484 5 19 8.1225161 19 12 C 19 13.025799 18.774981 
  13.99479 18.376953 14.876953 A 1.0001 1.0001 0 1 0 20.199219 15.699219 C 20.707191
  14.573382 21 13.320201 21 12 C 21 7.0414839 16.958516 3 12 3 L 12 1 C 12 0.596 11.756812
  0.23117187 11.382812 0.076171875 C 11.258813 0.025171875 11.129 0 11 0 z M 4.7265625
  7.6992188 A 1.0001 1.0001 0 0 0 3.8007812 8.3007812 C 3.2928092 9.426618 3 10.679799 
  3 12 C 3 16.958516 7.0414839 21 12 21 L 12 23 C 12 23.404 12.243188 23.768828 12.617188 
  23.923828 C 12.741187 23.974828 12.871 24 13 24 C 13.26 24 13.516031 23.898031 13.707031 
  23.707031 L 16.707031 20.707031 C 17.098031 20.316031 17.098031 19.683969 16.707031 
  19.292969 L 13.707031 16.292969 C 13.421031 16.006969 12.992188 15.922172 12.617188 
  16.076172 C 12.243187 16.231172 12 16.596 12 17 L 12 19 C 8.1225161 19 5 15.877484 5 12 
  C 5 10.974201 5.225019 10.00521 5.6230469 9.1230469 A 1.0001 1.0001 0 0 0 4.7265625 
  7.6992188 z" fill="#000"></path>
</svg>


//Minimize SideMenu
<svg style="width: 28.5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000">
  <path d="M13.893,21L13.893,21c1.329,0,2.122-1.481,1.385-2.587L11.003,12l4.275-6.413C16.015,
  4.481,15.222,3,13.893,3h0 c-0.556,0-1.076,0.278-1.385,0.741l-4.766,7.15c-0.448,0.672-0.448,
  1.547,0,2.219l4.766,7.15C12.817,20.722,13.337,21,13.893,21z" fill="#6d767e"></path>
</svg>


//WORKING github logo
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 
    13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 
    2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 
    4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 
    3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038
    0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052
    13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324
    24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364
    19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/>
  </svg>
*/

