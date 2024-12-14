const dinoData = [
    { id: 1, name: "Allosaurus", species: "Allosaurus fragilis", era: "Late Jurassic", image: "assets/allosaurus.png" },
    { id: 2, name: "Ankylosaurus", species: "Ankylosaurus magniventris", era: "Late Cretaceous", image: "assets/ankylosaurus.png" },
    { id: 3, name: "Apatosaurus", species: "Apatosaurus louisae", era: "Late Jurassic", image: "assets/apatosaurus.png" },
    { id: 5, name: "Baryonyx", species: "Baryonyx walkeri", era: "Early Cretaceous", image: "assets/baryonyx.png" },
    { id: 6, name: "Becklespinax", species: "Becklespinax altispinax", era: "Early Cretaceous", image: "assets/becklespinax.png" },
    { id: 7, name: "Brachiosaurus", species: "Brachiosaurus altithorax", era: "Late Jurassic", image: "assets/brachiosaurus.png" },
    { id: 8, name: "Carnotaurus", species: "Carnotaurus sastrei", era: "Late Cretaceous", image: "assets/carnotaurus.png" },
    { id: 9, name: "Ceratosaurus", species: "Ceratosaurus nasicornis", era: "Late Jurassic", image: "assets/ceratosaurus.png" },
    { id: 12, name: "Dilophosaurus", species: "Dilophosaurus wetherilli", era: "Early Jurassic", image: "assets/dilophosaurus.png" },
    { id: 50, name: "Tyrannosaurus rex", species: "Tyrannosaurus rex", era: "Late Cretaceous", image: "assets/trex.png" },
    { id: 51, name: "Velociraptor", species: "Velociraptor mongoliensis", era: "Late Cretaceous", image: "assets/velociraptor.png" }
];

const dinoFunFacts = {
    "Allosaurus": "Allosaurus had a bite like a hatchet, slicing through flesh with its sharp teeth!",
    "Ankylosaurus": "Ankylosaurus had a club-like tail that it could swing as a powerful weapon!",
    "Apatosaurus": "Apatosaurus was once mistakenly called Brontosaurus due to a fossil mix-up!",
    "Baryonyx": "Baryonyx had a long, narrow snout and claws perfect for catching fish!",
    "Becklespinax": "Becklespinax is known only from a few vertebrae with unusually tall neural spines!",
    "Brachiosaurus": "Brachiosaurus could reach the tops of trees as tall as a five-story building!",
    "Carnotaurus": "Carnotaurus had tiny arms, even smaller than those of T. rex!",
    "Ceratosaurus": "Ceratosaurus had a prominent horn on its snout, giving it a unicorn-like appearance!",
    "Dilophosaurus": "Dilophosaurus had two thin crests on its head, possibly used for display!",
    "Tyrannosaurus rex": "T. rex had a bite force of up to 6,000 pounds, the strongest of any land animal ever!",
    "Velociraptor": "Velociraptor was actually much smaller than shown in Jurassic Park, about the size of a turkey!"
};

// Get DOM elements
const dinoContainer = document.getElementById('dino-container');
const infoPanel = document.getElementById('info-panel');
const dinoName = document.getElementById('dino-name');
const dinoSpecies = document.getElementById('dino-species');
const dinoEra = document.getElementById('dino-era');
const adoptionNameInput = document.getElementById('adoption-name');
const adoptButton = document.getElementById('adopt-button');
const closePanelButton = document.getElementById('close-panel');
const adoptedList = document.getElementById('adopted-list');
const soundToggle = document.getElementById('sound-toggle');

// Load adopted dinos from localStorage
let adoptedDinos = JSON.parse(localStorage.getItem('adoptedDinos')) || [];

// Sound effect
const dinoSound = new Audio('assets/dino-roar.mp3');
let isSoundEnabled = true;

