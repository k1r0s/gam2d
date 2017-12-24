## gam2d

Launch:

`npm i`
`npm run build`
`http-server` (use what ever static server you love)

> warning: keyboard is disabled by the game to track arrows and space key. That could mean you can't reload page with CTRL + R or open DevTools with F12 (neither CTRL + SHIFT + I). Use `inspect element` instead.

---
What this project is all about:

I wanted to learn canvas rendering (html5 Canvas 2d API)

I found funny but native API was so low level that I decided to organize a lightweight solution for early game developers which I find useful for learning purposes.. (if you are looking for hard game development try threejs which is nice of course :D).

Also separate most of the code in `common` dir which I would like to improve and add more common solutions.

I'm trying to do by myself using html5 Canvas 2d API to build a simple example with:

- A way to handle input events within game context
- An example to move images around (AKA movement)
- An example to implement colliders within objects
- A way to configure how many renders or ticks will be fired for each `requestAnimationFrame`
- Separation of concerns (rendering, ticks)
- OOP features with kaop (inheritance, static classes, even more features are not used on this project)
- More to come... (I hope)

Consider this project as a WIP, coz I'm trying to learn game development (I would like).

Feel free to contribute if you like.
