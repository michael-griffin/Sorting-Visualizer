
let sortmethods = {}; //key = sort algo name, val = sort algo function

//let unsorted = [1,10,2,7,4,3];

/*
function swap(arr, ind1, ind2){
    let temp = arr[ind1];
    arr[ind1] = arr[ind2];
    arr[ind2] = temp;

    return arr;
}
*/

//BubbleSort
//Bigger numbers 'bubble up' to the end of the array.
//Important optimization: Normally loop through the remainder of the array for each element looking for swaps.
//If we do this once, AND make no swaps, we're sorted, and can stop
const bubbleSort = (arrbase) => {
    let anims = []; //arr of objects, keys first (ind), second (ind), and type
    let arr = arrbase.slice(0); //needed? precaution: we are passing in a state-variable, so don't want to modify directly.

    const swap = (arr, ind1, ind2) => {
        let temp = arr[ind1];
        arr[ind1] = arr[ind2];
        arr[ind2] = temp;
        return arr;
    };

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

/* 
//Base bubble sort function (no animation updates)
function bubbleSort(arr){
    let noSwaps;
    for (let n = arr.length; n > 0; n--){
        noSwaps = true;
        for (let o = 0; o < n - 1; o++){
            if (arr[o] > arr[o+1]) {
                //if right neighbor < left, swap (then when o increments, a large number can get swapped up again)
                arr = swap(arr, o, o+1); 
                noSwaps = false;
            }
        }
        if (noSwaps) break;
    }
    return arr;
}
*/

//SelectionSort
function selectionSort(arrbase){
    let arr = arrbase.slice(0);
    let anims = [];
    let cmin;

    function swap(arr, ind1, ind2){
        let temp = arr[ind1];
        arr[ind1] = arr[ind2];
        arr[ind2] = temp;
    
        return arr;
    }

    for (let n = 0; n < arr.length; n++){
        cmin = n;
        for (let o = n+1; o < arr.length; o++){
            anims.push({first: n, second: o, type:'compare'}); 
            if (arr[o] < arr[cmin]) cmin = o;
        }
        if (cmin !== n){
            anims.push({first: n, second: cmin, type:'preswap'});
            anims.push({first: n, second: cmin, type:'swap'});
            swap(arr, n, cmin);
        } 
    }
    return anims;
}

/*
//Base selection sort function (no animation updates)
function selectionSort(arr){
    let cmin;
    for (let n = 0; n < arr.length; n++){
        cmin = n;
        for (let o = n+1; o < arr.length; o++){
            if (arr[o] < arr[cmin]) cmin = o;
        }
        if (cmin !== n) swap(arr, n, cmin);
    }
    return arr;
}
 */


//InsertionSort
//Builds up a sorted 'half', then searches that half for the proper spot to insert the next element.

function insertionSort(arrbase){
    let arr = arrbase.slice(0);
    let currInd;
    let anims = [];

    function swap(arr, ind1, ind2){
        let temp = arr[ind1];
        arr[ind1] = arr[ind2];
        arr[ind2] = temp;
    
        return arr;
    }

    for (let n = 1; n < arr.length; n++){
        currInd = n;
        for (let o = n-1; o >= 0; o--){
            if (arr[currInd] <= arr[o]){
                anims.push({first: n, second: o, type:'preswap'});
                anims.push({first: n, second: o, type:'swap'});
                arr = swap(arr,currInd,o);
                currInd = o; //now curr is at o index
            } else {
                anims.push({first: n, second: o, type:'compare'}); 
            }
        }
    }
    return anims;
}

/*
function insertionSort(arr){
    let currInd;
    for (let n = 1; n < arr.length; n++){
        currInd = n;
        for (let o = n-1; o >= 0 && arr[o] > arr[currInd]; o--){
            if (arr[currInd] <= arr[o]){
                arr = swap(arr,currInd,o);
                currInd = o; //now curr is at o index
            }
        }
    }
    return arr;
}
*/

//MergeSort

//First piece: write a function that merges two sorted arrays.

//basic idea: break unsorted into halves, continue until length = 0 or 1.
//once you have a set of sorted arrays, merge into a larger sorted array (with mergeArrays)


/*
//Base merge sort function (no animations)
function merge(arr1, arr2){
    let sorted = [];
    let i = 0; let j = 0;    
    while (i < arr1.length && j < arr2.length){
        if (arr1[i] <= arr2[j]) sorted.push(arr1[i++]);
        else sorted.push(arr2[j++]);
    }
    if (i < arr1.length) sorted.push(...arr1.slice(i));
    if (j < arr2.length) sorted.push(...arr2.slice(j));
    return sorted;
}

function mergeSort(arr){
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length/2);
    let firsthalf = mergeSort(arr.slice(0,mid));
    let secondhalf = mergeSort(arr.slice(mid));
    return merge(firsthalf, secondhalf);
}
//mergeSort([35,12,76,7]);
*/




//Quick Sort

//Heap Sort

//Radix Sort

sortmethods = {...sortmethods, 
    bubbleSort,
    selectionSort,
    insertionSort
};

export default sortmethods;