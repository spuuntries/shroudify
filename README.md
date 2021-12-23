# 🥷 Shroudify

Remember Cloakify? Well, this is that.  
~~But worse, **in node.js**.~~

## 🤔 What:

This project is a crappy attempt at porting the Cloakify project into the node.js ecosystem.

**Don't know what the Cloakify project is?**  
Basically, it's text-based steganography, which means, hiding files/data in text.

## 📚 How to use:

Simple, first install the module in your project:  
`npm i shroudify`  
or  
`yarn add shroudify`

then import it:

> (I'm not sure if this will work with ES6, will update after checking)

`const shroudify = require("shroudify")`

> The thing has JSDOc typings w/ explanatory descriptions, btw. So this explanation's only good if you're trying it out on runkit or smth.

There are two methods, `.encrypt(data, {options})` and `.decrypt(data, {options})`.

The `options` object can contain any of these:

- **Cipher**  
  The cipher to use, can be one of the premade ciphers' name, or a path to a file containing 65 words, with 1 word per row.
- **Rounds**  
  The number of base64 encoding rounds to be done, good for injecting dead data, isn't _that_ useful to prevent brute-force, however.  
  In fact, this may compromise the secrecy by providing more data on the cipher itself.
- **Seed**

## 🗯️ Why:

There are a few reasons,

1. **I haven't seen many steganography projects published on npm**  
   There has only been a few notable steganography implementations that's on npm's registry, with even less being text-based; _in fact_, there's only one that I can mention off the top of my head right now, which is StegCloak.

   While I can assure you that this project is nowhere near perfect, being maintained by a dumdum like me, I hope that the project can add something to NPM as a whole, however small it is.

2. **I**
