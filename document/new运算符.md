# new

### 什么是new运算符

`new`运算符用于创建一个构造函数的实例对象，其表达式解释是：

`new constructor[([arguments])]`

### new运算符的实行过程

`new`运算符在执行时，会顺序执行以下步骤：

1. 创建一个空对象`{}`。
2. 将`{}`的`__proto__`属性指向构造函数的原型对象
3. 将`this`指向该对象并执行函数
4. 若函数有返回对象，且返回的是个对象，则返回该对象。若返回的不是对象，或函数没有返回，则返回`this`。

在这个过程前，首先会检查运算符右侧的是否是一个构造函数。如果不是构造函数，例如`new 'a'`，引擎会直接报错。
在整个过程的最后一步，会检查构造函数执行的结果是否是个对象。当构造函数返回结果是个基本类型时，会和无返回类型的场景一样，直接返回`this`对象。

举例来说
```
function Person(name) {
  this.name = name;
}

function Person2(name){
    this.name = name;
    return [1];
}

function Person3(name){
    this.name = name;
    return name;
}

const person1 = new Person('Tom');
const person2 = new Person2('Tom');
const person3 = new Person3('Tom');

console.log(person1); // { name: Tom }
console.log(person2); // [1];
console.log(person3); // { name: Tom } 
```

可以参照上面的规则，对比运行结果，来理解new过程中最后一步的具体执行。

### 如何在手动实现new

在了解了new的运行流程和机制后，我们就可以照葫芦画瓢，手动实现一个new函数。

首先声明一个名为`myNew`的函数对象，必要一个目标构造函数的入参。
```
const myNew = function(constructor, ...args){}
```
然后依照流程，创建空对象并完成`__proto__`指向和`this`的绑定。
```
const myNew = function(constructor, ...args){
    const obj = {};
    obj.__proto__ = constructor.prototype;
    const ans = constructor.call(obj, args);
}
```
最后检查构造函数运行的结果`ans`是否是对象，不是对象的话将`this`对象返回。

```
const myNew = function(constructor, ...args){
    const obj = {};
    obj.__proto__ = constructor.prototype;
    const ans = constructor.call(obj, args);
    return ans instanceof Object ? ans : obj;
}
```
到此为止，一个简单的手写new过程就完成了。

### 运算优先级

在通常的开发工作中，我们一般不太需要考虑`new`这个运算符的运算优先级问题。但是在面对八股和一些源码时，清晰明确它的运算优先级将为我们省去很多麻烦。
一般来说，`new`运算符的运算优先级问题，只牵扯它和`.`运算符。

先说结论：

`new`运算符带括号时，与`.`运算符平级，否则低于`.`运算符的优先级。

让我们来看一个示例

```
function Foo() {
  console.log(1);
  return this;
}

Foo.sayName = function() {
  console.log(2);
};

Foo.prototype.sayName = function() {
  console.log(3);
};

new Foo.sayName(); // 2
new Foo().sayName(); // 1 3
```

在这个例子中，`new Foo.sayName()`的输出结果是`2`,而`new Foo().sayName()`的输出结果是`1 3`。
让我们按照上面结论中的优先级来分析下这两行代码。

+ `new Foo.sayName()`中，`new`运算符后不带括号，因此`new`的优先级小于`.`，所以先访问`Foo.sayName`，然后对其进行new操作。因此最终结果会打印`2`。
+ 而在`new Foo().sayName()`中，`new`运算符后带有括号，因此`new`与`.`的运算优先级平级，所以会先执行`new Foo()`，获得一个`Foo`的实例对象，在这个过程中，会打印`1`。然后通过`.`来访问实例对象上的`sayName`方法，打印`3`。

### 参考
[ECMAScript2023 Language Specification sec-new-operator](https://tc39.es/ecma262/#sec-new-operator)