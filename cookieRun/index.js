const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const apiKey = 'https://api.openweathermap.org/data/2.5/weather?lat=37.54281347234269&lon=126.96677338393458&appid=5625569fc712a015c07bce5391e7e74a&units=metric'

let score,
    scoreText,
    comboText,
    highscore,
    highscoreText,
    cookie,
    gravity,
    obstacles = [],
    jellies = [],
    gameSpeed,
    keys = {},
    background,
    bonusTime,
    combo,
    hp,
    hpCount

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
        this.jumpForce = 15
        this.originalHeight = h
        this.grounded = false
        this.jumpTimer = 0
    }

    Draw() {
        let img = new Image()

        if (!this.grounded) {   
            img.src = 'cookie_jump.png'
        }
        else if (keys['KeyF'] && this.grounded) {   
            img.src = 'cookie_slide.png'
        }
        else {
            img.src = 'cookie_basic.png'
        }

        ctx.drawImage(img, this.x, this.y, this.w, this.h)
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
    constructor (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.dx = -gameSpeed
    }

    Draw() {
        let img = new Image()
        img.src = 'frog.png'
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }

    Update() {
        this.x += this.dx
        this.Draw()
        this.dx = -gameSpeed
    }
}

class Jelly {
    constructor (x, y, w, h, isTouched) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.isTouched = isTouched

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

class Text {
    constructor (t, x, y, a, c, s) {
      this.t = t
      this.x = x
      this.y = y
      this.a = a
      this.c = c
      this.s = s
    }
  
    Draw () {
      ctx.beginPath()
      ctx.fillStyle = this.c
      ctx.font = this.s + "px sans-serif"
      ctx.textAlign = this.a
      ctx.fillText(this.t, this.x, this.y)
      ctx.closePath()
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
    if (hpCount == 50) {
        jelly.img = 'mul.png'
        hpCount = 0
    }
  
    if (type == 1) {
        jelly.y -= cookie.originalHeight + 200
    }
    else if (type == 2) {
        jelly.y -= cookie.originalHeight + 30
    }
    jellies.push(jelly)
    hpCount += 1
}

const SpawnObstacle = () => {
    size = 70
    let type = RandomIntInRange(0, 1)

    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size)

    if (type == 1) {
        obstacle.y -= cookie.originalHeight - 10
    }
    obstacles.push(obstacle)
    console.log(obstacles)
}

const RandomIntInRange = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
  }
  

const Start = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  
    ctx.font = "20px sans-serif"
  
    gameSpeed = 0.5
    gravity = 1

    score = 0
    highscore = 0
    combo = 0

    hpCount = 0
    hp = 100

    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore')
    }

    scoreText = new Text("현재 점수: " + score, 35, 50, "left", "white", "35")
    comboText = new Text("콤보: " + combo, 35, 80, "left", "white", "20")
    highscoreText = new Text("최고 점수: " + highscore, canvas.width - 35, 50, "right", "white", "35")

    cookie = new Cookie(25, canvas.height-150, 80, 80)

    requestAnimationFrame(Update)
}

let initialSpawnTimer = 1
let spawnTimer = initialSpawnTimer

let O_initialSpawnTimer = 1
let O_spawnTimer = O_initialSpawnTimer

const init = () => {
    jellies = []
    obstacles = []
    gameSpeed = 5
    score = 0
    combo = 0
    spawnTimer = initialSpawnTimer
    O_spawnTimer = O_initialSpawnTimer
}

const Update = () => {
    requestAnimationFrame(Update)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cookie.Animate()

    spawnTimer --
    O_spawnTimer --

    if (spawnTimer <= 0) {
        SpawnJelly()
        spawnTimer = initialSpawnTimer - gameSpeed * 8
        
        if (spawnTimer < 30) {
            spawnTimer = 30
        }
    }

    if (O_spawnTimer <= 0) {
        SpawnObstacle()
        O_spawnTimer = O_initialSpawnTimer - gameSpeed * 8
        
        if (O_spawnTimer < 320) {
            O_spawnTimer = 320
        }
    }

    for (let i = 0; i < obstacles.length; i ++) {
        let o_obstacle = obstacles[i]
        o_obstacle.isTouched = false

        if (o_obstacle.x + o_obstacle.w < 0) {
            obstacles.splice(i, 1)
        }
        if (
            cookie.x < o_obstacle.x + o_obstacle.w &&
            cookie.x + cookie.w > o_obstacle.x &&
            cookie.y < o_obstacle.y + o_obstacle.h &&
            cookie.y + cookie.h > o_obstacle.y
            ) {
                location.reload()
        }

        o_obstacle.Update()
    }

    for (let i = 0; i < jellies.length; i ++) {
        let o = jellies[i]

        if (o.x + o.w < 0) {
            jellies.splice(i, 1)
            if (!o.isTouched) {
                combo = 0
                console.log(combo, score)
            }
        }
        if ((
            cookie.x < o.x + o.w &&
            cookie.x + cookie.w > o.x &&
            cookie.y < o.y + o.h &&
            cookie.y + cookie.h > o.y
            ) && (o.isTouched == false)) {
                jellies.splice(i, 1)
                combo += 1
                score += (17 + (2 * (combo + 1)))
                isTouched = true
        }

        o.Update()
    }

    let result = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    scoreText.t = "현재 점수: " + result
    comboText.t = "콤보: " + combo
    scoreText.Draw()
    comboText.Draw()

    if (score > highscore) {
        highscore = score
        highscoreText.t = "최고 점수!"
      }
      else {
        highscoreText.t = "최고 점수: " + highscore
      }
    
      highscoreText.Draw()

    gameSpeed += 0.007
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