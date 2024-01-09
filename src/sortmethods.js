
let sortmethods = {}; //key = sort algo name, val = sort algo function

//let unsorted = [1,10,2,7,4,3];


function swap(anims, array, ind1, ind2){
    if (ind1 !== ind2) {
        anims.push({first: ind1, second: ind2, type:'preswap'});
        anims.push({first: ind1, second: ind2, type:'swap'});
        let temp = array[ind1];
        array[ind1] = array[ind2];
        array[ind2] = temp;
    }
    return array;
}

//BubbleSort
//Bigger numbers 'bubble up' to the end of the array.
//Stops early: if no swaps, we're sorted.
function bubbleSort(arrbase) {
    let anims = []; //arr of objects, keys first (ind), second (ind), and type
    let arr = arrbase.slice(); //precaution, since passing in a state-variable

    for (let n = arr.length; n > 0; n--){
        let noSwaps = true;
        for (let o = 0; o < n - 1; o++){
            //if right neighbor < left, swap (then when o increments, a
            //large number can get swapped up again)
            if (arr[o] > arr[o+1]) { //if swap, add TWO animations: pre-swap + swap
                arr = swap(anims, arr, o, o+1);
                noSwaps = false;
            } else { //if no swap, add compare anim
                anims.push({first: o, second: o+1, type:'compare'})
            }
        }
        if (noSwaps) break;
    }
    return anims;
}


//SelectionSort
function selectionSort(arrbase){
    let arr = arrbase.slice();
    let anims = [];
    let cmin;

    for (let n = 0; n < arr.length; n++){
        cmin = n;
        for (let o = n+1; o < arr.length; o++){
            anims.push({first: n, second: o, type:'compare'});
            if (arr[o] < arr[cmin]) cmin = o;
        }
        if (cmin !== n){
            swap(anims, arr, n, cmin);
        }
    }
    return anims;
}



//InsertionSort
//Builds up a sorted 'half', then searches that half for the proper spot to
//insert the next element.

function insertionSort(arrbase){
    let arr = arrbase.slice();
    let currInd;
    let anims = [];


    for (let n = 1; n < arr.length; n++){
        currInd = n;
        for (let o = n-1; o >= 0; o--){
            if (arr[currInd] <= arr[o]){
                arr = swap(anims, arr, currInd, o);
                currInd = o; //now curr is at o index
            } else {
                anims.push({first: n, second: o, type:'compare'});
            }
        }
    }
    return anims;
}



//MergeSort
//basic idea: break unsorted into halves, continue until length = 0 or 1.
//once you have a set of sorted arrays, merge into a larger sorted array (with mergeArrays)

//Issue with the simple version of mergeSort is that it doesn't preserve the indices.
//Animated version is tweaked to preserve indices in addition to creating animations array.
function mergeSort(arrbase){
    let arr = arrbase.slice();
    let anims = [];

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
                arr = swap(anims, arr, k, iswap);
                k++;
                i++;
            } else {
                let iswap = arr.indexOf(subTwo[j], k);
                arr = swap(anims, arr, k, iswap);
                k++;
                j++;
            }
        }

        while (i < subOne.length) {
            let iswap = arr.indexOf(subOne[i], k);
            arr = swap(anims, arr, k, iswap);
            k++;
            i++;
        }
        while (j < subTwo.length) {
            let iswap = arr.indexOf(subTwo[j], k);
            arr = swap(anims, arr, k, iswap);
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
    //const sorted = mrgSort(arr);
    mrgSort(arr);
    return anims;
}



//Heap Sort
function heapSort(arrbase){
    let arr = arrbase.slice();
    let n = arr.length;
    let anims = [];


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
        if (largest !== i) {
            arr = swap(anims, arr, i, largest);
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
        arr = swap(anims, arr, i, 0);  // Move current root to end
        shiftDown(i, 0); //call shiftDown on the new root in the reduced heap
    }

    return anims;
}


//Quick Sort
function quickSort(arrbase){
    let arr = arrbase.slice();
    let anims = [];

    function pivot(arr, istart, iend){

        let ind = istart; //pivot index;
        for (let i = istart+1; i <= iend; i++){
            if (arr[istart] > arr[i]){
                //Increments FIRST, so holds off on placing pivot til end.
                //if arr[i] greater than pivot nothing happens.
                //Else it gets moved backwards.
                //This also moves any unswapped big ones forward
                ind++;
                swap(anims, arr, i, ind);
            } else {
                anims.push({first: istart, second: i, type: 'compare'});
            }
        }
        swap(anims, arr, istart, ind);
        return ind;
    }


    function qckSort(arr, istart=0, iend=arr.length-1){
        if (iend <= istart) return arr;
        let mid = pivot(arr, istart, iend);
        qckSort(arr, istart, mid-1);
        qckSort(arr, mid+1, iend);
        return arr;
    }
    //let sorted = qckSort(arr);
    qckSort(arr);
    return anims;
}



sortmethods = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    heapSort,
    quickSort
};

export default sortmethods;