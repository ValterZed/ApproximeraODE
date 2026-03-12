let dt = 0.1
let cd = 0
let m = 100
let g = 9.8
let A = 0.7
let s = 0
let h = 39000
let v = 0

let vsList = {}

function density(h) {
    return 1.447663*(0.9998585**h)
}

function nextV(prevV, vPrim){
    return prevV + vPrim*dt
}

function nextS(prevS, prevV){
    return prevS + prevV*dt
}


while (h > 0) {
    let vPrim = (1/m)*(m*g - cd*A*density(h)*(v**2)/2)
    vsList[h] = v
    v = nextV(v, vPrim)
    s = nextS(s, v)
    h = 39000 - s
} 

console.log(Math.max(... Object.values(vsList)))
