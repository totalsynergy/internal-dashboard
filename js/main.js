chrome.power.requestKeepAwake('display');

//Global Variable to access page names
var pages = [
  {"name" : "Totaltest Synergy Gravatar", "isSelected" : false},
  {"name" : "Total SynergyGram", "isSelected" : false},
  {"name" : "Conference Total Attendees", "isSelected" : true},
  {"name" : "Conference Attendee Map", "isSelected" : true},
  {"name" : "Conference CountDown", "isSelected" : true},
  {"name" : "Help Desk Calls Categories", "isSelected" : false},
  {"name" : "Help Desk Call Response Time", "isSelected" : false},
  {"name" : "Help Desk Test Page", "isSelected" : false},
  {"name" : "Help Desk Top Callers", "isSelected" : false},
  {"name" : "Help Desk Time To Close Calls", "isSelected" : false},
  {"name" : "Development Trello Cards", "isSelected" : false},
  {"name" : "Yammer", "isSelected" : false},
  {"name" : "Twitter", "isSelected" : true},
  {"name" : "Synergy 4 Cloud Users", "isSelected" : false},
  {"name" : "Synergy 4 Intern PieChart", "isSelected" : false},
  {"name" : "Synergy 4 Desktop Version Graph", "isSelected" : true},
  {"name" : "Synergy 4 Client Aus Map", "isSelected" : false},
  {"name" : "Synergy 4 World Map", "isSelected" : false},
  {"name" : "Synergy 4 PlaceHolder 1", "isSelected" : false},
  {"name" : "Synergy 4 PlaceHolder 2", "isSelected" : false},
  {"name" : "Synergy 4 Promotors", "isSelected" : false},
  {"name" : "Synergy 4 Passive", "isSelected" : false},
  {"name" : "Synergy 4 DetractorsY", "isSelected" : false},
  {"name" : "Synergy 5 Trial vs Active", "isSelected" : false},
  {"name" : "Synergy 5 Timeline", "isSelected" : false},
  {"name" : "Synergy 5 Client Count", "isSelected" : false},
  {"name" : "Synergy 5 World Map", "isSelected" : false},
  {"name" : "Synergy 5 Subscribers", "isSelected" : false},
  {"name" : "Synergy 5 Staff Distribution", "isSelected" : false},
  {"name" : "Synergy 5 Average Client Life", "isSelected" : false},
  {"name" : "Joke of The Day", "isSelected" : false},
  {"name" : "Leaderboard", "isSelected" : false},
  {"name" : "Marketing Values 1", "isSelected" : false},
  {"name" : "Marketing Values 2", "isSelected" : false},
  {"name" : "Total Synergy Structure", "isSelected" : false},
  {"name" : "Bom Radar", "isSelected" : false},
  {"name" : "Synergy 5 Gravatars", "isSelected" : false}
];
    
    
function runConfetti() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    //snowflake particles
    var mp = 100; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * W, //x-coordinate
            y: Math.random() * H, //y-coordinate
            r: Math.random() * 8 + 1, //radius
            d: Math.random() * mp, //density
            color: "rgba(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", 0.8)"
        })
    }

    //Lets draw the flakes
    function draw() {
        ctx.clearRect(0, 0, W, H);



        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            ctx.fill();
        }

        update();
    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;

    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > W + 5 || p.x < -5 || p.y > H) {
                if (i % 3 > 0) //66.67% of the flakes
                {
                    particles[i] = {
                        x: Math.random() * W,
                        y: -10,
                        r: p.r,
                        d: p.d,
                        color: p.color
                    };
                } else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = {
                            x: -5,
                            y: Math.random() * H,
                            r: p.r,
                            d: p.d,
                            color: p.color
                        };
                    } else {
                        //Enter from the right
                        particles[i] = {
                            x: W + 5,
                            y: Math.random() * H,
                            r: p.r,
                            d: p.d,
                            color: p.color
                        };
                    }
                }
            }
        }
    }

    //animation loop
    setInterval(draw, 33);
}
