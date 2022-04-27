"use strict";
//const API_KEY = process.env.API_KEY;
//import bubbleColor from "./modules/bubble_color.js";
// bubbleColor();
//import randomColorGenerator from "./modules/random_color";
const root = document.documentElement;

var isMobile = false; //initiate as false
// device detection
if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )
) {
  isMobile = true;
}

function windowWidth() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vwFactor = vw > 1700 ? 1700 / vw : 1;

  root.style.setProperty("--factor", vwFactor);
}
windowWidth();

window.addEventListener("resize", windowWidth);

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

const bubbleSettings = {
  score: false,
  bubbleCounter: 0,
  bubbleLevel: 0,
};

const body = document.querySelector("body");
const orangeToggle = document.querySelector("#orange-mode");

if (!isMobile) {
  body.addEventListener("mousedown", closeEyes);
  body.addEventListener("mouseup", openEyes);
  body.addEventListener("mousemove", eyeMove);
}

document.addEventListener("scroll", scrollingChanges);
document.querySelectorAll(".box").forEach((box) => box.addEventListener("click", callSection));

orangeToggle.addEventListener("click", () => {
  if (orangeToggle.checked) {
    root.style.setProperty("--body-color", " #2d2926");
    root.style.setProperty("--background-color", "#f2aa4c");
    root.style.setProperty("--background-gradient", "radial-gradient(circle, rgba(242, 170, 76, 1) 56%, rgba(163, 118, 59, 1) 100%)");
  } else {
    root.style.setProperty("--body-color", " #2d2926");
    root.style.setProperty("--background-color", "#fff");
    root.style.setProperty("--background-gradient", "#fff");
  }
});

function closeEyes() {
  document.querySelector("#eyes").classList.replace("active", "hide");
  document.querySelector("#close-eyes").classList.replace("hide", "active");
}

function openEyes() {
  document.querySelector("#close-eyes").classList.replace("active", "hide");
  document.querySelector("#eyes").classList.replace("hide", "active");
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
    const bubbleX = (container.getBoundingClientRect().width / 2) * 0.8;

    const durationNo = 10 * (Math.random() * 3) + 3;

    const t1 = gsap.timeline({ defaults: { delay: 0.2 * i }, onComplete: removeBubble, onCompleteParams: [`.bubble-${bubbleNumber}`] });
    t1.to(`.bubble-${bubbleNumber}`, { duration: durationNo, y: -1 * bubbleY, ease: "circ.out" });
    gsap.fromTo(`.bubble-${bubbleNumber}`, { x: -a * (Math.random() * 100) }, { duration: durationNo / 4, delay: 0.2 * i, ease: "slow(0.1, 0.4, true)", x: a * (Math.random() * bubbleX) });
    gsap.to(`.bubble-${bubbleNumber}`, { rotation: 360, duration: 4 + Math.random(), ease: "none", repeat: 10 });

    function explode(e) {
      if (!bubbleSettings.score) {
        bubbleSettings.score = true;
        document.getElementById("bubble-counter").style.opacity = "1";
      }
      bubbleSettings.bubbleCounter++;

      // bubbleColor(bubbleSettings.bubbleCounter);

      this.querySelectorAll(".bubble-part").forEach((part) => {
        if (!part.classList.contains("hide")) {
          part.classList.add("hide");
        } else {
          part.classList.remove("hide");
        }
        setTimeout(() => {
          t1.kill(`.bubble-${bubbleNumber}`);
          this.remove();
          document.querySelector("#score").textContent = bubbleSettings.bubbleCounter;
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

  if (activeSection.sandbox) {
    const imgFrame = document.querySelector(".svg-container-img");
    imgFrame.addEventListener("mousemove", eyeMove);

    function eyeMove(e) {
      const eyes = document.querySelectorAll(".eyeball_2");
      const fly = document.querySelector(".fly");
      const windowY = window.scrollY;
      let xFly = imgFrame.getBoundingClientRect().left;
      let yFly = imgFrame.getBoundingClientRect().top + windowY;
      let xPic = xFly + imgFrame.clientWidth / 2;
      let yPic = yFly + imgFrame.clientHeight / 3;
      let radianFly = Math.atan2(e.pageX - xPic, e.pageY - yPic);
      let rotationFly = radianFly * (180 / Math.PI) * -1 + 270;
      fly.style.transform = `translate(${e.pageX - xFly}px, ${e.pageY - yFly}px) rotate(${rotationFly + Math.floor(Math.random() * 10) + 90}deg)`;

      eyes.forEach((eye) => {
        let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
        let y = eye.getBoundingClientRect().top + windowY + eye.clientHeight / 2;
        let radian = Math.atan2(e.pageX - x, e.pageY - y);
        let rotation = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = `scale(1.1) rotate(${rotation}deg)`;
      });
    }
    setTimeout(() => {
      faderMachine(".sand-project");
    }, 1000);
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
      //"x-apikey": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.forEach((p, i, arr) => {
        displayProject(p);

        if (i + 1 === arr.length) {
          faderMachine(".project-card");
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
  projectName = projectName.split(" ");
  projectName = projectName.join("");
  if (projectName.includes("'")) {
    projectName = projectName.split("'");
    projectName = projectName.join("");
  }
  if (projectName.includes("ø")) {
    projectName = projectName.replace("ø", "o");
  }

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

function faderMachine(faderClass) {
  const faders = document.querySelectorAll(faderClass);

  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}
