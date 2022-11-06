const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const apiKey = 'https://api.openweathermap.org/data/2.5/weather?lat=37.54281347234269&lon=126.96677338393458&appid=5625569fc712a015c07bce5391e7e74a&units=metric'

let score
let scoreText
let highscore
let highscoreText
let cookie
let gravity
let obstacles = []
let jellies = []
let gameSpeed
let keys = {}
let background
let bonusTime

document.addEventListener('keydown', (evt) => {
    keys[evt.code] = true
})

document.addEventListener('keyup', (evt) => {
    keys[evt.code] = false
})


class Cookie {
    constructor (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.dy = 0
        this.jumpForce = 10
        this.originalHeight = h
        this.grounded = false
        this.jumpTimer = 0
    }

    Draw() {
        let img = new Image()

        if (keys['KeyJ'] && this.grounded) {   
            img.src = 'cookie_jump.png'
            ctx.drawImage(img, this.x, this.y, this.w, this.h)
        }
        else if (keys['KeyF'] && this.grounded) {   
            img.src = 'cookie_slide.png'
            ctx.drawImage(img, this.x, this.y, this.w, this.h)
        }
        else {
            img.src = 'cookie_basic.png'
            ctx.drawImage(img, this.x, this.y, this.w, this.h)
        }
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) { 
            this.jumpTimer = 1
            this.dy = -this.jumpForce
        }
        else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer ++
            this.dy = -this.jumpForce - (this.jumpTimer / 50)
        }
    }

    Animate() {
        if (keys['KeyJ']) {
            this.Jump()
        }
        else {
            this.jumpTimer = 0
        }
    
        if (keys['KeyF'] && this.grounded) {
            this.y += this.h / 2
            this.h = this.originalHeight / 2
        }
        else {
            this.h = this.originalHeight
        }
    
        this.y += this.dy

        if (this.y + this.h < canvas.height) { 
          this.dy += gravity
          this.grounded = false
        }
        else {
          this.dy = 0
          this.grounded = true
          this.y = canvas.height - this.h
        }

        this.Draw()
    }
}

class Obstacle {
    
}

class Jelly {
    constructor (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.dx = -gameSpeed
        this.isBird = false
    }

    Draw() {
        let img = new Image()
        img.src = 'jelly.png'
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }

    Update() {
        this.x += this.dx
        this.Draw()
        this.dx = -gameSpeed
    }
}

const SpawnJelly = () => {
    let size = RandomIntInRange(1, 100)
    if (size == 1) {
        size = 80
    }
    else {
        size = 30
    }
    let type = RandomIntInRange(0, 2)
    let jelly = new Jelly(canvas.width + size, canvas.height - size, size, size)
  
    if (type == 1) {
        jelly.y -= cookie.originalHeight + 85
    }
    else if (type == 2) {
        jelly.y -= cookie.originalHeight + 15
    }
    jellies.push(jelly)
}

const RandomIntInRange = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
  }
  

const Start = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  
    ctx.font = "20px sans-serif"
  
    gameSpeed = 3
    gravity = 1

    cookie = new Cookie(25, canvas.height-150, 100, 100)

    requestAnimationFrame(Update)
}

let initialSpawnTimer = 1
let spawnTimer = initialSpawnTimer

const init = () => {
    jellies = []
    gameSpeed = 3

    spawnTimer = initialSpawnTimer
}

const Update = () => {
    requestAnimationFrame(Update)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cookie.Animate()

    console.log(jellies)

    spawnTimer --

    if (spawnTimer <= 0) {
        SpawnJelly()
        spawnTimer = initialSpawnTimer - gameSpeed * 8
        
        if (spawnTimer < 30) {
        spawnTimer = 30
        }
    }

    for (let i = 0; i < jellies.length; i ++) {
        let o = jellies[i]

        if (o.x + o.w < 0) {
            jellies.splice(i, 1)
        }
        if (
            cookie.x < o.x + o.w &&
            cookie.x + cookie.w > o.x &&
            cookie.y < o.y + o.h &&
            cookie.y + cookie.h > o.y
            ) {
            o.w = 0
            o.h = 0
            score += 1
            console.log(score)
        }

        o.Update()
    }

    gameSpeed += 0.001;
}

const getJson = (url, callback) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
        const status = xhr.status
        if (status == 200) {
            callback(null, xhr.response)
        }
        else {
            callback(status, xhr.response)
        }
    }
    xhr.send()
}

getJson(apiKey, (err, data) => {
    if (err, data) {
        if (err !== null) {
            alert("오류")
        }
        else {
            if (data.main.temp > 15) {
                background = 'orange'
            }
            else {
                background = 'skyblue'
            }
        }
    }
})

Start()