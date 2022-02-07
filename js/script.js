"use strict";

fetch("./assets/face2.svg")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    document.querySelector(".svg-container").innerHTML = data;
  });

const urlParams = new URLSearchParams(window.location.search);

const sms = urlParams.get("sms");

let bubbleNumber = 0;
let lastScrollTop;

const activeSection = {
  about_me: false,
  projects: false,
  sandbox: false,
  contact: false,
};

const body = document.querySelector("body");

body.addEventListener("mousedown", closeOpenEyes);
body.addEventListener("mouseup", closeOpenEyes);
body.addEventListener("mousemove", eyeMove);
document.addEventListener("scroll", scrollingChanges);
document.querySelectorAll(".box").forEach((box) => box.addEventListener("click", callSection));

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
      const bubblesContainer = document.querySelector(".bubbles-container");
      bubbleFactory(bubblesContainer);
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

function bubbleFactory(container) {
  for (let i = 1, a = 1; i <= 4; i++, a *= -1, bubbleNumber++) {
    const bubbleSprit = document.createElement("div");
    bubbleSprit.classList.add(`bubble-sprit`);
    bubbleSprit.classList.add(`bubble-${bubbleNumber}`);

    fetch("./assets/bubble2.svg")
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        bubbleSprit.innerHTML = data;
      });

    bubbleSprit.addEventListener("mouseover", explode);
    container.appendChild(bubbleSprit);

    const bubbleY = container.getBoundingClientRect().height;
    const bubbleX = container.getBoundingClientRect().width / 2;

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
  if (theBubble) {
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
}

function callSection(e) {
  console.log("callSection");
  for (const [key, value] of Object.entries(activeSection)) {
    activeSection[key] = false;
  }
  const templateID = this.dataset.section;
  activeSection[templateID] = true;
  console.log(templateID);
  const template = document.querySelector("#" + templateID).content;

  const copy = template.cloneNode(true);

  const parent = document.querySelector(".sliding-sections-container");

  parent.appendChild(copy);

  if (activeSection.projects) {
    fetchProject();
  }

  const slidingSection = parent.querySelector(".sliding-section");
  const btnClose = parent.querySelector(".btn-close");

  setTimeout(() => {
    bubbleFactory(slidingSection);
  }, 1000);

  btnClose.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-close")) {
      slidingAnimation.reverse();
      slidingAnimation.onfinish = function () {
        document.querySelectorAll(".sliding-section .bubble-sprit").forEach((bubble) => {
          const animatedClass = bubble.classList[1];
          gsap.killTweensOf(`.${animatedClass}`);
        });

        slidingSection.remove();
      };
    }
  });

  const properties = {
    duration: 1000,
    // easing: "cubic-bezier(0.55, 0.17, 0.61, 1.45)",
    easing: "cubic-bezier(.45,.92,.26,1.19)",
    fill: "forwards",
  };

  const keyframes = [
    { transformOrigin: "center", transform: `translateY(-100%)`, opacity: 0.3 },
    {
      transformOrigin: "center",
      transform: `none`,
      opacity: 1,
    },
  ];

  const slidingAnimation = slidingSection.animate(keyframes, properties);
}

function fetchProject() {
  fetch("https://reicpe-9cc2.restdb.io/rest/projects", {
    method: "GET",
    headers: {
      "x-apikey": "606d5dcef5535004310074f4",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.forEach((p, i, arr) => {
        displayProject(p);

        if (i + 1 === arr.length) {
          faderMachine();
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function displayProject(project) {
  //grab the template
  const template = document.querySelector("#project-card-template").content;

  //clone
  const copy = template.cloneNode(true);
  //adjust stuff
  copy.querySelector(".project-title").textContent = project.name;
  copy.querySelector(".project-description").textContent = project.description;
  copy.querySelector(".web").href = project.link_web;
  copy.querySelector(".repo").href = project.link_github;

  copy.querySelector("img").src = imgGenerator(project.name);

  const parent = document.querySelector(".projects-container");

  parent.appendChild(copy);
}

function imgGenerator(projectName) {
  projectName = projectName.toLowerCase();
  const name = projectName.split(" ");
  projectName = name.join("");

  return `./assets/${projectName}.jpg`;
}

if (sms) {
  const modal = document.createElement("div");
  modal.classList.add("thanks");
  const message = document.createElement("h1");
  const content = document.createTextNode("Thank you! for your email");
  message.appendChild(content);
  modal.appendChild(message);
  const bubblesContainer = document.querySelector(".bubbles-container");
  bubblesContainer.appendChild(modal);
  for (let i = 0; i < 5; i++) {
    bubbleFactory(bubblesContainer);
  }
  setTimeout(() => {
    const modal = document.querySelector(".thanks");
    modal.addEventListener("animationend", () => {
      // Current URL: https://my-website.com/page_a
      const nextURL = "https://michgonzalez.com/";
      const nextTitle = "Mich Gonzalez";
      const nextState = { additionalInformation: "Updated the URL with JS" };

      // This will replace the current entry in the browser's history, without reloading
      window.history.replaceState(nextState, nextTitle, nextURL);

      modal.remove();
    });
    modal.classList.add("banish");
  }, 1500);
}

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -150px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
}, appearOptions);

function faderMachine() {
  const faders = document.querySelectorAll(".project-card");

  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}
