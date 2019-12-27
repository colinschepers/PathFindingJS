# PathFindingJS

Ever wondered how path finding techniques actually work? This is a demo application showing the steps of the A* algorithm [1]. **Click the image to go to the application.**

## Graphical User Interface

<a href="https://colinschepers.github.io/PathFindingJS"><img align="right" src="./Images/animation.gif" alt="" title="Path finding in action" /></a>

Clicking on the squares in the grid allows the user add or remove 'walls'. White squares mean a square is not accessible, while black denotes the default accessible state of a square. 

After altering squares in the grid, you can click on the *start* button to start the algorithm and the *pause* button will pause the algorithm so you can have a look at the current state of the algorithm. The *clear* button will clear the output of the algorithm in the grid but will leave the squares unaltered. The *reset* button on the other hand will reset the whole grid, so it will also clear the walls. 

Enabling the *Show trace lines* will draw lines on the grid, showing the route the algorithm would take from square to square. These lines will be used in the backtracking step in the algorithm when the goal is reached. Simply folowing the trail back from goal to start yields the shortest path. The *Allow diagonal* button determines whether diagonal movement is allowed. It is quite interesting to see the difference in how the algorithm behaves when changing the allowed movement pattern!   

Finally, the *Grid size* input field allows the user to change the granularity of the grid, while the *Delay* input field is used to add a short delay (in milliseconds) between every step of the algorithm. This allows the user to follow the algorithm more carefully.

The output of the algorithm is shown by nice colors on the grid. The red squares in the application are the squares that have a calculated cost from the starting cell. The more red the square, the closer it thinks it is to the goal location. The yellow squares are part of the *open set*, which is an ordered list with squares that will be investigated next. The more yellow a square is, the more promising the algorithm thinks it is in reaching the goal. in case the the goal square is visited, according to the characteristics of the A* algorithm, the shortest path is found. The backtracking phase of the algorithm will change the color of the squares of the path pink.

## Implementation

This fully front-end based application is written in JavaScript (besides some basic *html* and *css*) and the visualization is done using the *p5.js* library [2]. The JavaScript async *setTimeout* function is used for every method call in the A* algorithm to allow for an delay, as described in the previous section. 

For faster storage and lookup, a 1 dimensional coordinate system is used, i.e. the first cell is `0` and the last cell is `(width * height - 1)`. To calculate the `x` and `y` coordinate of a 2D system, you can simply use `x = location % width` and `y = Math.floor(location / width)`. To convert a 2D coordinate to a 1D coordinate you can simply use the following formula: `location = y * width + x`. 

The heuristic distance metric used by the algorithm is the Manhattan distance [3], while the distance metric used in calculating the cost is the Euclidean distance [4].

## Sources

1. https://en.wikipedia.org/wiki/A*_search_algorithm
2. https://p5js.org/
3. https://en.wikipedia.org/wiki/Taxicab_geometry
4. https://en.wikipedia.org/wiki/Euclidean_distance
