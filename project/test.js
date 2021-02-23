let obj = {
    0: 10,
    1: 20,
    2: 30,
    3: 40,
    length: 4,
    //第一种方法，调用其他已有迭代器的标志
    // [Symbol.iterator]: Array.prototype[Symbol.iterator]
    //第二种方法：手写一个
    [Symbol.iterator]: function () {
        let self = this,
            index = 0;
        return {
            next() {
                if (index > self.length - 1) {
                    return {
                        value: undefined,
                        done: true
                    };
                }
                return {
                    value: self[index++],
                    done: false
                };
            }
        };
    }
};
for (let item of obj) {
    console.log(item);
}
let a={
    b:1,
    c:2,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
}
for(let i of a){
    console.log(i)
}