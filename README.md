# dyn-template

Dynamic Template string. It is all the same with Template Literal String in Javascript besides 
instead of returning a string, it returns a function whose return value is a string.

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

// Maybe
// 
// 1. 0.7632479109972825
// 2. 0.31000327931995975
// 3. 0.014416508824629193
// 4. 0.7325147663760406
// 5. 0.8938454844327381
```

If the expression in template is a function, the function will be executed every time when the 
dynamic template is executed. On the other hand, if the expression is not a function, it will be 
calculated only once when the dynamic template is created.

```javascript
import { dyn } from 'dyn-template'

const template = dyn`Compiled at ${Date.now()}, Running at ${Date.now}`

for (let n = 0; n < 1000; ++n) console.log(template()) 

// Maybe
// 
// Compiled at 1729781340083, Running at 1729781340083
// ...
// Compiled at 1729781340083, Running at 1729781340084
// ...
// Compiled at 1729781340083, Running at 1729781340085
// ...
```
