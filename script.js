const pump = document.getElementById('pump');
const gameContainer = document.getElementById('game-container');
const balloonCount = document.getElementById('balloon-count');

let activeBalloons = 0;
const maxSize = 120;
const minSize = 60;

// Balloon properties
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Event listeners
pump.addEventListener('click', createBalloon);
pump.addEventListener('touchend', createBalloon);

function createBalloon(e) {
    e.preventDefault();
    
    // Create balloon element
    const balloon = document.createElement('div');
    balloon.className = 'balloon inflate-animation';
    
    // Random properties
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    
    balloon.classList.add(randomColor);
    
    // Position at pump nozzle
    const startX = gameContainer.offsetWidth / 2;
    const startY = gameContainer.offsetHeight - 150;
    
    balloon.style.left = `${startX}px`;
    balloon.style.top = `${startY}px`;
    balloon.style.width = `${minSize}px`;
    balloon.style.height = `${minSize * 1.3}px`;
    
    // Add to game container
    gameContainer.appendChild(balloon);
    
    // Add letter
    const letter = document.createElement('div');
    letter.className = 'balloon-letter';
    letter.textContent = randomLetter;
    balloon.appendChild(letter);
    
    // Add string
    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);
    
    // Inflate animation
    inflateBalloon(balloon);
}

function inflateBalloon(balloon) {
    let currentSize = minSize;
    
    const inflateInterval = setInterval(() => {
        currentSize += 2;
        balloon.style.width = `${currentSize}px`;
        balloon.style.height = `${currentSize * 1.3}px`;
        
        if (currentSize >= maxSize) {
            clearInterval(inflateInterval);
            balloon.classList.remove('inflate-animation');
            startFloating(balloon);
        }
    }, 30);
}

function startFloating(balloon) {
    activeBalloons++;
    updateBalloonCount();
    
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    const balloonWidth = parseInt(balloon.style.width);
    const balloonHeight = parseInt(balloon.style.height);
    
    let x = containerWidth / 2;
    let y = containerHeight - 100;
    
    // Increased initial speed (from 3 to 5)
    let xSpeed = (Math.random() - 0.5) * 5; // Increased from 3 to 5
    let ySpeed = (Math.random() - 0.5) * 5; // Increased from 3 to 5
    
    // Set minimum speed (increased from 0.5 to 0.8)
    if (Math.abs(xSpeed) < 0.8) xSpeed = xSpeed < 0 ? -0.8 : 0.8;
    if (Math.abs(ySpeed) < 0.8) ySpeed = ySpeed < 0 ? -0.8 : 0.8;
    
    balloon.addEventListener('click', () => popBalloon(balloon));
    balloon.addEventListener('touchend', (e) => {
        e.preventDefault();
        popBalloon(balloon);
    });
    
    const floatInterval = setInterval(() => {
        x += xSpeed;
        y += ySpeed;
        
        // Boundary checks with bounce
        if (x <= balloonWidth/2 || x >= containerWidth - balloonWidth/2) {
            xSpeed *= -0.8;
            x = Math.max(balloonWidth/2, Math.min(x, containerWidth - balloonWidth/2));
        }
        
        if (y <= balloonHeight/2 || y >= containerHeight - balloonHeight/2) {
            ySpeed *= -0.8;
            y = Math.max(balloonHeight/2, Math.min(y, containerHeight - balloonHeight/2));
        }
        
        // Increased randomness (from 0.1 to 0.2)
        xSpeed += (Math.random() - 0.5) * 0.2; // Increased from 0.1 to 0.2
        ySpeed += (Math.random() - 0.5) * 0.2; // Increased from 0.1 to 0.2
        
        balloon.style.left = `${x}px`;
        balloon.style.top = `${y}px`;
        
        balloon.floatInterval = floatInterval;
    }, 25); // Reduced interval from 30ms to 25ms for smoother fast movement
}


function popBalloon(balloon) {
    // Create pop effect
    const pop = document.createElement('div');
    pop.className = 'pop-effect';
    pop.style.left = balloon.style.left;
    pop.style.top = balloon.style.top;
    gameContainer.appendChild(pop);
    
    // Remove balloon
    clearInterval(balloon.floatInterval);
    balloon.remove();
    activeBalloons--;
    updateBalloonCount();
    
    // Remove pop effect
    setTimeout(() => pop.remove(), 500);
}

function updateBalloonCount() {
    balloonCount.textContent = `Balloons: ${activeBalloons}`;
    balloonCount.style.display = activeBalloons > 0 ? 'block' : 'none';
}

// Handle window resize
window.addEventListener('resize', () => {
    const balloons = document.querySelectorAll('.balloon');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    
    balloons.forEach(balloon => {
        if (balloon.floatInterval) {
            let x = parseInt(balloon.style.left);
            let y = parseInt(balloon.style.top);
            const balloonWidth = parseInt(balloon.style.width);
            const balloonHeight = parseInt(balloon.style.height);
            
            x = Math.max(balloonWidth/2, Math.min(x, containerWidth - balloonWidth/2));
            y = Math.max(balloonHeight/2, Math.min(y, containerHeight - balloonHeight/2));
            
            balloon.style.left = `${x}px`;
            balloon.style.top = `${y}px`;
        }
    });
});