// Function to generate random positions
function getRandomPositions(dinoCount, containerWidth, containerHeight) {
    const positions = [];
    const dinoSize = 150;
    const padding = 20;
    const headerHeight = 100; // Adjust this value based on your header height

    for (let i = 0; i < dinoCount; i++) {
        let newPos;
        let isOverlapping;
        let attempts = 0;

        do {
            newPos = {
                left: Math.random() * (containerWidth - dinoSize - padding * 2) + padding,
                top: Math.random() * (containerHeight - dinoSize - padding * 2 - headerHeight) + padding + headerHeight
            };

            isOverlapping = positions.some(pos => 
                Math.abs(newPos.left - pos.left) < dinoSize + padding &&
                Math.abs(newPos.top - pos.top) < dinoSize + padding
            );

            attempts++;

            if (attempts > 100) {
                console.log("Couldn't find non-overlapping position for dino " + i);
                break;
            }
        } while (isOverlapping);

        positions.push(newPos);
    }

    return positions;
}

// Function to render dinosaurs
function renderDinosaurs() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const positions = getRandomPositions(dinoData.length, containerWidth, containerHeight);

    dinoContainer.innerHTML = '';

    dinoData.forEach((dino, index) => {
        const dinoElement = document.createElement('img');
        dinoElement.src = dino.image;
        dinoElement.alt = dino.name;
        dinoElement.classList.add('dino');
        dinoElement.style.left = `${positions[index].left}px`;
        dinoElement.style.top = `${positions[index].top}px`;

        dinoElement.addEventListener('click', () => {
            if (isSoundEnabled) {
                dinoSound.play().catch(e => console.error("Error playing sound:", e));
            }

            dinoName.textContent = dino.name;
            dinoSpecies.textContent = `Species: ${dino.species}`;
            dinoEra.textContent = `Era: ${dino.era}`;
            
            // Add fun fact
            const funFactElement = document.getElementById('dino-fun-fact') || document.createElement('p');
            funFactElement.id = 'dino-fun-fact';
            funFactElement.classList.add('fun-fact');
            funFactElement.textContent = dinoFunFacts[dino.name] || "No fun fact available for this dinosaur.";
            if (!document.getElementById('dino-fun-fact')) {
                infoPanel.insertBefore(funFactElement, adoptionNameInput);
            }

            infoPanel.classList.remove('hidden');
            adoptionNameInput.value = '';

            window.currentDino = dino;
        });

        dinoContainer.appendChild(dinoElement);
    });
}

// Function to render adopted dinos
function renderAdoptedDinos() {
    adoptedList.innerHTML = ''; // Clear previous list

    adoptedDinos.forEach((dino, index) => {
        const li = document.createElement('li');
        li.textContent = `${dino.adoptedName} (${dino.name})`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = '✖';
        removeButton.addEventListener('click', () => {
            adoptedDinos.splice(index, 1);
            localStorage.setItem('adoptedDinos', JSON.stringify(adoptedDinos));
            renderAdoptedDinos();
        });

        li.appendChild(removeButton);
        adoptedList.appendChild(li);
    });
}

// Adopt button event listener
adoptButton.addEventListener('click', () => {
    const adoptedName = adoptionNameInput.value.trim();
    if (adoptedName && window.currentDino) {
        const newAdoptedDino = {
            ...window.currentDino,
            adoptedName: adoptedName
        };

        adoptedDinos.push(newAdoptedDino);
        localStorage.setItem('adoptedDinos', JSON.stringify(adoptedDinos));
        
        renderAdoptedDinos();
        infoPanel.classList.add('hidden');
        window.currentDino = null;
    }
});

// Close panel button event listener
closePanelButton.addEventListener('click', () => {
    infoPanel.classList.add('hidden');
});

// Sound toggle event listener
soundToggle.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggle.textContent = isSoundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-label', isSoundEnabled ? 'Mute sound' : 'Unmute sound');
});

// Initial render
renderDinosaurs();
renderAdoptedDinos();

// Rerender on window resize
window.addEventListener('resize', renderDinosaurs);

