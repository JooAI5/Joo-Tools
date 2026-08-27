(function(){

window.JooTools=window.JooTools||{};

window.JooTools.textDiff={

init(container){

container.innerHTML=`

<div class="jt-pro-tool">

<div class="jt-tool-head">
<div class="jt-tool-symbol">🔍</div>
<div>
<h2>Text Diff</h2>
<p>Compare two texts directly in your browser.</p>
</div>
</div>

<div class="jt-grid-2">

<label>
Original
<textarea id="jtDiffA" rows="12"
placeholder="Original text..."></textarea>
</label>

<label>
Modified
<textarea id="jtDiffB" rows="12"
placeholder="Modified text..."></textarea>
</label>

</div>

<div class="jt-actions">

<button id="jtDiffCompare" class="jt-primary">
🔍 Compare
</button>

<button id="jtDiffClear" class="jt-secondary">
🗑️ Clear
</button>

</div>

<pre id="jtDiffResult"
class="jt-result"></pre>

</div>
`;

const a=container.querySelector("#jtDiffA");
const b=container.querySelector("#jtDiffB");
const result=container.querySelector("#jtDiffResult");

container.querySelector("#jtDiffCompare")
.addEventListener("click",()=>{

const A=a.value.split(/\r?\n/);
const B=b.value.split(/\r?\n/);

const max=Math.max(A.length,B.length);

const output=[];

for(let i=0;i<max;i++){

const x=A[i]??"";
const y=B[i]??"";

if(x===y){

output.push(`  ${x}`);

}else{

if(x)output.push(`- ${x}`);
if(y)output.push(`+ ${y}`);

}

}

result.textContent=output.join("\n");

});

container.querySelector("#jtDiffClear")
.addEventListener("click",()=>{

a.value="";
b.value="";
result.textContent="";

});

}

};

})();
