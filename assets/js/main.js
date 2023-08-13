//capturing DOM elements
const btn = document.querySelector('.btn')
const controls = document.querySelector('.controls')
const toggleMode = document.querySelector('.mode-btn')
const nameMode = document.querySelector('.toggle-mode')
const icon = document.querySelector('.icon-mode')
const main = document.querySelector('main')
const lastScore = document.querySelector('.last-score')
const maxScore = document.querySelector('.max-score')
const game = document.querySelector('.game')
const scoreDiv = document.querySelector('.score')
const title = document.querySelector('h1')

//creating context for canvas
const ctx = game.getContext('2d')

//assigning number of squares
const gridSize = 20

//creating initial snake and food locations
let snake = [{x: 2, y: 2},{x: 3, y: 2}]
let food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)}

//creating initial game status
let speed = 200
let direction = 'right'
let score = 0
let updateGame, bgSound

//creating initial touch events
let touchStartX, touchStartY, touchEndX, touchEndY

//setting color mode in localStorage
const colorMode = (() =>{
    if(localStorage.getItem('color-mode') == 'dark'){
        main.classList.add('darkmode')
        nameMode.value = 'dark'
        icon.textContent == 'dark_mode'
    }else if(localStorage.getItem('color-mode') == 'light'){
        main.classList.remove('darkmode')
        nameMode.value = 'light'
        icon.textContent == 'light_mode'
    }
})()

//creating a toggle button event for color mode
toggleMode.addEventListener('click',()=>{
    main.classList.toggle('darkmode')
    nameMode.value == 'dark' ? nameMode.value = 'light' : nameMode.value = 'dark'
    icon.textContent == 'dark_mode' ? icon.textContent = 'light_mode' : icon.textContent = 'dark_mode'
    localStorage.setItem('color-mode', nameMode.value)
})

//creating the start event
btn.addEventListener('click',() => {
    game.style.display = 'block'
    btn.style.display = 'none'
    controls.style.display = 'none'
    play()
    createBackgroundSound()
    updateGame = setInterval(play,speed)
})

//core funtion
const play = () =>{
    snakeMove(direction)
    checkColisionWithYourself()
    checkColisionWithWall()
    checkColisionWithFood()
    
    ctx.clearRect(0, 0, game.width, game.height)

    drawSnake()
    drawFood()
}

const checkColisionWithFood = () => {
    if(snake[snake.length-1].x == food.x && snake[snake.length-1].y == food.y){
        score++
        createPickFoodSound()
        snake.push(food)
        food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)}
    }
} 

const checkColisionWithWall = () =>{
    if(snake[snake.length-1].x == -1 || snake[snake.length-1].y == -1 ||
       snake[snake.length-1].x == gridSize || snake[snake.length-1].y == gridSize) gameOver()
}

const checkColisionWithYourself = () =>{
    snake.slice(0, -1 ).forEach(part =>{
        if(snake[snake.length -1].x == part.x && snake[snake.length -1].y == part.y) gameOver()
    })
}

const drawFood = () => {
    ctx.fillStyle = 'red'
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
}

const drawSnake = () => {
    for(const part in snake){
        if(part == snake.length -1 ) ctx.fillStyle = '#7FFF00'
        else if(part % 2 == 0) ctx.fillStyle = '#32CD32'
        else if(part % 2 != 0) ctx.fillStyle = '#008000'
        ctx.fillRect(snake[part].x * gridSize, snake[part].y * gridSize, gridSize, gridSize)
    }
}

const snakeMove = (direction) =>{
    const head = {x: snake[snake.length-1].x, y: snake[snake.length-1].y}

        switch (direction){
            case 'right':
                head.x++
                snake.push(head)
                break
            case 'bottom':
                head.y++
                snake.push(head)
                break
            case 'left':
                head.x--
                snake.push(head)
                break
            case 'top':
                head.y--
                snake.push(head)
                break
        }
        snake.shift()
}

const createPickFoodSound = () =>{
    const sound = new Audio('./assets/sound/pick-apple.mp3')
    sound.play()
    sound.volume = .4
}

const createBackgroundSound = () =>{
    bgSound = new Audio('./assets/sound/bgSound.ogg')
    bgSound.play()
    bgSound.loop = true
    bgSound.volume = .3
}

//event of controls
document.addEventListener('keydown', (event)=>{
    if((direction == 'right' && event.key === 'ArrowLeft') ||
       (direction == 'top' && event.key === 'ArrowDown') ||
       (direction == 'left' && event.key === 'ArrowRight') ||
       (direction == 'bottom' && event.key === 'ArrowUp')
    ) event.preventDefault()

    else if(event.key === 'ArrowUp')direction = 'top'
    else if(event.key === 'ArrowRight')direction = 'right'
    else if(event.key === 'ArrowDown')direction = 'bottom'
    else if(event.key === 'ArrowLeft')direction = 'left'
    else return
})


//events touch for mobile devices
const buttonDirection = (oppositeWay, way) =>{
    if(direction == oppositeWay) return
    else direction = way
}

game.addEventListener('touchstart', (e) =>{
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
})

game.addEventListener('touchmove', (e)=>{
    if(!touchStartX || !touchStartY) return

    touchEndX = e.touches[0].clientX
    touchEndY = e.touches[0].clientY

    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if(deltaX > 0) buttonDirection('left', 'right')
        else buttonDirection('right', 'left')
    }else{
        if(deltaY > 0) buttonDirection('top', 'bottom')
        else buttonDirection('bottom', 'top')
    }

    touchStartX = null
    touchStartY = null
})

const gameOver = () => {
    clearInterval(updateGame)
    bgSound.pause()
    game.style.display = 'none'

    localStorage.setItem('last-score', score)
    if(+localStorage.getItem('max-score') < score){
        localStorage.setItem('max-score', score)
    }
    lastScore.innerText = localStorage.getItem('last-score')
    maxScore.innerText = localStorage.getItem('max-score')

    const restart = document.createElement('button')
    restart.innerText = 'Restart'
    restart.classList.add('restart')
    restart.addEventListener('click', ()=>{
        location.reload()
    })
    main.appendChild(restart)
}

const formatedScore = (value) =>{
    return value < 10 ? `00${value}` : value < 100 ? `0${value}` : value
}

//setting the scores in html
lastScore.innerText = formatedScore(+localStorage.getItem('last-score'))
maxScore.innerText = formatedScore(+localStorage.getItem('max-score'))

