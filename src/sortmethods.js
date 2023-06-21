
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
    let arr = arrbase.slice(); //needed? precaution: we are passing in a state-variable, so don't want to modify directly.

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
    let arr = arrbase.slice();
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
    let arr = arrbase.slice();
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
                anims.push({first: currInd, second: o, type:'preswap'});
                anims.push({first: currInd, second: o, type:'swap'});
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
//base Insertion Sort function
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
//basic idea: break unsorted into halves, continue until length = 0 or 1.
//once you have a set of sorted arrays, merge into a larger sorted array (with mergeArrays)

//Issue with the simple version of mergeSort is that it doesn't preserve the indices.
//Animated version is tweaked to preserve indices in addition to creating animations array.
function mergeSort(arrbase){
    let arr = arrbase.slice();
    let anims = [];
    function swap(array, ind1, ind2){
        if (ind1 != ind2) {
            anims.push({first: ind1, second: ind2, type:'preswap'});
            anims.push({first: ind1, second: ind2, type:'swap'});
            let temp = array[ind1];
            array[ind1] = array[ind2];
            array[ind2] = temp;
        }
        return array;
    }
    
    //New idea: go back to k, i, j. Just use index of to find the real things.
    function merge(arr, istart, mid, iend){
        let subOne = arr.slice(istart, mid);
        let subTwo = arr.slice(mid, iend);
        let i = 0; //pointer for 'subOne' subarr to sort.
        let j = 0; //pointer for 'subTwo' subarr to sort.
        let k = istart;
        while (i < subOne.length && j < subTwo.length){
            if (subOne[i] <= subTwo[j]) {
                let iswap = arr.indexOf(subOne[i], k);
                arr = swap(arr, k, iswap);
                k++;
                i++;
            } else {
                let iswap = arr.indexOf(subTwo[j], k);
                arr = swap(arr, k, iswap);
                k++;
                j++;
            }
        }
    
        while (i < subOne.length) {
            let iswap = arr.indexOf(subOne[i], k);
            arr = swap(arr, k, iswap);
            k++;
            i++;
        }
        while (j < subTwo.length) {
            let iswap = arr.indexOf(subTwo[j], k);
            arr = swap(arr, k, iswap);
            k++;
            j++;
        }
        return arr;
    }
      
    function mrgSort(arr, istart=0, iend=arr.length){
        if (iend - istart <= 1) return arr;
        let mid = Math.floor((istart+iend)/2);
        
        mrgSort(arr, istart, mid);
        mrgSort(arr, mid, iend);
        merge(arr, istart, mid, iend);
        return arr;
    }
    let sorted = mrgSort(arr);
    console.log(sorted);
    console.log(anims);
    return anims;
}

/*
//Base merge sort function (no animations)
function mergeSort(arr){
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

    function mrgSort(arr){
        if (arr.length <= 1) return arr;
        let mid = Math.floor(arr.length/2);
        let firsthalf = mrgSort(arr.slice(0,mid));
        let secondhalf = mrgSort(arr.slice(mid));
        return merge(firsthalf, secondhalf);
    }
}
*/

//Heap Sort
function heapSort(arrbase){
    let arr = arrbase.slice();
    let n = arr.length;
    let anims = [];
    
    const swap = (ind1, ind2) => {
        anims.push({first: ind1, second: ind2, type:'preswap'});
        anims.push({first: ind1, second: ind2, type:'swap'});
        let temp = arr[ind1];
        arr[ind1] = arr[ind2];
        arr[ind2] = temp;
    }
    
    const shiftDown = (n, i) => {
        let largest = i;
        let left = 2 * i + 1; //left child index
        let right = 2 * i + 2; //right child index
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left; 
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right; 
        }
        
        // If largest is not parent
        if (largest != i) {
            swap(i, largest);           
            // Recursively heapify the affected sub-tree 
            shiftDown(n, largest); 
        } 
    }

    //Build max heap (index starts at the lowest node that is still a parent)
    for (let i = Math.floor(n / 2 - 1); i >= 0; i--) {
        shiftDown(n, i); 
    }
    //sort arr from the newly made heap.
    for (let i = n - 1; i >= 0; i--) { 
        swap(i, 0);  // Move current root to end
        shiftDown(i, 0); //call shiftDown on the new root in the reduced heap 
    } 

    //console.log('sorted arr is:', arr);
    //console.log('swap animations are:', anims)
    return anims;
}


//Quick Sort
function quickSort(arrbase){
    let arr = arrbase.slice();
    let anims = [];
    
    function pivot(arr, istart, iend){
        function swap(arr, first, second){
            let temp = arr[first];
            arr[first] = arr[second];
            arr[second] = temp;
        }
        
        let ind = istart; //pivot index;
        for (let i = istart+1; i <= iend; i++){
            if (arr[istart] > arr[i]){
                //This is the weird part. Increments FIRST, so holds off on placing pivot til end.
                //if arr[i] greater than pivot nothing happens. Else it gets moved backwards:
                    //still goes in front of previous smaller items. 
                    //This also moves any unswapped big ones forward
                ind++;
                anims.push({first: ind, second: i, type: 'preswap'});
                anims.push({first: ind, second: i, type: 'swap'});
                swap(arr, i, ind); 
            } else {
                anims.push({first: istart, second: i, type: 'compare'});
            }
        }
        anims.push({first: istart, second: ind, type: 'preswap'});
        anims.push({first: istart, second: ind, type: 'swap'});
        swap(arr, istart, ind);
        return ind;
    }
    

    function qckSort(arr, istart=0, iend=arr.length-1){
        if (iend <= istart) return arr;
        let mid = pivot(arr, istart, iend);
        qckSort(arr, istart, mid-1);
        qckSort(arr, mid+1, iend);
        return arr;
    }
    let sorted = qckSort(arr);
    return anims;
}


//Radix Sort

sortmethods = {...sortmethods, 
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort, //not working
    heapSort,
    quickSort

};

export default sortmethods;