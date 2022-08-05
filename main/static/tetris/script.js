localStorage.setItem('prevUrl', window.location.href)

var firstClick = false
var music = []
var musicIndex = Math.round(Math.random() * 4)
var musicPlay

var music1 = new Audio()
music1.src = 'https://vgmsite.com/soundtracks/tetris-gameboy-rip/cxwvsxuo/tetris-gameboy-01.mp3'
music.push(music1)

var music2 = new Audio()
music2.src = 'https://vgmsite.com/soundtracks/tetris-gameboy-rip/mpkrawiu/tetris-gameboy-02.mp3'
music.push(music2)

var music3 = new Audio()
music3.src = 'https://vgmsite.com/soundtracks/tetris-gameboy-rip/vhbuvhmc/tetris-gameboy-03.mp3'
music.push(music3)

var music4 = new Audio()
music4.src = 'https://vgmsite.com/soundtracks/tetris-gameboy-rip/ppfavyru/tetris-gameboy-04.mp3'
music.push(music4)

var music5 = new Audio()
music5.src = 'https://vgmsite.com/soundtracks/tetris-gameboy-rip/xsfbcllh/tetris-gameboy-05.mp3'
music.push(music5)

const canv = document.querySelector('.tetris')
const ctx = canv.getContext('2d')
const pieces = 'ILJOTSZ'

var pause = true
var nextPiece = ''

var merged = false
var lastY
var aiMode = false

var fall = setInterval(() => {}, 50)
var isFalling = false

const arenaSettings = document.querySelector('.arenaSettings').innerText.split(' ')
var arenaWidth = parseInt(arenaSettings[0])
var arenaHeight = parseInt(arenaSettings[1])

var cubeSize = 0.9
var cellSize = cubeSize / 0.9

const Alert = document.querySelector('.alert')
const innerScore = document.querySelector('.inner-score')
const gameOver = document.querySelector('.game-over')
const gameOverText = document.querySelector('.game-over-text')
const bg = document.querySelector('.bg')
const Settings = document.querySelector('.settings')

const nextFigure = document.querySelector('.next-figure')
const innerNextFigure = document.querySelector('.inner-next-figure')

function changeMatrix() {
    canv.height = window.innerHeight * 0.981
    canv.width = canv.height * (arenaWidth / arenaHeight)

    canv.style.height = canv.height
    canv.style.width = canv.width

    const canvWidth = canv.width
    ctx.scale(canv.width / arenaWidth, canv.height / arenaHeight)

    if (window.innerWidth >= window.innerHeight * 0.9) {
        document.querySelector('.tetris').style.transform = 'translateX(calc(-13.72vh))'
        document.querySelector('.inner-score').style.transform = 'translate(-38.52vh, 0.9vh)'
        document.querySelector('.inner-next-figure').style.visibility = 'visible'
    }

    else {
        document.querySelector('.tetris').style.transform = 'translateX(0)'
        document.querySelector('.inner-score').style.transform = 'translate(-24.7vh, 0.9vh)'
        document.querySelector('.inner-next-figure').style.visibility = 'hidden'
    }

    if (window.innerWidth < canvWidth) {
        innerScore.style.transform = 'translateX(calc(-50vw + 5vh))'
        innerScore.style.boxShadow = '0 0 2vh rgba(0, 0, 0, .5)'
    }

    else {
        innerScore.style.boxShadow = 'none'
    }

    if (window.innerWidth <= window.innerHeight * 0.6)
        innerScore.style.transform = `translateX(calc(-50vw + 4.9vh))`

    else {
        if (window.innerWidth >= window.innerHeight * 0.9)
            innerScore.style.transform = 'translate(-38.52vh, 0.9vh)'
        else
            innerScore.style.transform = 'translate(-24.7vh, 0.9vh)'
    }

    if (arenaWidth / arenaHeight != 0.6) {
        innerScore.style.transform = `translateX(calc(-50vw + 4.9vh))`
        innerScore.style.boxShadow = '0 0 2vh rgba(0, 0, 0, .5)'
        nextFigure.style.transform = `translateX(42.86vw)`
        innerNextFigure.style.borderRadius = '0 0 0 1vh'
    }
}
changeMatrix()

