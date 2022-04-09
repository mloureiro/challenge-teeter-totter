# Insider's Teeter Totter Challenge


## Remarks

Hi!

This was an interesting challenge, never done anything like it. I was thinking to build it with [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) although it is yet another thing I haven't used, and it would add on top of the effort. Although I had some fun, I think it is a quite large challenge.

Ok, without further ado, let's dive into the actual remarks:

**Game:**
- the game configuration is hardcoded but easily changed in [`GAME_CONFIGURATION` object defined in `store.js`](./src/store.js) (take a look to see what's possible)
- shortcuts: 
  - `ESC`: resets the game
  - `SPACE`: toggles between play and pause
  - `DOWN`: to move 1 position down (only on your turn)
- I've decided to keep the height ticks the same, regardless of available height, so it always does X (defined in the `GAME_CONFIGURATION.height`) ticks before reaching the board
- it is responsive (although it is not (yet) ready for touch events), and it uses Javascript to calculate the max angle the scale board can bend, since the height of the scale doesn't change, only the width which affects the angle it has till it hits the floor

**General:**
- code is VCS through git
- there are TODOs all over the code, a couple of issues that need more work, but also ideas and improvements that I simply didn't have time to do
- I tried to keep the _business logic_ within the Vuex store, and the actual UI positioning of the weights in the UI components.

**Javascript wise:**
- started with Vanilla JS then I noticed (almost at the bottom of the rules) that Vuex is a requirement, and add to change the app (maybe for next candidates, it would be great to have the required technologies right on top)
- gave a shot at using the latest [Vue 3 composition API](https://vuejs.org/api/composition-api-setup.html) in [`scale.vue`](./src/components/scale.vue) for the 1st time, and my (premature) opinion of it is that it gets messy easily, that component has almost no logic, and it is already hard to navigate with

**Regarding CSS:**
- I'm using an adapted version of the [ABEM nomenclature](https://css-tricks.com/abem-useful-adaptation-bem/)
- to help with the ABEM format, I'm using SASS (width a few functions to help calculate the weights in the board)
- for variables/themes I'm using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) ([spec](https://www.w3.org/TR/css-variables/)) that are [not supported on IE11](https://caniuse.com/css-variables)

**Improvements**
- I've left `TODO`s within the code, some for bugs I didn't have time to figure it out, but also some possible improvements
- I wanted to add linters and some tests (cover a functional component, a stateful component and some coverage for the store)
- along the way, I've questioned my initial idea, from functionality to implementation (although too late to rebuild it)
  - having the same amount of height ticks regardless of the inclination of the scale seemed a good idea in the beginning, although if we think about Tetris the ticks are related with the available space 
  - I've calculated the position of each weight based on the available space by calculating the 4 corners of the board (considering the scale inclination), this was all manual, I do think that this could be achieved with ease by setting all weights in the center of the board, then using `transform: rotate()` to fix the alignment


### How to run

The game can be found at [loureiro.me/challenge-teeter-totter](https://www.loureiro.me/challenge-teeter-totter/).

Although to run it locally at [localhost:3000](http://localhost:3000) in dev mode:

```shell
$ npm install
$ npm run dev
```

It is also possible to run production code locally at [localhost:4173](http://localhost:4173/challenge-teeter-totter/) by running:

```shell
$ npm ci
$ npm run preview
```
