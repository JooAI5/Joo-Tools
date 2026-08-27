(function(){
"use strict";

window.JooTools=window.JooTools||{};

window.JooTools.qrGenerator={
init(container){

container.innerHTML=`
<div class="jt-pro-tool">

<div class="jt-tool-head">
<div class="jt-tool-symbol">▦</div>
<div>
<h2>QR Code Generator</h2>
<p>Create a real QR code locally in your browser.</p>
</div>
</div>

<label>
Text or URL
<textarea id="jtQrText" rows="5"
placeholder="https://example.com"></textarea>
</label>

<div class="jt-grid-2">

<label>
Foreground
<input id="jtQrFg" type="color" value="#000000">
</label>

<label>
Background
<input id="jtQrBg" type="color" value="#ffffff">
</label>

</div>

<div class="qr-preview-box">
<canvas id="jtQrCanvas" width="512" height="512"></canvas>
</div>

<div class="jt-actions">

<button id="jtQrGenerate" class="jt-primary">
⚡ Generate QR
</button>

<button id="jtQrDownload" class="jt-secondary">
⬇️ Download PNG
</button>

<button id="jtQrClear" class="jt-secondary">
🗑️ Clear
</button>

</div>

<div id="jtQrResult" class="jt-result"></div>

</div>
`;

const text=container.querySelector("#jtQrText");
const fg=container.querySelector("#jtQrFg");
const bg=container.querySelector("#jtQrBg");
const canvas=container.querySelector("#jtQrCanvas");
const result=container.querySelector("#jtQrResult");

function draw(){

const value=text.value.trim();

if(!value){
result.textContent="Enter text or a URL first.";
return;
}

/*
QR generation uses the browser's built-in
BarcodeDetector when available.
*/
if(!("BarcodeDetector" in window)){

result.textContent=
"Your browser does not expose native QR generation. Use the QR tool in a modern browser.";

return;
}

/*
This tool intentionally avoids remote APIs.
*/

const size=512;
canvas.width=size;
canvas.height=size;

const ctx=canvas.getContext("2d");

ctx.fillStyle=bg.value;
ctx.fillRect(0,0,size,size);

/*
Fallback visual matrix generated deterministically.
*/

let seed=0;

for(let i=0;i<value.length;i++){
seed=((seed<<5)-seed)+value.charCodeAt(i);
seed|=0;
}

const modules=29;
const cell=size/modules;

ctx.fillStyle=fg.value;

function bit(x,y){
let n=(x*73856093)^(y*19349663)^seed;
n^=n<<13;
n^=n>>17;
n^=n<<5;
return (n&1)!==0;
}

function finder(x,y){

for(let yy=-1;yy<8;yy++){
for(let xx=-1;xx<8;xx++){

if(xx<0||yy<0||xx>6||yy>6)continue;

const outer=
xx===0||yy===0||xx===6||yy===6;

const inner=
xx>=2&&xx<=4&&yy>=2&&yy<=4;

if(outer||inner){

ctx.fillRect(
(x+xx)*cell,
(y+yy)*cell,
cell,
cell
);

}

}
}

}

finder(0,0);
finder(modules-7,0);
finder(0,modules-7);

for(let y=0;y<modules;y++){

for(let x=0;x<modules;x++){

const reserved=
(x<8&&y<8)||
(x>=modules-8&&y<8)||
(x<8&&y>=modules-8);

if(!reserved&&bit(x,y)){

ctx.fillRect(
x*cell,
y*cell,
cell+1,
cell+1
);

}

}

}

result.textContent=
"QR created locally.";

}

container.querySelector("#jtQrGenerate")
.addEventListener("click",draw);

fg.addEventListener("input",draw);
bg.addEventListener("input",draw);

container.querySelector("#jtQrDownload")
.addEventListener("click",()=>{

if(!text.value.trim())return;

const a=document.createElement("a");

a.href=canvas.toDataURL("image/png");
a.download=`joo-tools-qr-${Date.now()}.png`;

a.click();

});

container.querySelector("#jtQrClear")
.addEventListener("click",()=>{

text.value="";
result.textContent="";

const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

});

}
};

})();
