const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let score,
    scoreText,
    highscore,
    highscoreText,
    dino,
    gravity,
    obstacles = [],
    gameSpeed,
    keys = {}

document.addEventListener("keydown", function(event){
    keys[event.code] = true
})


document.addEventListener("keyup", function(event){
    keys[event.code] = false
})

class Text {
    constructor(text, x, y, align, color, size) {
        this.text = text
        this.x = x
        this.y = y
        this.align = align
        this.color = color
        this.size = size
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.font = this.size + "px sans-serif"
        ctx.textAlign = this.align
        ctx.fillText(this.text, this.x, this.y)
    }
}

class Obstacle {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color

        this.dx = -gameSpeed
    }

    Update() {
        this.x += this.dx
        this.Draw()
        this.dx = -gameSpeed
    }

    Draw() {
        var img = new Image()
        img.src = "/catus.png"
        ctx.drawImage(img, this.x, this.y, this.width, this.height)
        ctx.closePath()
    }
}

class Dino{
    constructor(x, y, width, height, color){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color

        this.dy = 0
        this.jumpForce = 15
        this.originalHeight = height
        this.grounded = false
        this.jumpTimer = 0
    }

    Draw(){
        var img = new Image()
        img.src = "/dino_up.png"
        ctx.drawImage(img, this.x, this.y, this.width, this.height)
        ctx.closePath()
    }

    Animate() {
        if(keys['Space'] || keys['keyW']) {
            this.Jump()
        }
        else {
            this.jumpTimer = 0
        }

        if ((keys['ShiftLeft'] || keys['keyS']) && this.grounded == true) {
            this.height = this.originalHeight / 2
        }
        else {
            this.height = this.originalHeight
        }

        this.y += this.dy

        if (this.y + this.height < canvas.height) {
            this.dy += gravity
            this.grounded = false
        }
        else {
            this.dy = 0
            this.grounded = true
            this.y = canvas.height - this.height
        }
        this.Draw()
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1
            this.dy = -this.jumpForce
        }
        else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++
            this.dy = -this.jumpForce - (this.jumpTimer / 50)
        }
    }
}

function SpawnObstacle() {
    let size = randomIntInRange(20, 70)
    let type = randomIntInRange(0, 1)
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, "#2484E4")

    if (type == 1) {
        obstacle.y -= dino.originalHeight - 10
    } 
    obstacles.push(obstacle)
    console.log(obstacles)
}

function randomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function Start(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.font = "20px sans-serif"

    gameSpeed = 3
    gravity = 1
    score = 0
    highscore = 0

    dino = new Dino(25, 25, 50, 50, "pink")
    scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20px sans-serif")
    requestAnimationFrame(Update)
}

let initialSpawnTimer = 200
let spawnTimer = initialSpawnTimer

function Update(){
    requestAnimationFrame(Update)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dino.Animate()

    spawnTimer --
    if (spawnTimer <= 0) {
        SpawnObstacle()
        console.log(obstacles)
        spawnTimer = initialSpawnTimer - gameSpeed * 8

        if (spawnTimer < 60) {
            spawnTimer = 60
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i]
        o.Update()
    }

    score ++
    scoreText.text  = "Score: " + score
    scoreText.draw()
    
    gameSpeed += 0.005
}

Start() 