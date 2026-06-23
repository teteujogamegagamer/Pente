const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.75;

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const fontSize = document.getElementById("fontSize");

const brushTool = document.getElementById("brushTool");
const eraserTool = document.getElementById("eraserTool");
const textTool = document.getElementById("textTool");
const imageTool = document.getElementById("imageTool");
const saveTool = document.getElementById("saveTool");
const clearBtn = document.getElementById("clearBtn");

const imageInput = document.getElementById("imageInput");

let currentTool = "brush";
let drawing = false;

let undoStack = [];
let redoStack = [];

saveState();

function saveState(){

undoStack.push(canvas.toDataURL());

if(undoStack.length > 50){
undoStack.shift();
}
}

function restoreState(data){

const img = new Image();

img.src = data;

img.onload = () => {

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(
img,
0,
0,
canvas.width,
canvas.height
);

};
}

brushTool.onclick = () => {
currentTool = "brush";
};

eraserTool.onclick = () => {
currentTool = "eraser";
};

textTool.onclick = () => {
currentTool = "text";
};

imageTool.onclick = () => {
imageInput.click();
};

canvas.addEventListener("mousedown", e => {

if(currentTool !== "brush" &&
currentTool !== "eraser")
return;

drawing = true;

ctx.beginPath();

ctx.moveTo(
e.offsetX,
e.offsetY
);

});

canvas.addEventListener("mousemove", e => {

if(!drawing) return;

ctx.lineWidth =
brushSize.value;

ctx.lineCap = "round";
ctx.lineJoin = "round";

if(currentTool === "eraser"){
ctx.strokeStyle = "#FFFFFF";
}
else{
ctx.strokeStyle =
colorPicker.value;
}

ctx.lineTo(
e.offsetX,
e.offsetY
);

ctx.stroke();

});

canvas.addEventListener("mouseup", () => {

if(!drawing) return;

drawing = false;

ctx.beginPath();

saveState();

redoStack = [];

});

canvas.addEventListener("mouseleave", () => {

drawing = false;

ctx.beginPath();

});

canvas.addEventListener("click", e => {

if(currentTool !== "text")
return;

const texto =
prompt("Digite o texto");

if(!texto) return;

ctx.font =
fontSize.value + "px Arial";

ctx.fillStyle =
colorPicker.value;

ctx.fillText(
texto,
e.offsetX,
e.offsetY
);

saveState();

});

imageInput.addEventListener("change", e => {

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload = event => {

const img =
new Image();

img.onload = () => {

ctx.drawImage(
img,
100,
100,
300,
300
);

saveState();

};

img.src =
event.target.result;

};

reader.readAsDataURL(file);

});

saveTool.onclick = () => {

const link =
document.createElement("a");

link.download =
"desenho.png";

link.href =
canvas.toDataURL(
"image/png"
);

link.click();

};

clearBtn.onclick = () => {

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

saveState();

};

document.addEventListener(
"keydown",
e => {

if(
e.ctrlKey &&
e.key === "z"
){

e.preventDefault();

if(
undoStack.length > 1
){

redoStack.push(
undoStack.pop()
);

restoreState(
undoStack[
undoStack.length - 1
]
);

}

}

if(
e.ctrlKey &&
e.key === "y"
){

e.preventDefault();

if(
redoStack.length > 0
){

const state =
redoStack.pop();

undoStack.push(
state
);

restoreState(
state
);

}

}

});