function restart() {
    Alert.style.opacity = '0'
    Alert.style.zIndex = '2'
    Settings.style.display = 'none'
    gameOver.style.opacity = '0'
    bg.style.zIndex = '-1'

    pause = false
    update()
}

function arenaSweep(rowCount) {
    outer: for (let y = arenaHeight - 1; y > 0; y--) {
        for (let x = 1; x < arena[arenaHeight - 1].length; x++) {
            if (arena[y][x] == 0) {
                continue outer
            }
        }

        arena[y] = []
        for (var i = 0; i < arenaWidth; i++) {
            arena[y].push(0)
        }

        for (var row = y; row > 0; row--) {
            [arena[row], arena[row - 1]] = [arena[row - 1], arena[row]]
        }

        player.score += rowCount
        rowCount *= 2
        arenaSweep(rowCount)
    }
}

function collide(arena, player) {
    const [m, p] = [player.matrix, player.pos]
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] != 0 &&
                (arena[y + p.y] &&
                arena[y + p.y][x + p.x]) != 0) {
                    return true
                }
        }
    }
    return false
}

function createMatrix(w, h) {
    const matrix = []

    while (h--) {
        matrix.push(new Array(w).fill(0))
    }
    return matrix
}

function createPiece(type) {
    if (type == 'T') {
        return  [
                    [0, 0, 0, 0],
                    [1, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'O') {
        return  [
                    [0, 0, 0, 0],
                    [0, 2, 2, 0],
                    [0, 2, 2, 0],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'L') {
        return  [
                    [0, 0, 0, 0],
                    [0, 0, 0, 3],
                    [0, 3, 3, 3],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'J') {
        return  [
                    [0, 0, 0, 0],
                    [4, 0, 0, 0],
                    [4, 4, 4, 0],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'I') {
        return  [
                    [0, 0, 0, 0],
                    [5, 5, 5, 5],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'S') {
        return  [
                    [0, 0, 0, 0],
                    [0, 6, 6, 0],
                    [6, 6, 0, 0],
                    [0, 0, 0, 0]
                ]
    }

    else if (type == 'Z') {
        return  [
                    [0, 0, 0, 0],
                    [7, 7, 0, 0],
                    [0, 7, 7, 0],
                    [0, 0, 0, 0]
                ]
    }
}

function draw() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canv.width, canv.height)

    drawMatrix(arena, {x: 0, y: 0})
    drawMatrix(player.matrix, player.pos)
}

function drawMatrix(matrix, offset, isDropping = true) {
    for (var i = 0; i < 1; i++) {
        if (!player.matrix[0][0] && !player.matrix[1][0] && !player.matrix[2][0] && !player.matrix[3][0]) {
            player.matrix[0].shift()
            player.matrix[1].shift()
            player.matrix[2].shift()
            player.matrix[3].shift()

            player.matrix[0].push(0)
            player.matrix[1].push(0)
            player.matrix[2].push(0)
            player.matrix[3].push(0)
        }
    }

    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                if (isDropping) {
                    ctx.fillStyle = colors[value]
                }
                else {
                    ctx.fillStyle = '#090909'
                }

                ctx.fillRect( (x + offset.x) * cellSize,
                                (y + offset.y) * cellSize,
                                cubeSize, cubeSize)

                if (isDropping) {
                    ctx.strokeStyle = strokes[value]
                }
                else {
                    ctx.strokeStyle = '#151515'
                }

                ctx.lineWidth = 0.1 * cellSize
                ctx.strokeRect( (x + offset.x) * cellSize,
                                (y + offset.y) * cellSize,
                                cubeSize, cubeSize)
            }
        })
    })
}

function merge(arena, player) {
    merged = true
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                arena[y + player.pos.y][x + player.pos.x] = value
            }
        })
    })
}

function playerDrop(quantity, isDropping = true) {
    for (var drop = 0; drop < quantity; drop++) {
        player.pos.y++

        if (collide(arena, player)) {
            player.pos.y--
            if (!isDropping) {
                if (!isFalling) {
                    drawMatrix(player.matrix, player.pos, false)
                }

                player.pos.y = lastY
                return
            }
            merge(arena, player)
            
            playerReset()
            arenaSweep(1)
            break
        }

        if (isDropping) {
            dropCounter = 0
        }
    }
}

