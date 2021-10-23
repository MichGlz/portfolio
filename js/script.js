"use strict";

fetch("./assets/face2.svg")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    document.querySelector(".svg-container").innerHTML = data;
  });

let bubbleNumber = 0;
let lastScrollTop;
const body = document.querySelector("body");

body.addEventListener("mousedown", closeOpenEyes);
body.addEventListener("mouseup", closeOpenEyes);
body.addEventListener("mousemove", eyeMove);
document.addEventListener("scroll", scrollingChanges);

function closeOpenEyes() {
  document.querySelectorAll(".eyes").forEach((eye) => {
    if (eye.classList.contains("active")) {
      eye.classList.remove("active");
      eye.classList.add("hide");
    } else {
      eye.classList.add("active");
      eye.classList.remove("hide");
    }
  });
}

function eyeMove(e) {
  const eyes = document.querySelectorAll(".eyeball");
  eyes.forEach((eye) => {
    const windowY = window.scrollY;
    let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
    let y = eye.getBoundingClientRect().top + windowY + eye.clientHeight / 2;

    let radian = Math.atan2(e.pageX - x, e.pageY - y);
    let rotation = radian * (180 / Math.PI) * -1 + 270;
    eye.style.transform = `rotate(${rotation}deg)`;
  });
}

function scrollingChanges(e) {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const arrow = document.querySelector("#arrow");
  if (st > lastScrollTop) {
    document.querySelectorAll(".face").forEach((face) => {
      face.classList.remove("active");
      face.classList.add("hide");
    });
    document.querySelectorAll(".faceup").forEach((face) => {
      face.classList.add("active");
      face.classList.remove("hide");
    });
    if (document.querySelectorAll(".bubble-sprit").length < 20) {
      bubbleFactory();
    }

    arrow.style.backgroundImage = "url(./assets/arrow-up.svg)";
    arrow.href = "#header";
  } else {
    document.querySelectorAll(".face").forEach((face) => {
      face.classList.add("active");
      face.classList.remove("hide");
    });
    document.querySelectorAll(".faceup").forEach((face) => {
      face.classList.remove("active");
      face.classList.add("hide");
    });
    if (st < 20) {
      arrow.style.backgroundImage = "url(./assets/arrow-down.svg)";
      arrow.href = "#quote";
    }
  }
  lastScrollTop = window.pageYOffset;
}

function bubbleFactory() {
  const bubblesContainer = document.querySelector(".bubbles-container");

  for (let i = 1, a = 1; i <= 4; i++, a *= -1, bubbleNumber++) {
    const bubbleSprit = document.createElement("div");
    bubbleSprit.classList.add(`bubble-sprit`);
    bubbleSprit.classList.add(`bubble-${bubbleNumber}`);

    fetch("./assets/bubble.svg")
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        bubbleSprit.innerHTML = data;
      });

    bubbleSprit.addEventListener("mouseover", explode);
    bubblesContainer.appendChild(bubbleSprit);

    const bubbleY = bubblesContainer.getBoundingClientRect().height;
    const bubbleX = bubblesContainer.getBoundingClientRect().width / 2;

    const durationNo = 10 * (Math.random() * 3) + 3;

    const t1 = gsap.timeline({ defaults: { delay: 0.2 * i }, onComplete: removeBubble, onCompleteParams: [`.bubble-${bubbleNumber}`] });
    t1.to(`.bubble-${bubbleNumber}`, { duration: durationNo, y: -1 * bubbleY, ease: "circ.out" });
    gsap.fromTo(`.bubble-${bubbleNumber}`, { x: -a * (Math.random() * 100) }, { duration: durationNo / 4, delay: 0.2 * i, ease: "slow(0.1, 0.4, true)", x: a * (Math.random() * bubbleX) });
    gsap.to(`.bubble-${bubbleNumber}`, { rotation: 360, duration: 4 + Math.random(), ease: "none", repeat: 10 });

    function explode(e) {
      this.querySelectorAll(".bubble-part").forEach((part) => {
        if (!part.classList.contains("hide")) {
          part.classList.add("hide");
        } else {
          part.classList.remove("hide");
        }
        setTimeout(() => {
          t1.kill(`.bubble-${bubbleNumber}`);
          this.remove();
        }, 60);
      });
    }
  }
}

function removeBubble(bubble) {
  const theBubble = document.querySelector(bubble);
  theBubble.querySelectorAll(".bubble-part").forEach((part) => {
    if (!part.classList.contains("hide")) {
      part.classList.add("hide");
    } else {
      part.classList.remove("hide");
    }
    setTimeout(() => {
      theBubble.remove();
    }, 60);
  });
}
