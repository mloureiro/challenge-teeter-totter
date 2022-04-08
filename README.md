# Insider's Teeter Totter Challenge


## Remarks

Game:
- shortcuts: 
  - `ESC`: resets the game
  - `SPACE`: toggles between play and pause
  - `DOWN`: to move 1 position down (only on your turn)
- the game configuration is hardcoded but easily changed in [`GAME_CONFIGURATION` object defined in `store.js`](./src/store.js)
- I've decided to keep the height ticks the same, regardless of available height, so it always does X (defined in the `GAME_CONFIGURATION.height`) ticks before reaching the board
- it is responsive (although it is not (yet) ready for touch events), and it uses Javascript to calculate the max angle the scale board can bend, since the height of the scale doesn't change, only the width which affects the angle it has till it hits the floor

General: 
- code is VCS through git
- there are TODOs all over the code, a couple of issues that need more work, but also ideas and improvements that I simply didn't have time to do

Javascript wise:
- started with Vanilla JS then I noticed (almost at the bottom of the rules) that Vuex is a requirement, and add to change the app (maybe for next candidates, it would be great to have the required technologies right on top)
- gave a shot at using the latest [Vue 3 composition API](https://vuejs.org/api/composition-api-setup.html) in [`scale.vue`](./src/components/scale.vue) for the 1st time, and my (premature) opinion of it is that it gets messy easily, that component has almost no logic, and it is already hard to navigate with

Regarding CSS:
- I'm using an adapted version of the [ABEM nomenclature](https://css-tricks.com/abem-useful-adaptation-bem/)
- to help with the ABEM format, I've actually used SASS (although only for the purpose of having the nested hierarchy)
- for variables/themes I'm using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) ([spec](https://www.w3.org/TR/css-variables/)) that are [not supported on IE11](https://caniuse.com/css-variables)
