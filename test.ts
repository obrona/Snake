let cnt = 0;

function t1() {
    cnt++;
    console.log('hello world');
    if (cnt < 5) setTimeout(t1, 1000);
}

t1();