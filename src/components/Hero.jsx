import React, { useEffect, useRef } from "react";

const sections = [
  {
    id: "name-section",
    text: "Goldy Thundiyil Joseph",
    type: "heading",
  },
  {
    id: "about-me-section",
    text: [
      "About Me",
      "Mr.Gold | W0LF1E",
      "Cyber Security Researcher | Red Teamer",
      "Hello! I’m Goldy. I'm an Indian guy who can be an artist, teacher, chef, singer and dancer when the mood strikes.",
      "Researching Malware Development & Red Teaming",
      "Hack The Box <3",
    ],
    type: "paragraphs",
  },
];

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
const animationSpeed = 100;

function animateText(element, targetText) {
  let currentText = Array(targetText.length).fill("_");
  let animationIndex = 0;

  function changeCharacter() {
    let done = true;
    currentText = currentText.map((char, idx) => {
      if (idx < animationIndex) return targetText[idx];
      done = false;
      return characters.charAt(Math.floor(Math.random() * characters.length));
    });

    element.textContent = currentText.join("");

    if (done) return;
    setTimeout(changeCharacter, animationSpeed);
  }

  changeCharacter();
  setTimeout(() => {
    animationIndex = targetText.length;
  }, animationSpeed * targetText.length);
}

export default function Hero() {
  const nameRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) {
      animateText(nameRef.current, sections[0].text);
    }

    if (aboutRef.current) {
      sections[1].text.forEach((line, i) => {
        setTimeout(() => {
          const p = document.createElement("p");
          p.className = "text-lg text-gray-300 mb-2";
          aboutRef.current.appendChild(p);
          animateText(p, line);
        }, 1500 * i);
      });
    }
  }, []);

  return (
    <section className="min-h-screen bg-black flex flex-col justify-center items-center p-6 relative">
      <div ref={nameRef} className="mb-4 text-center text-4xl font-bold text-yellow-400" />
      <div ref={aboutRef} className="max-w-2xl text-center" />
      <canvas id="bg-cube" className="absolute top-0 left-0 w-full h-full -z-10" />
    </section>
  );
}
