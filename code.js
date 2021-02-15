svgns = "http://www.w3.org/2000/svg";

playerCoords = [];
velocity_up = 0;
velocity_right = 0;

// PATH TO POLYGON: https://betravis.github.io/shape-tools/path-to-polygon/
function levelInit(playerX, playerY, PolygonString) {
    document.getElementById("gameframe").style.backgroundColor = "deepskyblue";

    scrollelems = document.createElementNS(svgns, "g");
    document.getElementById("gameframe").appendChild(scrollelems);

    playerRect = document.createElementNS(svgns, "rect");
    playerRect.style.fill = "rgb(0, 20, 100)";
    playerRect.setAttribute("width", 50); playerRect.setAttribute("height", 50);
    playerCoords = [playerX, playerY];
    playerRect.setAttribute("x", playerX); playerRect.setAttribute("y", playerY);
    scrollelems.appendChild(playerRect);

    groundPolygon = document.createElementNS(svgns, "polygon");
    groundPolygon.setAttribute("points", PolygonString);
    groundPolygon.style.fill = "rgb(0, 120, 0)";
    scrollelems.appendChild(groundPolygon);
}

function parsePolygon(polygon_elem) {
    var points = polygon_elem.getAttribute("points").split(",");
    var out = [];
    for (unparsed of points) {
        out.push({x: parseFloat(unparsed.trim().split(" ")[0]), y: parseFloat(unparsed.trim().split(" ")[1])});
    }
    return out;
}

function touching_rect_polygon(rect, polygon) {
    var rectPoints = [
        {x: parseFloat(rect.getAttribute("x")), y: parseFloat(rect.getAttribute("y"))},
        {x: parseFloat(rect.getAttribute("x")) + parseFloat(rect.getAttribute("width")), y: parseFloat(rect.getAttribute("y"))},
        {x: parseFloat(rect.getAttribute("x")) + parseFloat(rect.getAttribute("width")), y: parseFloat(rect.getAttribute("y")) + parseFloat(rect.getAttribute("height"))},
        {x: parseFloat(rect.getAttribute("x")), y: parseFloat(rect.getAttribute("y")) + parseFloat(rect.getAttribute("height"))}
    ];
    var polygonPoints = parsePolygon(polygon);
    return greinerHormann.intersection(rectPoints, polygonPoints);
}

function setscrolling(playerxpos, levelwidth) {
    if ((-(playerxpos - 426)) < 0 && (-(playerxpos - 426)) > -levelwidth + 852) {
        scrollelems.setAttribute("transform", "translate(" + (-(playerxpos - 426)).toString() + ", 0)");
    }
    else {
        scrollelems.setAttribute("transform", "translate(" + (((-(playerxpos - 426)) > 0)?0:-levelwidth + 852).toString() + ", 0)");
    }
}

map = {};

function load() {
    
    onkeydown = onkeyup = function(e){
        e = e || event;
        map[e.keyCode] = e.type == 'keydown';
    }

    touchingGround = touching_rect_polygon(playerRect, groundPolygon);

    /*if (collisions.touching_bottom) {
        velocity_up = -1;
    }*/
    
    if (!(touchingGround)) {
        velocity_up = velocity_up - 0.5;
    }
    else {
        if (map[88]) {
            velocity_up = 8;
        }
        else {
            velocity_up = 0;
            var slope = 0;
            while (touching_rect_polygon(playerRect, groundPolygon)) {
                playerRect.setAttribute("y", parseFloat(playerRect.getAttribute("y")) - 0.5);
                playerCoords[1] -= 0.5;
                slope += 0.5;
                if (slope > 8) {
                    playerCoords[1] += slope;
                    break;
                }
            }
        }
    }
    
    if (map[39]) {
        velocity_right += 2;
    }
    
    if (map[37]) {
        velocity_right -= 2;
    }

    velocity_right *= 0.75;
    
    playerCoords[1] -= velocity_up;
    if (Math.abs(velocity_right) >= 0.5) {
        playerCoords[0] += velocity_right;
    }
    
    playerRect.setAttribute("x", playerCoords[0]); playerRect.setAttribute("y", playerCoords[1]);

    setscrolling(playerCoords[0], 1600);

    requestAnimationFrame(load);

}

levelInit(50, 50, "-33.000 317.000, 133.000 362.000, 385.000 310.000, 554.000 288.000, 564.000 240.000, 637.000 240.000, 640.000 288.000, 741.000 289.000, 757.000 240.000, 800.000 240.000, 811.000 283.000, 986.000 286.000, 1115.000 261.000, 1244.000 274.000, 1326.000 323.000, 1443.000 355.000, 1556.000 358.000, 1623.000 338.000, 1636.000 559.000, -46.000 605.000, -33.000 317.000");
load();