let calculateButton = document.getElementById("calculateButton");
calculateButton.addEventListener("click", calc)



let canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
canvas.style = "border:1px solid #000000"
let height = 450
let width = 450
canvas.height = height
canvas.width = width

let canvasTop = document.getElementById("canvasTop")
const ctxTop = canvasTop.getContext("2d");

let canvasYPrim = document.getElementById("canvasYPrim")
const ctxPrim = canvasYPrim.getContext("2d");

canvasTop.height = height
canvasTop.width = width



document.body.style.overflow = "hidden";
document.addEventListener("mousemove", mouseUpdate)
document.getElementById("scaleType").addEventListener("change", () => {
    drawResults(resultArray, mouseUpdateScales.minX, mouseUpdateScales.maxX, document.getElementById("plotType").value)
})
document.getElementById("plotType").addEventListener("change", () => {
    drawResults(resultArray, mouseUpdateScales.minX, mouseUpdateScales.maxX, document.getElementById("plotType").value)
})


let resultArray = {}
let derivativeArray = {}

let mouseUpdateScales = {}

function mouseUpdate(event) {
    if (Object.keys(mouseUpdateScales).length === 0) {
        return
    }
    let method = document.getElementById("findNearest").value;

    if (method === "mousePos"){
        mousePositionToGraph(event.clientX, event.clientY)
    }

    else {
        mousePosToNearestGraphPoint(event.clientX, event.clientY)
    }
    
    
}

function mousePositionToGraph(xPosG, yPosG) {
    let rect = canvas.getBoundingClientRect();
    let xPos = xPosG - rect.left;
    let yPos = yPosG - rect.top;
    
    if ((0 <= xPos) && (xPos <= width) && (0 <= yPos) && (yPos <= height)) {
        let padding = 10
        let minY = mouseUpdateScales.minY
        /* let maxY = mouseUpdateScales.maxY */
        let minX = mouseUpdateScales.minX
        /* let maxX = Math.max(... Object.keys(resultArray)) */
        let scaleX =  mouseUpdateScales.scaleX
        let scaleY =  mouseUpdateScales.scaleY


        let x = ((xPos - padding)/scaleX) + minX
        let y = (((height - yPos) - padding)/scaleY) + minY

        drawBig(x, y, "mouse")
        document.getElementById("mousePos").innerText = `Mouse position: (${scientificNotation(x)}, ${scientificNotation(y)})`
    }
}

function mousePosToNearestGraphPoint(xPosG, yPosG) {
    let rect = canvas.getBoundingClientRect();
    let xPos = xPosG - rect.left;
    let yPos = yPosG - rect.top;

    let method = document.getElementById("findNearest").value;

    

    if ((0 <= xPos) && (xPos <= width) && (0 <= yPos) && (yPos <= height)) {
        let padding = 10
        let minY = mouseUpdateScales.minY
        let maxY = mouseUpdateScales.maxY
        let minX = mouseUpdateScales.minX
        let maxX = Math.max(... Object.keys(resultArray))
        let scaleX =  mouseUpdateScales.scaleX
        let scaleY =  mouseUpdateScales.scaleY

        if (method === "x") {
            let x = ((xPos - padding)/scaleX) + minX
            let y = resultArray[Object.keys(resultArray).reduce(function(prev, curr) { return (Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev)})]
            drawBig(x, y)
            document.getElementById("mousePos").innerText = `Mouse position: (${scientificNotation(x)}, ${scientificNotation(y)})`
            
        }
        if (method === "abs") {
            let xRough = ((xPos - padding)/scaleX) + minX
            let yRough = (((height - yPos) - padding)/scaleY) + minY
            let pos = Object.entries(resultArray).reduce(function(prev, curr) {
                if (Math.abs(xRough-curr[0]) > maxX - minX || Math.abs(yRough-curr[1]) > maxY - minY) {
                    return prev
                }
                let prevDist = Math.sqrt(((prev[0] - xRough)**2) + ((prev[1] - yRough)**2))
                let currDist = Math.sqrt(((curr[0] - xRough)**2) + ((curr[1] - yRough)**2))
                return (currDist < prevDist) ? curr : prev
            })
            let x = parseFloat(pos[0])
            let y = pos[1]
            /* let x = Object.keys(resultArray).reduce(function(prev, curr) { return (Math.abs(curr - xRough) < Math.abs(prev - xRough) ? curr : prev)})
            let y = resultArray[x] */
            //Object.values(resultArray).reduce(function(prev, curr) { return (Math.abs(curr - yRough) < Math.abs(prev - yRough) ? curr : prev)})
            drawBig(x, y)
            document.getElementById("mousePos").innerText = `Mouse position: (${scientificNotation(x)}, ${scientificNotation(y)})`
            
        }


    }
}


