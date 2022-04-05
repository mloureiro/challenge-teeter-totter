# Insider's Teeter Totter Challenge


## Remarks

General: 
- code is VCS through git 

Javascript wise:
- started with Vanilla JS then I noticed (almost at the bottom of the rules) that Vuex is a requirement, and add to change the app (maybe for next candidates, it would be great to have the required technologies right on top)
- gave a shot at using the latest [Vue 3 composition API](https://vuejs.org/api/composition-api-setup.html) in [`scale.vue`](./src/components/scale.vue) for the 1st time, and my (premature) opinion of it is that it gets messy easily, that component has almost no logic, and it is already hard to navigate with

Regarding CSS:
- I'm using an adapted version of the [ABEM nomenclature](https://css-tricks.com/abem-useful-adaptation-bem/)
- to help with the ABEM format, I've actually used SASS (although only for the purpose of having the nested hierarchy)
- for variables/themes I'm using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) ([spec](https://www.w3.org/TR/css-variables/)) that are [not supported on IE11](https://caniuse.com/css-variables)

