function f(a){
    console.log(a[1]);
}

// f(...{a,b,c,d})
console.log();
f(...Object.entries({a:1}));