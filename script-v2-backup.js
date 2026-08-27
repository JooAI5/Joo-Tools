const tools = [

{
id:"calculator",
category:"🧮 Calculators",
icon:"🧮",
name:"Calculator",
description:"Simple and powerful calculator.",
run:calculator
},

{
id:"percentage",
category:"🧮 Calculators",
icon:"📊",
name:"Percentage Calculator",
description:"Calculate percentages quickly.",
run:percentage
},

{
id:"random-number",
category:"🎲 Generators",
icon:"🎲",
name:"Random Number",
description:"Generate a random number.",
run:randomNumber
},

{
id:"random-choice",
category:"🎲 Generators",
icon:"🎯",
name:"Random Choice",
description:"Let the computer choose for you.",
run:randomChoice
},

{
id:"text-sorter",
category:"📝 Text Tools",
icon:"🔤",
name:"Text Sorter",
description:"Sort lines alphabetically.",
run:textSorter
},

{
id:"duplicate",
category:"📝 Text Tools",
icon:"🧹",
name:"Duplicate Remover",
description:"Remove duplicate lines.",
run:duplicateRemover
},

{
id:"json",
category:"💻 Developer Tools",
icon:"{}",
name:"JSON Formatter",
description:"Format and validate JSON.",
run:jsonFormatter
},

{
id:"url",
category:"💻 Developer Tools",
icon:"🔗",
name:"URL Encoder",
description:"Encode and decode URLs.",
run:urlEncoder
},

{
id:"base",
category:"💻 Developer Tools",
icon:"🔢",
name:"Base Converter",
description:"Convert numbers between bases.",
run:baseConverter
},

{
id:"uuid",
category:"💻 Developer Tools",
icon:"🆔",
name:"UUID Generator",
description:"Generate random UUIDs.",
run:uuidGenerator
},

{
id:"gradient",
category:"🎨 Design Tools",
icon:"🌈",
name:"Gradient Generator",
description:"Generate beautiful CSS gradients.",
run:gradientGenerator
},

{
id:"palette",
category:"🎨 Design Tools",
icon:"🎨",
name:"Palette Generator",
description:"Create random color palettes.",
run:paletteGenerator
},

{
id:"stopwatch",
category:"⏱️ Time Tools",
icon:"⏱️",
name:"Stopwatch",
description:"Simple stopwatch.",
run:stopwatch
},

{
id:"countdown",
category:"⏳ Time Tools",
icon:"⏳",
name:"Countdown",
description:"Create a countdown timer.",
run:countdown
}

];

const categories = document.getElementById("categories");
const search = document.getElementById("search");
const modal = document.getElementById("toolModal");
const area = document.getElementById("toolArea");

let favorites = JSON.parse(localStorage.getItem("jooFavorites") || "[]");

function render(list=tools){

    categories.innerHTML="";

    const grouped={};

    list.forEach(tool=>{
        if(!grouped[tool.category])
            grouped[tool.category]=[];

        grouped[tool.category].push(tool);
    });

    Object.entries(grouped).forEach(([category,list])=>{

        const section=document.createElement("section");

        section.className="category";

        section.innerHTML=`
            <div class="category-title">
                <h2>${category}</h2>
            </div>

            <div class="tools">
                ${list.map(tool=>card(tool)).join("")}
            </div>
        `;

        categories.appendChild(section);

    });

    document.getElementById("toolCount").textContent=tools.length;

    updateFavCount();
}

function card(tool){

    const active=favorites.includes(tool.id) ? "active":"";

    return `
    <article class="card">

        <button class="favorite ${active}"
            onclick="toggleFavorite('${tool.id}',event)">
            ★
        </button>

        <div class="card-icon">${tool.icon}</div>

        <h3>${tool.name}</h3>

        <p>${tool.description}</p>

        <button onclick="openTool('${tool.id}')">
            Open Tool →
        </button>

    </article>
    `;
}

function toggleFavorite(id,event){

    event.stopPropagation();

    if(favorites.includes(id))
        favorites=favorites.filter(x=>x!==id);
    else
        favorites.push(id);

    localStorage.setItem("jooFavorites",JSON.stringify(favorites));

    render();
}

function updateFavCount(){

    document.getElementById("favCount").textContent=favorites.length;

}

search.addEventListener("input",()=>{

    const q=search.value.toLowerCase();

    render(
        tools.filter(t=>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        )
    );

});

function openTool(id){

    const tool=tools.find(t=>t.id===id);

    if(!tool)return;

    modal.classList.remove("hidden");

    area.innerHTML=`
        <div class="tool-container">
            <h2>${tool.icon} ${tool.name}</h2>
            ${tool.run()}
        </div>
    `;

}

