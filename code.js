svgns = "http://www.w3.org/2000/svg";

playerCoords = [];
velocity_up = 0;
velocity_right = 0;

function buildPlatform(x, y, width, height) {
    platform = document.createElementNS(svgns, "rect");
    platform.style.fill = "rgb(0, 120, 0)";
    platform.setAttribute("width", width); platform.setAttribute("height", height);
    platform.setAttribute("x", x); platform.setAttribute("y", y);
    document.getElementById("gameframe").appendChild(platform);
    platform.setAttribute("class", "platform");
}

function levelInit(playerX, playerY, platformsMap) {
    document.getElementById("gameframe").style.backgroundColor = "deepskyblue";

    playerRect = document.createElementNS(svgns, "rect");
    playerRect.style.fill = "rgb(0, 20, 100)";
    playerRect.setAttribute("width", 50); playerRect.setAttribute("height", 50);
    playerCoords = [playerX, playerY];
    playerRect.setAttribute("x", playerX); playerRect.setAttribute("y", playerY);
    document.getElementById("gameframe").appendChild(playerRect);

    for (platform of platformsMap) {
        buildPlatform(platform.x, platform.y, platform.width, platform.height)
    }
}

function touching(rect1, rect2) {
    return !(
        ((parseFloat(rect1.getAttribute("y")) + parseFloat(rect1.getAttribute("height"))) < (parseFloat(rect2.getAttribute("y")))) ||
        (parseFloat(rect1.getAttribute("y")) > (parseFloat(rect2.getAttribute("y")) + parseFloat(rect2.getAttribute("height")))) ||
        ((parseFloat(rect1.getAttribute("x")) + parseFloat(rect1.getAttribute("width"))) < parseFloat(rect2.getAttribute("x"))) ||
        (parseFloat(rect1.getAttribute("x")) > (parseFloat(rect2.getAttribute("x")) + parseFloat(rect2.getAttribute("width"))))
    );
}

function touching_direction(rect1, rect2) {
    rect1_bottom = parseFloat(rect1.getAttribute("y")) + parseFloat(rect1.getAttribute("height"));
    rect2_bottom = parseFloat(rect2.getAttribute("y")) + parseFloat(rect2.getAttribute("height"));
    rect1_right = parseFloat(rect1.getAttribute("x")) + parseFloat(rect1.getAttribute("width"));
    rect2_right = parseFloat(rect2.getAttribute("x")) + parseFloat(rect2.getAttribute("width"));
    b_collision = rect1_bottom - parseFloat(rect2.getAttribute("y"));
    t_collision = rect2_bottom - parseFloat(rect1.getAttribute("y"));
    l_collision = rect1_right - parseFloat(rect2.getAttribute("x"));
    r_collision = rect2_right - parseFloat(rect1.getAttribute("x"));
    if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
        return "top";
    }
    if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
        return "bottom";
    }
    if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
        return "left";
    }
    if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
        return "right";
    }
}

function detect_platform_collisions() {
    out = {
        touching_top: false,
        touching_bottom: false,
        touching_left: false,
        touching_right: false
    };

    for (platform of document.getElementsByClassName("platform")) {
        if (touching(playerRect, platform)) {
            collision = touching_direction(playerRect, platform);
            if (collision == "left") {
                out.touching_left = true;
                playerCoords[0] = parseFloat(platform.getAttribute("x")) - parseFloat(playerRect.getAttribute("width"));
                velocity_right = 0;
            }
            else if (collision == "right") {
                out.touching_right = true;
                playerCoords[0] =  parseFloat(platform.getAttribute("x")) + parseFloat(platform.getAttribute("width"));
                velocity_right = 0;
            }
            else if (collision == "top") {
                out.touching_top = true;
                playerCoords[1] = parseFloat(platform.getAttribute("y")) + parseFloat(platform.getAttribute("height"));
            }
            else if (collision == "bottom") {
                out.touching_bottom = true;
                playerCoords[1] = parseFloat(platform.getAttribute("y")) - parseFloat(playerRect.getAttribute("height"));
            }
        }
    }

    return out;
}

map = {};

function load() {
    
    onkeydown = onkeyup = function(e){
        e = e || event;
        map[e.keyCode] = e.type == 'keydown';
    }

    collisions = detect_platform_collisions();

    if (collisions.touching_top) {
        velocity_up = -1;
    }
    
    if (!(collisions.touching_bottom)) {
        velocity_up = velocity_up - 0.5;
    }
    else {
        if (map[88] && !(collisions.touching_top)) {
            velocity_up = 8;
        }
        else {
            velocity_up = 0;
        }
    }
    
    if (map[39] && !(collisions.touching_left)) {
        velocity_right += 2;
    }
    
    if (map[37] && !(collisions.touching_right)) {
        velocity_right -= 2;
    }

    velocity_right *= 0.75;
    
    playerCoords[1] -= velocity_up;
    if (Math.abs(velocity_right) >= 0.5) {
        playerCoords[0] += velocity_right;
    }
    
    playerRect.setAttribute("x", playerCoords[0]); playerRect.setAttribute("y", playerCoords[1]);

    requestAnimationFrame(load);

}

levelInit(50, 50, [
    {x: 0, y: 430, width: 1000, height: 50},
    {x: 250, y: 380, width: 100, height: 50},
    {x: 400, y: 330, width: 100, height: 50},
    {x: 550, y: 280, width: 100, height: 50}
]);
load();