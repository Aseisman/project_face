//双方，土地总数n，一方要p，一方要q，问双方都要的土地有多少，各自要的有多少
function first(n, p, q, arrp, arrq) {
  let map = new Map();
  for (let i = 0; i < p; i++) {
    if (map.has(arrp[i])) {
      map.set(arrp[i], map.get(arrp[i]) + 1);
    } else {
      map.set(arrp[i], 1);
    }
  }
  for (let i = 0; i < q; i++) {
    if (map.has(arrq[i])) {
      map.set(arrq[i], map.get(arrq[i]) + 1);
    } else {
      map.set(arrq[i], 1);
    }
  }
  let res = 0;
  map.forEach((v, k) => {
    if (v >= 2) {
      res++;
    }
  });
  console.log(res,p-res,q-res);
}

//修改大小写，要求文章大小写数量相同，至少修改多少字符才能达到要求。
function second(str){
    let count=0;
    for(let i=0;i<str.length;i++){
        if(str[i]>='A'&&str[i]<='Z'){
            count++;
        }
    }
    //小写的
    let count2=str.length-count;
    return count2>count?(count2-count)/2:(count-count2)/2
}
console.log(second("AbCdef"));