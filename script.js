const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;


//get mouse postion
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
};

window.addEventListener('mousemove',
    function(event)
    {

        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// creation de l'objet particle
class Particle 
{
    constructor(x, y, directionX, directionY, taille, color)
    {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.taille = taille;
        this.color = color;
    }

    draw()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00C502';
        ctx.fill();
    }

    update()
    {
        if (this.x > canvas.width || this.x < 0)
        {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0)
        {
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.taille)
        {
            if (mouse.x < this.x && this.x < canvas.width - this.taille * 10)
            {
               this.x += 10;  
            }
            if (mouse.x > this.x && this.x > this.taille * 10)
            {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.taille * 10)
            {
               this.y += 10;  
            }
            if (mouse.y > this.y && this.y > this.taille * 10)
            {
                this.y -= 10;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle
        this.draw();
    }
}

// creation d'un tableau de particle
function init()
{
    particlesArray = [];
    let nombreDeParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < nombreDeParticles; i++)
    {
        let taille = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - taille * 2) - (taille * 2)) + taille * 2);
        let y = (Math.random() * ((innerHeight - taille * 2) - (taille * 2)) + taille * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#2EAD24';

        particlesArray.push(new Particle(x, y, directionX, directionY, taille, color));
    }
}

//connection entre les particles
function connect()
{
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++)
    {
        for (let b = a; b < particlesArray.length; b++)
        {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7))
            {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(130,226,11,'+ opacityValue + ')';
                ctx.lineWidht = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate()
{
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++)
    {
        particlesArray[i].update();
    }
    connect();
}

// redimension
window.addEventListener('resize',
    function()
    {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

window.addEventListener('mouseout',
    function()
    {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();