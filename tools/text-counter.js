(function(){

window.JooTools=window.JooTools||{};

window.JooTools.textCounter={

init(container){

container.innerHTML=`

<div class="jt-pro-tool">

<div class="jt-tool-head">
<div class="jt-tool-symbol">📝</div>
<div>
<h2>Word & Character Counter</h2>
<p>Analyze your text instantly.</p>
</div>
</div>

<textarea id="jtCounterText"
rows="12"
placeholder="Write or paste your text here..."></textarea>

<div class="image-stats">

<div>
<span>Words</span>
<strong id="jtWords">0</strong>
</div>

<div>
<span>Characters</span>
<strong id="jtChars">0</strong>
</div>

<div>
<span>Characters no spaces</span>
<strong id="jtCharsNoSpace">0</strong>
</div>

<div>
<span>Lines</span>
<strong id="jtLines">0</strong>
</div>

</div>

<div class="jt-actions">

<button id="jtCounterClear"
class="jt-secondary">
🗑️ Clear
</button>

</div>

</div>
`;

const input=container.querySelector("#jtCounterText");

function update(){

const value=input.value;

const words=value.trim()
?value.trim().split(/\s+/).length
:0;

container.querySelector("#jtWords")
.textContent=words;

container.querySelector("#jtChars")
.textContent=value.length;

container.querySelector("#jtCharsNoSpace")
.textContent=value.replace(/\s/g,"").length;

container.querySelector("#jtLines")
.textContent=value
?value.split(/\r?\n/).length
:0;

}

input.addEventListener("input",update);

container.querySelector("#jtCounterClear")
.addEventListener("click",()=>{

input.value="";
update();
input.focus();

});

}

};

})();
