# JS类型判断


JS中常用的数据类型（截止ES6）分为原始数据类型（`Null`，`Undefined`、`String`、`Number`、`Boolean`、`Symbol`）和复杂数据类型（`Object`）。在复杂数据类型中，又包含了`Object`、`Array`、`Function`这三种类型。


在JS中，用于类型判断的常用方法有四个，分别是：
+ `typeof`
+ `instanceof`
+ `Object.prototype.toString.call`
+ `===`

其中：
+ `typeof`会通过变量的机器码低位1-3的类型信息进行判断，因此无法对复杂类型数据中的`Object`、`Array`和简单数据类型中的`Null`(*1)做出具体的判断。
+ `instanceof`是通过原型链来进行类型比较，在左侧变量的原型链中，如果能找到右侧变量的`prototype`，就会返回true。其中`Null`类型由于没有`__proto__`属性，因此无法使用`instanceof`方法进行判断（在表达式左侧永远返回false，在表达式右侧会报错）。
+ `Object.prototype.toString.call`可以判断所有类型。

综上所属，我们可以列出一个清单来表示几种类型判断在大部分场景下的表现：

```
typeof 1         // number
typeof '1'       // string
typeof true      // boolean
typeof undefined // undefined
typeof null      // object
typeof {}        // object
typeof {a:1}     // object  
typeof Array     // function
typeof Symbol()  // symbol

Object instanceof Object     // true
Object instanceof Array      // false
Object instanceof Function   // true
Array instanceof Object      // true
Array instanceof Array       // false
Array instanceof Function    // true
Function instanceof Object   // true
Function instanceof Array    // false
Function instanceof Function // true
String instanceof String     // false

Date instanceof Date // true
Date instanceof Object // true
Date instanceof Array // false

Object.prototype.toString.call({}) // [object Object]
Object.prototype.toString.call([]) // [object Array]

null === null // true
```

因此，我们不难发现，如果需要我们手写一个类型判断的方法，只需要使用`typeof`就可以解析除了`Null`、`Object`、`Array`这三种类型外的数据类型，然后通过`===`来排除`Null`类型，最后再用`Object.prototype.toString.call`来区分`Object`和`Array`类型。

```
const myType = (target) => {
    const type = typeof target;
    if (type === 'object') {
        if (target === null) {
            return 'null';
        }
        const innerType = Object.prototype.toString.call(target);
        if (innerType === '[object Object]') {
            return 'object';
        }
        if (innerType === '[object Array]') {
            return 'array';
        }
    }

    return type;
}
```

但是，你可以注意到，和其它三种方法不同，`instanceof`的表现和很多人直感预期的完全不同。这是因为`instanceof`是基于原型链来进行判断的，通常用于判断一个对象是否是另一个对象的实例对象。也因此，对于单纯的数据类型比较，它的表现和我们期望的会有很大的不同，具体可以参见原型链一文。

备注：
*1 `Null`类型较为特殊，由于JS使用变量机器码低位的1-3位来存储类型信息，而`Null`类型低位1-3位解析为'000'，和`Object`的类型表示一致，因此`typeof`方法无法区分`Null`和`Object`。通常建议直接使用`===`来做单独的分枝判断处理。