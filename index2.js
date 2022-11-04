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
    }

    Draw(){
        ctx.beginPath()
        ctx.fillStyle = this.c
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.closePath()
    }

    Animate() {
        if (this.y + this.height < canvas.height) {
            this.dy += gravity
            this.grounded = false
        }
        else {
            this.dy = 0
            this.grounded = true
            this.y = canvas.height - this.height
        }
        this.y += this.dy
        this.Draw()
    }
}

function Start(){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.font = "20px sans-serif"

    gameSpeed = 3
    gravity = 1
    score = 0
    highscore = 0

    dino = new Dino(25, 0, 50, 50, "pink")
    requestAnimationFrame(Update)
}

function Update(){
    requestAnimationFrame(Update)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dino.Animate()
}

Start()