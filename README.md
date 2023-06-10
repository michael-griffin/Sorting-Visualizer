# Sorting Visualizer

**Summary:**

This project was an attempt to practice coding some of the sorting algorithms I'd studied in a data structures and algorithms course. It was also one of the first projects where I got to use Git's version control features from the outset.

The site demoing each algorithm is built in React. It loads in:
    sorting functions from sortmethods.js
    svg images from svg-logos.js

The algorithms themselves are tweaked to build a set of 'sorting instructions' that the site will animate through, rather than sort the array themself. Each comparison + swap is kept track of, and then 'played' with a series of setTimeout functions.

## Future Directions
Compare Algorithms: Display multiple algorithms sorting at once, in a race to finish first.

Additional Algorithms: **Radix sort** in particular would be interesting, but would require a different visualization