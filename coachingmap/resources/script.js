const mbg = document.querySelector('.mbg');
const cont = document.querySelector('.map-cont');
const app = document.querySelector('.app');
const timer = document.querySelector('#time');

window.addEventListener('resize', adaptMapSize);
mbg.addEventListener('load', adaptMapSize)

function updateMapState(elem) {
	if (elem.id != null && elem.id != undefined) {
		let t2 = elem.id.replace('t1', 't2');
		if (elem.id.endsWith('t1') && cont.classList.contains(t2)) {
			cont.classList.remove(elem.id);
			cont.classList.remove(t2);
			return;
		} 
		let t1 = elem.id.replace('t2', 't1');
		if (elem.id.endsWith('t2') && !cont.classList.contains(elem.id)) {
			cont.classList.add(elem.id);
			cont.classList.add(t1);
			return;
		}
		cont.classList.toggle(elem.id)
	}
}

function adaptMapSize() {
	cont.width = mbg.width;
	cont.height = mbg.height;
	cont.style.width = mbg.width;
	cont.style.height = mbg.height;
}

function alignMarkers() {
	for (let c of document.getElementsByClassName("marker")) {
		let t = Number(c.style.top.replace('%',''))
		let l = Number(c.style.left.replace('%',''))
		c.style.top = Math.round(t*2)/2 + "%";
		c.style.left = Math.round(l*2)/2 + "%";
	}
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
	tpos = (elmnt.offsetTop - pos2);
	//if (tpos < 0) tpos = 0;
	lpos = (elmnt.offsetLeft - pos1);
	//if (lpos < 0) lpos = 0;
	
    elmnt.style.top = tpos;
    elmnt.style.left = lpos;
	elmnt.style.position = "absolute";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

var min2 = false;
var min7 = false;
var min9 = false;
function changeTime(diff) {
	let time = parseInt(cont.getAttribute('data-time'));
	if ((time + diff > 600) || (time + diff < 0)) return;
	time += diff;
	
	let m = Math.floor(time / 60);
	let s = time % 60;

	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;
	
	let v = m + ":" + s;
	
	timer.textContent = v;
	cont.setAttribute('data-time', time);
	
	if ((time <= 120 && !min2) || (time > 120 && min2)) {
		cont.classList.toggle('final')
		min2 = !min2;
	}
	if ((time <= 420 && !min7) || (time > 420 && min7)) {
		cont.classList.toggle('objective')
		min7 = !min7;
	}
	if ((time <= 570 && !min9) || (time > 570 && min9)) {
		cont.classList.toggle('initial')
		min9 = !min9;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	for (let c of document.getElementsByClassName("draggable-items")) {
		for (let e of c.children) {
			dragElement(e);
		}
	}
	let mir = document.querySelector('.mirrorbtn');
	// let fin = document.querySelector('.timerbtn');
	let res = document.querySelector('#resetbtn');
	let minus = document.querySelector('#dec-time');
	let plus = document.querySelector('#inc-time');
	
	minus.onclick = function() { changeTime(-10) }
	plus.onclick = function() { changeTime(+10) }
	
	// mir.onclick = function() {
	// 	mir.classList.toggle('toggled')
	// 	app.classList.toggle('mirror')
	// }
	res.onclick = function() {
		for (let c of document.getElementsByClassName("draggable-items")) {
			for (let e of c.children) {
				e.style.top = e.style.left = e.style.position = "";
			}
		}
		cont.setAttribute('data-time', "600");
		changeTime(0)
	}
	//window.history.pushState("404 Map", "404 Unite Coaching Map", "/");
	adaptMapSize()
});