## Website Performance Optimization portfolio project

##To Build Project Locally

`clone` the repo, and navigate to its root directory

With gulpJs, nodeJs & Npm ( generally included in nodeJs ) installed, in the project directory simply run:

`npm install`

and once dependencies are finished installing

`gulp` or `gulp build`

will output a build in /dist


###Part 1: Optimize PageSpeed Insights score for index.html

####Optimizations:

1. Moved the server assets to the project folder and optimize
1. Minify CSS
1. Minify JS
1. Minify HTML
1. Removed Google Font

###Part 2: Optimize Frames per Second in pizza.html

####Optimizations:

1. Changed the capitalize prototype to a simple CSS rule
1. Optimized changePizzaSizes by removing variable and function declarations from the function
1. Debounced scroll event
1. Move DOM queries outside loops
1. Add caching for loops
1. Switch CSS left animations to translate
1. Calculate amount of space for animating pizzas and return actual value of pizzas that fit instead of fixed number
1. querySelector lookups to querySelectorAll where possible
1. Utilize 3D accelleration by adding translate3d property to moving pizza elements