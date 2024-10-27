# dyn-template

English | [中文](README_CN.md)

Dynamic template strings. It works similarly to JavaScript's [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals), with two key differences:

- While template literals return a string directly, dynamic templates return a function that returns a string when called
- If an expression in the dynamic template is a function, that function will be executed each time the dynamic template is called

## Installation

```bash
npm i dyn-template
```

## Usage

```javascript
import { dyn } from 'dyn-template'

let n = 0
const random = dyn`${() => ++n}. ${Math.random}`

while (n < 5) console.log(random())

// Possible output:
// 
// 1. 0.7632479109972825
// 2. 0.31000327931995975
// 3. 0.014416508824629193
// 4. 0.7325147663760406
// 5. 0.8938454844327381
```

If an expression in the dynamic template is a function, it will be executed each time the dynamic template is called.  
On the other hand, if an expression is not a function, it will only be evaluated once when creating the dynamic template.

```javascript
import { dyn } from 'dyn-template'

const template = dyn`Compile time: ${Date.now()}, Runtime: ${Date.now}`

for (let n = 0; n < 1000; ++n) console.log(template()) 

// Possible output:
// 
// Compile time: 1729781340083, Runtime: 1729781340083
// ...
// Compile time: 1729781340083, Runtime: 1729781340084
// ...
// Compile time: 1729781340083, Runtime: 1729781340085
// ...
```

## Advanced Usage

```javascript
import { dynTemplate, closure } from 'dyn-template'

const fn1 = () => new Date()
const fn2 = Math.random
const template = dynTemplate`str1 ${fn1} str2 ${'non-function expression'} str3 ${fn2} str4`

console.log(template)
// {
//      first: 'str1 ', 
//      fns:  [ [Function: fn1], [Function: fn2] ], 
//      strs: [ ' str2 non-function expression str3 ', ' str4' ] 
// }

const fn = closure(template)    // Convert template to function

console.log(fn())
// Possible output: str1 2024-10-27T15:51:51.000Z str2 non-function expression str3 0.763247910 str4
```

The object returned by `dynTemplate` contains three properties:

- `first`: The first text block in the template
- `fns`: All functions in the template
- `strs`: Other text blocks in the template. If there are non-function expressions, they will be evaluated and concatenated into the text blocks

The `fns` and `strs` arrays are frozen, so they are immutable, but their elements can be modified.

The `closure` function converts the above object into a function. Its implementation is as follows:

```javascript
function closure(template) {
    const { first, fns, strs } = template
    return function () { return fns.reduce((r, p, i) => r + p() + strs[i], first) }
}
```

So the following two approaches are equivalent:

```javascript
import { dynTemplate, closure, dyn } from 'dyn-template'

const t1 = closure(dynTemplate`...`)
const t2 = dyn`...`
```

When you need to further process the template content, you can first use `dynTemplate` to generate a template object, process it further, and then use `closure` to convert it into a function.

When you need to modify the closure process, you can first use `dynTemplate` to generate a template object, then rewrite a function similar to `closure`:

```javascript
function compile(template) {
    const { first, fns, strs } = template
    return function (time) {
        // Both fns in the template and the closure fn should accept a number or Date parameter
        const t = time instanceof Date ? time : new Date(time)
        return fns.reduce((r, p, i) => r + p(t) + strs[i], first)   
        // Added a parameter to the call of `p`
    }
}

const template = compile(dynTemplate`Today is ${t => t.getMonth() + 1}/${t => t.getDate()}`)
console.log(template(Date.now())) // Possible output: Today is 10/27
```

This allows you to customize the closure calling process to implement more complex functionality. [clock-reader](https://www.npmjs.com/package/clock-reader) is implemented using a similar approach.
