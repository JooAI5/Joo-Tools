(function(){

window.JooTools=window.JooTools||{};

window.JooTools.colorConverter={

init(container){

container.innerHTML=`

<div class="jt-pro-tool">

<div class="jt-tool-head">
<div class="jt-tool-symbol">🎨</div>
<div>
<h2>Color Converter</h2>
<p>Convert HEX colors to RGB and HSL.</p>
</div>
</div>

<label>
HEX
<input id="jtHex"
value="#5865F2"
placeholder="#RRGGBB">
</label>

<div class="jt-grid-2">

<label>
RGB
<input id="jtRgb" readonly>
</label>

<label>
HSL
<input id="jtHsl" readonly>
</label>

</div>

<div id="jtColorPreview"
style="
height:140px;
border-radius:18px;
margin-top:16px;
border:1px solid rgba(255,255,255,.1);
"></div>

</div>
`;

const hex=container.querySelector("#jtHex");
const rgb=container.querySelector("#jtRgb");
const hsl=container.querySelector("#jtHsl");
const preview=container.querySelector("#jtColorPreview");

function update(){

let value=hex.value.trim().replace("#","");

if(!/^[0-9a-fA-F]{6}$/.test(value)){

rgb.value="";
hsl.value="";
return;

}

const r=parseInt(value.slice(0,2),16);
const g=parseInt(value.slice(2,4),16);
const b=parseInt(value.slice(4,6),16);

rgb.value=`rgb(${r}, ${g}, ${b})`;

const rn=r/255;
const gn=g/255;
const bn=b/255;

const max=Math.max(rn,gn,bn);
const min=Math.min(rn,gn,bn);

let h=0;
let s=0;

const l=(max+min)/2;

if(max!==min){

const d=max-min;

s=l>0.5
?d/(2-max-min)
:d/(max+min);

switch(max){

case rn:
h=(gn-bn)/d+(gn<bn?6:0);
break;

case gn:
h=(bn-rn)/d+2;
break;

case bn:
h=(rn-gn)/d+4;
break;

}

h/=6;

}

hsl.value=
`hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;

preview.style.backgroundColor="#"+value;

}

hex.addEventListener("input",update);

update();

}

};

})();
