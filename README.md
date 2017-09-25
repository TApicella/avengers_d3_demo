This is Tom Apicella's code test for Tembo

Installation:

npm install react react-dom babelify babel-preset-react d3

Compilation:

babel --presets react src --out-dir build //Compiles jsx to js

browserify build/avengers.js -o js/avengers.js