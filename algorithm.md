1. 在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
```js
function Find(target, array)
{
    // write code here
    //1
    //     return array.some(arr=>arr.some(e=>e===target))
    //2 左下角开始到右上角
    let rows=array.length,cols=array[0].length;
    let i=rows-1,j=0;
    while(i>=0&&j<cols){
        if(target<array[i][j])i--;
        else if(target>array[i][j])
            j++;
        else
            return true;
    }
    return false;
    
}
```
2. 