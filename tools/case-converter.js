(function(){

window.JooTools=window.JooTools||{};

window.JooTools.caseConverter={

init(container){

container.innerHTML=`

<div class="jt-pro-tool">

<div class="jt-tool-head">
<div class="jt-tool-symbol">🔤</div>
<div>
<h2>Case Converter</h2>
<p>Transform text capitalization instantly.</p>
</div>
</div>

<textarea id="jtCaseText"
rows="12"
placeholder="Enter your text..."></textarea>

<div class="jt-actions">

<button data-case="upper" class="jt-primary">
UPPERCASE
</button>

<button data-case="lower" class="jt-secondary">
lowercase
</button>

<button data-case="title" class="jt-secondary">
Title Case
</button>

<button data-case="sentence" class="jt-secondary">
Sentence case
</button>

<button data-case="clear" class="jt-secondary">
🗑️ Clear
</button>

</div>

</div>
`;

const input=container.querySelector("#jtCaseText");

container.querySelectorAll("[data-case]")
.forEach(button=>{

button.addEventListener("click",()=>{

const type=button.dataset.case;

if(type==="upper")
input.value=input.value.toUpperCase();

if(type==="lower")
input.value=input.value.toLowerCase();

if(type==="title")
input.value=input.value
.toLowerCase()
.replace(/\b\w/g,c=>c.toUpperCase());

if(type==="sentence")
input.value=input.value
.toLowerCase()
.replace(/(^\s*\w|[.!?]\s+\w)/g,
m=>m.toUpperCase());

if(type==="clear")
input.value="";

});

});

}

};

})();