function drawBig(x, y, type="jump" ) {
    let size = 5 
    if (type === "mouse") {size = 3}

    ctxTop.beginPath();
    //Scales and padding
    let padding = 10
    let minY = Math.min(... Object.values(resultArray))
    let maxY = Math.max(... Object.values(resultArray))
    ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
    ctxTop.beginPath();

    let minX = Math.min(... Object.keys(resultArray))
    let maxX = Math.max(... Object.keys(resultArray))
    
    let scaleY = (height - 2*padding) / (maxY - minY)
    let scaleX = (width - 2*padding) / (maxX - minX)
    
    if (document.getElementById("scaleType").value == "equal") {
        let scale = Math.min(scaleX, scaleY)
        scaleX = scale
        scaleY = scale
    }

    drawX = (x - minX)*scaleX + padding
    drawY = height - ((y - minY)*scaleY + padding)

    ctxTop.moveTo(drawX, drawY);
    ctxTop.arc(drawX, drawY, size, 0, 2 * Math.PI);
    ctxTop.fillStyle = "blue";
    ctxTop.fill();
}


function calc() {
    resultArray = {}
    derivativeArray = {}
    console.log(resultArray)

    /* let resultArray = {} */
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
    }
    `)


    let startTime = new Date()
    let timesRan = 0
    while (x < endX) {
        y = calculateNextY(x, y, stepLength, yPrim);
        x += stepLength;
        resultArray[x.toFixed(5)] = y
        derivativeArray[x.toFixed(5)] = eval(yPrim)
        timesRan++
    }
    let endTime = new Date()

    
    console.log(`Total run time: ${endTime.getTime() - startTime.getTime()} ms, Times ran: ${timesRan}, Average time per run: ${(endTime.getTime() - startTime.getTime()) / timesRan} ms`)
    resultOutput.innerText = `f(${endX}) = ${y}`;

    let befDraw = new Date()
    drawResults(resultArray, startX, endX, "dots");
    let aftDraw = new Date()
    console.log(`Draw time: ${aftDraw.getTime() - befDraw.getTime()} ms, average time per point: ${(aftDraw.getTime() - befDraw.getTime()) / timesRan} ms`)
    console.log("-".repeat(50))
    drawResults(derivativeArray, startX, endX, "lines", ctxPrim, "blue", false)
}

function ghgh() {
    resultArray = {}
    let startTime = new Date()
    let drawVals = eval(document.getElementById("specialFunc").value)
    let endTime = new Date()
    console.log(`Total run time: ${endTime.getTime() - startTime.getTime()} ms`)
    let befDraw = new Date()
    drawResults(drawVals[0], drawVals[1], drawVals[2], drawVals[3])
    let aftDraw = new Date()
    console.log(`Draw time: ${aftDraw.getTime() - befDraw.getTime()} ms`)
    console.log("-".repeat(50))
}

function scientificNotation(num, decimals = 2) {
    if (num === 0) {
        return "0";
    }
    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exponent);
    return `${mantissa.toFixed(decimals)}*10^${exponent}`;
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

    returnArray = {}

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
        returnArray[s] = v
        v = nextV(v, vPrim)
        s = nextS(s, v)
        h = 39000 - s
    } 

    console.log(Math.max(... Object.values(returnArray)))
    document.getElementById("result").innerText = Math.max(... Object.values(returnArray));

    return [returnArray, 0, 39000, "dots"]
}

function moon(){
    let r = 3.844*(10**8)
    let T = 30*24*60*60
    let M = 5.972*(10**24)
    let vx = 1
    let vy = (2*Math.PI*r)/T
    let G = 6.6743*(10**-11)
    let x = r
    let y = 0
    let dt = parseFloat(document.getElementById("StepLength").value)
    let t = 0

    r = Math.sqrt(x**2 + y**2)

    let ax = G*M*x/(r**3)
    let ay = G*M*y/(r**3)

    while (t <= T) {
        ax = -G*M*x/(r**3)
        ay = -G*M*y/(r**3)

        vx += ax*dt
        vy += ay*dt

        x += vx*dt
        y += vy*dt

        r = Math.sqrt(x**2 + y**2)

        t += dt

        //posList[t]  = Math.sqrt((vx**2)+(vy**2))
        resultArray[x] = y
        //posList[t] = r
        /* derivativeArray[x] = Math.sqrt((vx**2)+(vy**2)) */
    }


    console.log(Math.max(... Object.values(resultArray))/Math.min(... Object.values(resultArray)))
    document.getElementById("result").innerText = Math.max(... Object.values(resultArray));
    return [resultArray, -1.5*r, 1.5*r, document.getElementById("plotType").value]
}

function drawResults(resultArray, startX, endX , method , canvas=ctx, colour = "red", calcScales = true) {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctxPrim.clearRect(0, 0, ctxPrim.width, ctxPrim.height);
    ctxTop.clearRect(0, 0, ctxTop.width, ctxTop.height);
    //method = lines or dots

    console.log(mouseUpdateScales)

    let padding = 10
    let minY = parseFloat(mouseUpdateScales.minY)
    let maxY = parseFloat(mouseUpdateScales.maxY)
    canvas.clearRect(0, 0, canvas.width, canvas.height);
    canvas.beginPath();

    let minX = parseFloat(mouseUpdateScales.minX)
    let maxX = parseFloat(mouseUpdateScales.maxX)

    let scaleY = parseFloat(mouseUpdateScales.scaleY)
    let scaleX = parseFloat(mouseUpdateScales.scaleX)

    /* if (document.getElementById("scaleType").value == "equal") {
        let scale = Math.min(scaleX, scaleY)
        scaleX = scale
        scaleY = scale
    } */



    if (calcScales) {
        //Scales and padding
        padding = 10
        minY = Math.min(... Object.values(resultArray))
        maxY = Math.max(... Object.values(resultArray))
        canvas.clearRect(0, 0, canvas.width, canvas.height);
        canvas.beginPath();

        minX = Math.min(... Object.keys(resultArray))
        maxX = Math.max(... Object.keys(resultArray))
        
        scaleY = (height - 2*padding) / (maxY - minY)
        scaleX = (width - 2*padding) / (maxX - minX)
        
        if (document.getElementById("scaleType").value == "equal") {
            scale = Math.min(scaleX, scaleY)
            scaleX = scale
            scaleY = scale
        }

        mouseUpdateScales = {
            scaleX: scaleX,
            scaleY: scaleY,
            minX: minX,
            minY: minY,
            padding: padding,
            height: height
        }
    }

    //Draw scales
    canvas.strokeStyle = "black";
    canvas.font = "15px Arial";
    canvas.strokeText(("(" + minY.toFixed(2) + "," + minX.toFixed(2) + ")"), padding, height - padding + 10)
    canvas.strokeText(("(" + maxY.toFixed(2) + "," + maxX.toFixed(2) + ")"), width - padding - 80, padding + 10, 80+padding)
    document.getElementById("scales").innerText = `Min: (${scientificNotation(minX,1)}, ${scientificNotation(minY,1)}), Max: (${scientificNotation(maxX,1)}, ${scientificNotation(maxY,1)})`

    //Draw axis
    canvas.strokeStyle = "black";


    //drawX = (x - minX)*scaleX + padding
    //drawY = height - ((resultArray[x] - minY)*scaleY + padding)

    canvas.moveTo(((0 - minX)*scaleX + padding),0)
    canvas.lineTo(((0 - minX)*scaleX + padding), width)

    canvas.moveTo(0, (height - ((0 - minY)*scaleY + padding)))
    canvas.lineTo(width, (height - ((0 - minY)*scaleY + padding)))

    canvas.moveTo(padding, height - padding);
    canvas.lineTo(width - padding, height - padding);
    canvas.moveTo(padding, height - padding);
    canvas.lineTo(padding, padding);
    
    canvas.stroke();

    let lineX = padding-5
    let lineY = height - padding

    while (lineY > padding) {
        canvas.moveTo(lineX, lineY);
        /* canvas.beginPath(); */
        canvas.lineTo(lineX + 10, lineY);
        canvas.strokeStyle = "grey";
        canvas.stroke()
        lineX = padding - 5
        lineY -= 50
    }
    lineY = height - padding + 5
    lineX = 0

    while (lineX < (height - padding)) {
        canvas.moveTo(lineX, lineY);
        /* canvas.beginPath(); */
        canvas.lineTo(lineX, lineY - 10);
        canvas.strokeStyle = "grey";
        canvas.stroke()
        lineY = height - padding + 5
        lineX += 50
    }

    canvas.closePath()


    //Draw function
    let drawX = (startX - minY)*scaleX + padding
    let drawY = height - ((startY - minY)*scaleY + padding)
    canvas.moveTo(drawX, drawY);
    canvas.beginPath();
    canvas.strokeStyle = colour;

    if (method === "lines") {
        let nextDrawX = 0
        let nextDrawY = 0
        for (let x in resultArray) {
            /* canvas.beginPath(); */
            nextDrawX = (x - minX)*scaleX + padding
            nextDrawY = height - ((resultArray[x] - minY)*scaleY + padding)
            if (((drawX-nextDrawX) <= 2) || ((nextDrawY-drawY >= 2) || (drawY - nextDrawY) >=2)) {
                canvas.moveTo(drawX, drawY);

                drawX = nextDrawX
                drawY = nextDrawY
                canvas.lineTo(drawX, drawY);
                canvas.strokeStyle = colour;
                canvas.stroke();
                
            }
        }
    }
    else if (method === "dots") {
        let prevDrawX = 0
        let prevDrawY = 0
        for (let x in resultArray) {
            /* canvas.beginPath(); */
            if (Math.abs(drawX-prevDrawX) >= 2 || Math.abs(prevDrawY-drawY) >= 2) {
                canvas.moveTo(drawX, drawY);
                canvas.arc(drawX, drawY, 2, 0, 2 * Math.PI);
                canvas.fillStyle = colour;
                canvas.fill();
                prevDrawX = drawX
                prevDrawY = drawY
            }

            drawX = (x - minX)*scaleX + padding
            drawY = height - ((resultArray[x] - minY)*scaleY + padding)
        }
    }
}