function playerMove(dirs) {
    if (dirs > 0) {
        for (dir = 0; dir < dirs; dir++) {
            player.pos.x++

            if (
                collide(arena, player) || (
                    player.pos.x <= 12 / arenaWidth &&
                    player.pos.y <= 20 / arenaHeight
                )
            ) {
                player.pos.x--
            }
        }
    }

    else {
        for (dir = 0; dir > dirs; dir--) {
            player.pos.x--
            if (collide(arena, player))
                player.pos.x++
        }
    }
}

function playerReset(maxScore = false) {
    if (!nextPiece) {
        player.matrix = createPiece(pieces[Math.round(6 * Math.random())])
    }

    else {
        player.matrix = nextPiece
    }

    nextPiece = createPiece(pieces[Math.round(6 * Math.random())])
    var
        value = 0
        cell = 0
    var cubes = document.querySelector('.cubes')
    for (var row = 0; row < 4; row++) {
        for (var Cell = 0; Cell < 4; Cell++) {
            value = nextPiece[row][Cell]
            cell = cubes.querySelectorAll('.row')[row].querySelectorAll('.cell')[Cell].querySelector('.cell-content')

            cell.style.backgroundColor = '#000'
            cell.style.border = '#000'

            if (value != 0) {
                cell.style.backgroundColor = colors[value]
                cell.style.border = '0.5vh solid ' + strokes[value]
            }
        }
    }

    var row = [nextPiece[1], nextPiece[2]]
    var margin = 0

    for (var Cell = 0; Cell < 4; Cell++) {
        if (row[0][Cell] == 0 && row[1][Cell] == 0 && Cell <= 1) {
            margin -= 2.5
        }

        else if (row[0][Cell] == 0 && row[1][Cell] == 0 && Cell >= 2) {
            margin += 2.5
        }
    }

    cubes = document.querySelector('.cubes')
    cubes.style.transform = `translateX(${margin}vh)`

    player.pos.y = 0
    player.pos.x = (arena[0].length / 2 | 0) -
                    (player.matrix[0].length / 2 | 0)

    if (collide(arena, player) || maxScore) {
        arena.forEach(row => row.fill(0))
        player.score = 0

        Settings.style.display = 'flex'
        gameOver.style.opacity = '.8'
        bg.style.zIndex = '1'
        pause = true
    }
}

function playerRotate(dir) {
    const pos = player.pos.x
    let offset = 1
    rotate(player.matrix, dir)

    while (collide(arena, player)) {
        player.pos.x += offset
        offset = -(offset + (offset > 0 ? 1 : -1))

        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir)
            player.pos.x = pos
            return
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ]
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse())
    }
    else {
        matrix.reverse()
    }
}

function musicPlaying(index) {
    music[index].play()
}

let dropCounter = 0
let lastTime = 0
let dropInterval

function update(time = 0) {
    dropInterval = 400 - player.score
    if (player.score >= 300) {
        dropInterval = 100
    }
    if (player.score >= 1000) {
        playerReset(true)
    }

    updateScore()
    draw()

    lastY = player.pos.y
    playerDrop(25, false)
    drawMatrix(player.matrix, player.pos)

    const deltaTime = time - lastTime
    lastTime = time

    dropCounter += deltaTime
    if (dropCounter > dropInterval) {
        playerDrop(1)
        lastY = player.pos.y + 1
    }

    if (!pause) {
        document.querySelector('.pause').style.backgroundColor = 'transparent'
        canv.style.border = '1vh solid #333'
        innerScore.style.backgroundColor = '#333'
        innerNextFigure.style.border = '1vh solid #333'
        requestAnimationFrame(update)
    }

    else {
        document.querySelector('.pause').style.backgroundColor = 'rgba(0, 0, 0, .3)'
        canv.style.border = '1vh solid #222'
        innerScore.style.backgroundColor = '#222'
        innerNextFigure.style.border = '1vh solid #222'
    }
}

function updateScore() {
    innerScore.innerText = player.score
}

