# dyn-template

[English](README.md) | 中文

动态模板字符串。它与JavaScript中的[模板字符串](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)基本相同。仅有的区别在于：

- 模板字符串直接返回一个字符串，而动态模板返回一个函数，这个函数每次调用时返回一个字符串
- 如果传入动态模板中的表达式是一个函数，那么每次执行动态模板时都会执行这个函数

## 安装

```bash
npm i dyn-template
```

## 使用方法

```javascript
import { dyn } from 'dyn-template'

let n = 0
const random = dyn`${() => ++n}. ${Math.random}`

while (n < 5) console.log(random())

// 可能的输出：
// 
// 1. 0.7632479109972825
// 2. 0.31000327931995975
// 3. 0.014416508824629193
// 4. 0.7325147663760406
// 5. 0.8938454844327381
```

如果传入动态模板中的表达式是一个函数，那么每次执行动态模板时都会执行这个函数。  
另一方面，如果传入动态模板中的表达式不是函数，它只会在创建动态模板时计算一次。

```javascript
import { dyn } from 'dyn-template'

const template = dyn`编译时间：${Date.now()}，运行时间：${Date.now}`

for (let n = 0; n < 1000; ++n) console.log(template()) 

// 可能的输出：
// 
// 编译时间：1729781340083，运行时间：1729781340083
// ...
// 编译时间：1729781340083，运行时间：1729781340084
// ...
// 编译时间：1729781340083，运行时间：1729781340085
// ...
```

## 高级用法

```javascript
import { dynTemplate, closure } from 'dyn-template'

const fn1 = () => new Date()
const fn2 = Math.random
const template = dynTemplate`文本块一 ${fn1} 文本块二 ${'非函数表达式'} 文本块三 ${fn2} 文本块四`

console.log(template)
// {
//      first: '文本块一 ', 
//      fns:  [ [Function: fn1], [Function: fn2] ], 
//      strs: [ ' 文本块二 非函数表达式 文本块三 ', ' 文本块四' ] 
// }

const fn = closure(template)    // 将模板转换为函数

console.log(fn())
// 可能的输出： 文本块一 2024-10-27T15:51:51.000Z 文本块二 非函数表达式 文本块三 0.763247910997 文本块四
```

`dynTemplate` 返回的对象中包含三个属性：

- `first`：模板中的第一个文本块
- `fns`：模板中所有的函数
- `strs`：模板中其他的文本块，同时如果模板中存在非函数表达式，则会被计算并转换为字符串连接到文本块中

其中 `fns` 和 `strs` 两个数组是冻结的，所以它们本身是不可变的，但它们内部的元素是可变的。

`closure` 函数将上述对象转换为函数，其具体实现如下：

```javascript
function closure(template) {
    const { first, fns, strs } = template
    return function () { return fns.reduce((r, p, i) => r + p() + strs[i], first) }
}
```

所以以下两种写法效果是等价的：

```javascript
import { dynTemplate, closure, dyn } from 'dyn-template'

const t1 = closure(dynTemplate`...`)
const t2 = dyn`...`
```

当有对模板内容进行进一步加工的需求时，可以先使用 `dynTemplate` 生成模板对象，做进一步加工后再使用 `closure` 将其转换为函数。

当对闭包流程有修改时，可以先使用 `dynTemplate` 生成模板对象，然后重写一个类似于 `closure` 的函数：

```javascript
function compile(template) {
    const { first, fns, strs } = template
    return function (time) { // 输入到模板内的函数 和 闭包产生的函数 都应该接收一个数字或 Date 类型的参数
        const t = time instanceof Date ? time : new Date(time)
        return fns.reduce((r, p, i) => r + p(t) + strs[i], first)   // 对 `p` 的调用增加了一个参数
    }
}

const template = compile(dynTemplate`${t => t.getMonth() + 1}月${t => t.getDate()}日`)
console.log(template(Date.now())) // 可能的输出：10月27日
```

这样可以自定义闭包调用流程，从而实现更为复杂的功能。[clock-reader](https://www.npmjs.com/package/clock-reader) 就是使用类似于此的方法实现的。