function closeTool(){

    modal.classList.add("hidden");
    area.innerHTML="";

}

function calculator(){

return `
<input id="calc" placeholder="Example: 10 + 5 * 2">

<div class="buttons">
<button onclick="calculate()">Calculate</button>
<button onclick="document.getElementById('calc').value=''">Clear</button>
</div>

<div id="calcResult" class="result"></div>
`;

}

function calculate(){

const value=document.getElementById("calc").value;

if(!/^[0-9+*/().%\\-\\s]+$/.test(value)){
document.getElementById("calcResult").textContent="Invalid expression.";
return;
}

try{

const result=Function('"use strict";return ('+value+')')();

document.getElementById("calcResult").textContent=result;

}catch{

document.getElementById("calcResult").textContent="Invalid calculation.";

}

}

function percentage(){

return `
<input id="percentValue" type="number" placeholder="Number">
<input id="percentRate" type="number" placeholder="Percentage">

<div class="buttons">
<button onclick="calculatePercentage()">Calculate</button>
</div>

<div id="percentageResult" class="result"></div>
`;

}

function calculatePercentage(){

const value=Number(document.getElementById("percentValue").value);
const rate=Number(document.getElementById("percentRate").value);

document.getElementById("percentageResult").textContent=
(value*rate/100).toString();

}

function randomNumber(){

return `
<input id="min" type="number" placeholder="Minimum">
<input id="max" type="number" placeholder="Maximum">

<div class="buttons">
<button onclick="generateRandom()">Generate</button>
</div>

<div id="randomResult" class="result"></div>
`;

}

function generateRandom(){

const min=Number(document.getElementById("min").value);
const max=Number(document.getElementById("max").value);

if(max<min){

document.getElementById("randomResult").textContent="Invalid range.";

return;

}

const n=Math.floor(Math.random()*(max-min+1))+min;

document.getElementById("randomResult").textContent=n;

}

function randomChoice(){

return `
<textarea id="choices"
placeholder="Enter choices, one per line"></textarea>

<div class="buttons">
<button onclick="chooseRandom()">Choose</button>
</div>

<div id="choiceResult" class="result"></div>
`;

}

function chooseRandom(){

const values=document.getElementById("choices").value
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

if(!values.length)return;

const result=values[Math.floor(Math.random()*values.length)];

document.getElementById("choiceResult").textContent=result;

}

function textSorter(){

return `
<textarea id="sortText"
placeholder="One item per line"></textarea>

<div class="buttons">
<button onclick="sortText()">Sort A → Z</button>
<button onclick="sortTextReverse()">Sort Z → A</button>
</div>

`;

}

function sortText(reverse=false){

const el=document.getElementById("sortText");

let lines=el.value.split("\n").filter(Boolean);

lines.sort((a,b)=>a.localeCompare(b));

if(reverse)lines.reverse();

el.value=lines.join("\n");

}

function sortTextReverse(){

sortText(true);

}

function duplicateRemover(){

return `
<textarea id="duplicateText"
placeholder="One line per item"></textarea>

<div class="buttons">
<button onclick="removeDuplicates()">Remove Duplicates</button>
</div>
`;

}

function removeDuplicates(){

const el=document.getElementById("duplicateText");

const lines=el.value.split("\n");

el.value=[...new Set(lines)].join("\n");

}

function jsonFormatter(){

return `
<textarea id="jsonText"
placeholder='{"name":"Joo","version":2}'></textarea>

<div class="buttons">
<button onclick="formatJSON()">Format JSON</button>
<button onclick="minifyJSON()">Minify</button>
</div>

<div id="jsonResult" class="result"></div>
`;

}

function formatJSON(){

try{

const obj=JSON.parse(document.getElementById("jsonText").value);

document.getElementById("jsonResult").textContent=
JSON.stringify(obj,null,2);

}catch{

document.getElementById("jsonResult").textContent="Invalid JSON.";

}

}

function minifyJSON(){

try{

const obj=JSON.parse(document.getElementById("jsonText").value);

document.getElementById("jsonResult").textContent=
JSON.stringify(obj);

}catch{

document.getElementById("jsonResult").textContent="Invalid JSON.";

}

}

function urlEncoder(){

return `
<textarea id="urlText" placeholder="Enter text or URL"></textarea>

<div class="buttons">
<button onclick="encodeURL()">Encode</button>
<button onclick="decodeURL()">Decode</button>
</div>

<div id="urlResult" class="result"></div>
`;

}

function encodeURL(){

const value=document.getElementById("urlText").value;

document.getElementById("urlResult").textContent=
encodeURIComponent(value);

}