function falling() {
    isFalling = true

    playerDrop(1)
    if (merged) {
        merged = false
        isFalling = false
        clearInterval(fall)
    }
}

const colors = [
    null,
    '#ff0d72',
    '#0dc2ff',
    '#0dff72',
    '#f538ff',
    '#ff8e0d',
    '#ffe138',
    '#3877ff'
]

const strokes = [
    null,
    '#d11261',
    '#12a9db',
    '#0fd361',
    '#cf2fd8',
    '#dc7c0e',
    '#d3ba2f',
    '#2f64d5'

]

var arena = createMatrix(arenaWidth, arenaHeight)
var player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
}

document.addEventListener('keydown', e => {
    if (!firstClick) {
        musicPlay = setInterval(musicPlaying(musicIndex), 50)
        firstClick = true
    }

    if (!pause && !isFalling) {
        if (e.keyCode == 37 || e.keyCode == 65) {
            playerMove(-1)
        }

        else if (e.keyCode == 39 || e.keyCode == 68) {
            playerMove(1)
        }

        else if (e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 83) {
            clearInterval(fall)
            fall = setInterval(falling, 50)
        }

        else if (e.keyCode == 81) {
            playerRotate(-1)
        }

        else if (e.keyCode == 87) {
            playerRotate(1)
        }
    }

    if (e.keyCode == 80) {
        if (!pause) {
            pause = true
            music[musicIndex].volume = 0
        }

        else {
            pause = false
            musicIndex = Math.round(Math.random() * 4)
            music[musicIndex].volume = 1
            musicPlay = setInterval(musicPlaying(musicIndex), 50)
            update()
        }
    }
})

var move
function moveSwipe(event) {
    if (!pause && !isFalling) {
        var touch = event.touches[0].clientX
        touch = touch - (window.innerWidth / 2 - canv.width / 2)
        move = Math.round(touch / (canv.width / arenaWidth))

        if (collide(arena, player)) {
            move = player.pos.x
        }

        playerMove(move - player.pos.x)
    }
}

function musicEnded(index) {
    music[index].volume = 0
    clearInterval(musicPlay)

    musicIndex = Math.round(Math.random() * 4)
    music[musicIndex].volume = 1
    musicPlay = setInterval(musicPlaying(musicIndex), 50)
}

music[0].addEventListener('ended', () => {
    if (music[0].volume != 0) {
        musicEnded(0)
    }
})

music[1].addEventListener('ended', () => {
    if (music[1].volume != 0) {
        musicEnded(1)
    }
})

music[2].addEventListener('ended', () => {
    if (music[2].volume != 0) {
        musicEnded(2)
    }
})

music[3].addEventListener('ended', () => {
    if (music[3].volume != 0) {
        musicEnded(3)
    }
})

music[4].addEventListener('ended', () => {
    if (music[4].volume != 0) {
        musicEnded(4)
    }
})

document.addEventListener('mousedown', function(e) {
    if (!firstClick) {
        musicPlay = setInterval(musicPlaying(musicIndex), 50)
        firstClick = true
    }

    if (!pause && !isFalling) {
        if (
            window.innerHeight * 0.01 + player.pos.y * (canv.height / arenaHeight)
                <= e.clientY &&
                
            e.clientY
                <= window.innerHeight * 0.01 + player.pos.y * (canv.height / arenaHeight) + canv.height / arenaHeight * 4 &&
            

            (window.innerWidth / 2 - canv.width / 2) + window.innerHeight * 0.01 + player.pos.x * (canv.width / arenaWidth)
                <= e.clientX &&
                
            e.clientX
                <= (window.innerWidth / 2 - canv.width / 2) + window.innerHeight * 0.01 + player.pos.x * (canv.width / arenaWidth) + canv.width / arenaWidth * 4
        ) {
            playerRotate(1)
        }

        else if (
            window.innerHeight * 0.01 + player.pos.y * (canv.height / arenaHeight) + canv.height / arenaHeight * 8
                <= e.clientY
        ) {
            clearInterval(fall)
            fall = setInterval(falling, 50)
        }
    }
})

window.addEventListener('resize', () => {
    changeMatrix()
})

playerReset()
updateScore()
update()
