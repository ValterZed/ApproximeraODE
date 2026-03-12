let calculateButton = document.getElementById("calculateButton");
calculateButton.addEventListener("click", calc)



let canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
canvas.style = "border:1px solid #000000"
let height = 500
let width = 500
canvas.height = height
canvas.width = width
document.body.style.overflow = "hidden";

//eval skapa hela funktionen 


function calc() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let resultArray = {}
    let stepLength = parseFloat(document.getElementById("StepLength").value);
    let startX = parseFloat(document.getElementById("startX").value);
    let startY = parseFloat(document.getElementById("startY").value);
    let yPrim = document.getElementById("yPrim").value;
    let endX = parseFloat(document.getElementById("endX").value);
    let resultOutput = document.getElementById("result");
    let x = startX
    let y = startY

    eval(`
    function calculateNextY(x, y, h) {
        let yPrimeValue = ${yPrim}
        return (y+h*yPrimeValue);
    }`)


    let startTime = new Date()
    let timesRan = 0
    while (x < endX) {
        y = calculateNextY(x, y, stepLength, yPrim);
        x += stepLength;
        resultArray[x.toFixed(5)] = y
        timesRan++
    }
    let endTime = new Date()

    
    console.log(`Total run time: ${endTime.getTime() - startTime.getTime()} ms, Times ran: ${timesRan}, Average time per run: ${(endTime.getTime() - startTime.getTime()) / timesRan} ms`)
    resultOutput.innerText = y;

    let befDraw = new Date()
    drawResults(resultArray, startX, endX, "dots");
    let aftDraw = new Date()
    console.log(`Draw time: ${aftDraw.getTime() - befDraw.getTime()} ms, average time per point: ${(aftDraw.getTime() - befDraw.getTime()) / timesRan} ms`)
    console.log("-".repeat(50))
}

function ghgh() {
    eval(document.getElementById("specialFunc").value)
}

function baum() {
    let dt = parseFloat(document.getElementById("StepLength").value);
    let cd = 0.6
    let m = 100
    let g = 9.8
    let A = 0.7
    let s = 0
    let h = 39969.4
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

    function coeff(v){
        let a = 0.1
        return (1/Math.PI)*Math.atan(a*v - (343*a)) + 1.5
    }


    while (h > 0) {
        let vPrim = (1/m)*(m*g - coeff(v)*cd*A*density(h)*(v**2)/2)
        vsList[s] = v
        v = nextV(v, vPrim)
        s = nextS(s, v)
        h = 39000 - s
    } 

    console.log(Math.max(... Object.values(vsList)))
    document.getElementById("result").innerText = Math.max(... Object.values(vsList));

    drawResults(vsList, 0, 39000, "dots")
}

function drawResults(resultArray, startX, endX , method) {
    //method = lines or dots
    let padding = 10
    let minY = Math.min(... Object.values(resultArray))
    let maxY = Math.max(... Object.values(resultArray))
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    let scaleX = (width - 2*padding) / (endX - startX)
    let scaleY = (height - 2*padding) / (maxY - minY)

    //Draw axis
    ctx.strokeStyle = "black";

    ctx.moveTo(((0 - minY)*scaleX + padding),0)
    ctx.lineTo(((0 - minY)*scaleX + padding), width)

    ctx.moveTo(0, (height - ((0 - minY)*scaleY + padding)))
    ctx.lineTo(width, (height - ((0 - minY)*scaleY + padding)))

    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    
    ctx.stroke();

    let lineX = padding-5
    let lineY = height - padding

    while (lineY > padding) {
        ctx.moveTo(lineX, lineY);
        /* ctx.beginPath(); */
        ctx.lineTo(lineX + 10, lineY);
        ctx.strokeStyle = "grey";
        ctx.stroke()
        lineX = padding - 5
        lineY -= 50
    }
    lineY = height - padding + 5
    lineX = 0

    while (lineX < (height - padding)) {
        ctx.moveTo(lineX, lineY);
        /* ctx.beginPath(); */
        ctx.lineTo(lineX, lineY - 10);
        ctx.strokeStyle = "grey";
        ctx.stroke()
        lineY = height - padding + 5
        lineX += 50
    }

    /* ctx.closePath() */

    let drawX = (startX - minY)*scaleX + padding
    let drawY = height - ((startY - minY)*scaleY + padding)

    if (method == "lines") {
        let nextDrawX = 0
        let nextDrawY = 0
        for (let x in resultArray) {
            /* ctx.beginPath(); */
            nextDrawX = (x - minY)*scaleX + padding
            nextDrawY = height - ((resultArray[x] - minY)*scaleY + padding)
            if (((drawX-nextDrawX) <= 2) && ((nextDrawY-drawY >= 2) || (drawY - nextDrawY) >=2)) {
                ctx.moveTo(drawX, drawY);

                drawX = nextDrawX
                drawY = nextDrawY
                ctx.lineTo(drawX, drawY);
                ctx.strokeStyle = "red";
                ctx.stroke();
                
            }
        }
    }
    else if (method == "dots") {
        let prevDrawX = 0
        let prevDrawY = 0
        for (let x in resultArray) {
            /* ctx.beginPath(); */
            if ((drawX-prevDrawX) >= 2 || ((prevDrawY-drawY >= 2) || (drawY - prevDrawY) >=2)) {
                ctx.moveTo(drawX, drawY);
                ctx.arc(drawX, drawY, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
                prevDrawX = drawX
                prevDrawY = drawY
            }

            drawX = (x - startX)*scaleX + padding
            drawY = height - ((resultArray[x] - minY)*scaleY + padding)
        }
    }
}