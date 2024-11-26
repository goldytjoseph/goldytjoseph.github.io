// Define the sections with their respective text
const sections = [
    {
        id: 'name-section',
        text: "Goldy Thundiyil Joseph", // Name section (Main title)
        type: 'heading', // Indicates this is a heading (animate once and settle)
    },
    {
        id: 'about-me-section',
        text: [
            "About Me", // Subtitle (About Me)
            "Mr.Gold | W0LF1E",
            "Hello! I’m Goldy. I'm an Indian guy who can be an artist, teacher, chef, singer and, dancer when the mood strikes me.",
            "Linux, Cyber Security and, networking are my interests.",
            "I'm much CLI tied and, good at crafting utility scripts using Bash and Python.",
            "Lust for learning and curiosity made me self-taught.",
            "Mainly I focus on professional development and personal growth, so chasing learning curves and continuous self-improvement are equally important to me."
        ], // About me section as an array of individual sentences
        type: 'paragraphs', // Indicates this is multiple paragraphs to animate
    }
];

// Character pool for animation
const characters = "ABCDEFGHIJKLMकखगघजझञटठNOPQRSTUV我你他她它的了在是有为和上个大国子这人中学生去做会不WXYZabcdअआइईउऊऋॠऌॡएऐओऔअंअःडढषत्रज्ञefghijklmnoАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯабвгдеё私はあなたに彼女それのために大きжзийклмнопрстуфхцчшщыэюяpqrstuvwxyz1234567890١٢٣٤٥٦٧٨٩ءآأؤإئابةتثجحخدذرزسشصضطظعغـفقكلمنهوىي"; 
const animationSpeed = 100; // Speed of random character cycling (ms)
const settleSpeed = 50; // Speed of settling on the correct character (ms)

// Function to animate any given text element
function animateText(element, targetText, isParagraph) {
    let currentText = Array(targetText.length).fill('_'); // Start with underscores
    let animationIndex = 0; // Pointer to track position in the text

    // Function to change character
    function changeCharacter() {
        let done = true;

        // Map each character position to random chars until it matches the final text
        currentText = currentText.map((char, idx) => {
            if (idx < animationIndex) return targetText[idx]; // Lock correct characters
            done = false; // As long as not all characters are locked, continue animation
            return characters.charAt(Math.floor(Math.random() * characters.length));
        });

        element.textContent = currentText.join(""); // Update the text content in the element

        if (done) {
            // If all characters are locked, finish the animation
            return;
        }

        setTimeout(changeCharacter, animationSpeed); // Continue random cycling
    }

    // Start the animation
    changeCharacter();

    // After some time, start settling to correct letters
    setTimeout(() => {
        animationIndex = targetText.length; // After cycling random letters, settle on the correct ones
    }, animationSpeed * targetText.length);
}

// Function to handle the animation for all text sections
function animateAllTextSections() {
    sections.forEach((section, index) => {
        const container = document.querySelector(`#${section.id}`);
        
        if (section.type === 'heading') {
            // For headings, just animate the text once
            const headingElement = document.createElement('h1');
            container.appendChild(headingElement);
            animateText(headingElement, section.text, false);
        } else if (section.type === 'paragraphs') {
            // For paragraphs, animate each sentence separately
            const paragraphsContainer = document.createElement('div');
            container.appendChild(paragraphsContainer);

            section.text.forEach((sentence, idx) => {
                let p = document.createElement('p');
                paragraphsContainer.appendChild(p);

                setTimeout(() => {
                    animateText(p, sentence, true);
                }, 1500 * idx); // Delay each sentence by 1500ms
            });
        }
    });
}

// Start animation once the page is loaded
document.addEventListener('DOMContentLoaded', animateAllTextSections);