function decodeURL(){

try{

document.getElementById("urlResult").textContent=
decodeURIComponent(document.getElementById("urlText").value);

}catch{

document.getElementById("urlResult").textContent="Invalid encoded URL.";

}

}

function baseConverter(){

return `
<input id="baseNumber" placeholder="Number">
<input id="fromBase" type="number" value="10" min="2" max="36">
<input id="toBase" type="number" value="16" min="2" max="36">

<div class="buttons">
<button onclick="convertBase()">Convert</button>
</div>

<div id="baseResult" class="result"></div>
`;

}

function convertBase(){

const number=document.getElementById("baseNumber").value.trim();

const from=Number(document.getElementById("fromBase").value);

const to=Number(document.getElementById("toBase").value);

try{

const decimal=parseInt(number,from);

if(isNaN(decimal))throw Error();

document.getElementById("baseResult").textContent=
decimal.toString(to).toUpperCase();

}catch{

document.getElementById("baseResult").textContent="Invalid number.";

}

}

function uuidGenerator(){

return `
<div class="buttons">
<button onclick="generateUUID()">Generate UUID</button>
</div>

<div id="uuidResult" class="result"></div>
`;

}

function generateUUID(){

const uuid=crypto.randomUUID();

document.getElementById("uuidResult").textContent=uuid;

}

function gradientGenerator(){

return `
<div class="buttons">
<button onclick="generateGradient()">Generate Gradient</button>
</div>

<div id="gradientBox"
style="height:220px;border-radius:18px;margin-top:20px"></div>

<div id="gradientResult" class="result"></div>
`;

}

function generateGradient(){

const c1=randomColor();
const c2=randomColor();

const gradient=`linear-gradient(135deg, ${c1}, ${c2})`;

document.getElementById("gradientBox").style.background=gradient;

document.getElementById("gradientResult").textContent=
gradient;

}

function randomColor(){

return "#"+Math.floor(Math.random()*16777215)
.toString(16).padStart(6,"0");

}

function paletteGenerator(){

return `
<div class="buttons">
<button onclick="generatePalette()">Generate Palette</button>
</div>

<div id="paletteResult" class="palette"
style="margin-top:20px"></div>
`;

}

function generatePalette(){

const container=document.getElementById("paletteResult");

container.innerHTML="";

for(let i=0;i<5;i++){

const color=randomColor();

const div=document.createElement("div");

div.className="color";

div.style.background=color;

div.textContent=color.toUpperCase();

div.onclick=()=>navigator.clipboard.writeText(color);

container.appendChild(div);

}

}

let stopwatchInterval;
let stopwatchSeconds=0;

function stopwatch(){

return `
<div class="result" id="stopwatchDisplay">
00:00:00
</div>

<div class="buttons">
<button onclick="startStopwatch()">Start</button>
<button onclick="pauseStopwatch()">Pause</button>
<button onclick="resetStopwatch()">Reset</button>
</div>
`;

}

function updateStopwatch(){

stopwatchSeconds++;

const h=Math.floor(stopwatchSeconds/3600);

const m=Math.floor((stopwatchSeconds%3600)/60);

const s=stopwatchSeconds%60;

document.getElementById("stopwatchDisplay").textContent=
`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

function startStopwatch(){

if(stopwatchInterval)return;

stopwatchInterval=setInterval(updateStopwatch,1000);

}

function pauseStopwatch(){

clearInterval(stopwatchInterval);

stopwatchInterval=null;

}

function resetStopwatch(){

pauseStopwatch();

stopwatchSeconds=0;

document.getElementById("stopwatchDisplay").textContent="00:00:00";

}

let countdownInterval;

function countdown(){

return `
<input id="countdownSeconds" type="number" min="1" placeholder="Seconds">

<div class="buttons">
<button onclick="startCountdown()">Start Countdown</button>
<button onclick="stopCountdown()">Stop</button>
</div>

<div id="countdownResult" class="result">00:00</div>
`;

}

function startCountdown(){

let seconds=Number(
document.getElementById("countdownSeconds").value
);

if(seconds<=0)return;

clearInterval(countdownInterval);

updateCountdownDisplay(seconds);

countdownInterval=setInterval(()=>{

seconds--;

updateCountdownDisplay(seconds);

if(seconds<=0){

clearInterval(countdownInterval);

}

},1000);

}

function updateCountdownDisplay(seconds){

const m=Math.floor(seconds/60);

const s=seconds%60;

document.getElementById("countdownResult").textContent=
`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

function stopCountdown(){

clearInterval(countdownInterval);

}

document.getElementById("themeBtn").onclick=()=>{

document.body.classList.toggle("light");

};

document.getElementById("favBtn").onclick=()=>{

const favTools=tools.filter(t=>favorites.includes(t.id));

render(favTools);

};

render();
