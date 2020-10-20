class BasicState {
    constructor(title, x, y, w) {
        this.title = title;
        this.x = x;
        this.y = y;
        this.w = w;
        this.type = 'basic';
    }

    drawHighlight() {
        push();
            stroke(255, 204, 0);
            strokeWeight(4);
            rectMode(CENTER);
            textAlign(CENTER);
            rect(this.x, this.y, this.w, this.w, 5);
            text(this.title, this.x, this.y);
        pop();
    }

    draw() {
        push();
            rectMode(CENTER);
            textAlign(CENTER);
            rect(this.x, this.y, this.w, this.w, 5);
            text(this.title, this.x, this.y);
        pop();
    }

    update() {

    }

    isTarget(mouseX, mouseY) {
        return dist(this.x, this.y, mouseX, mouseY) <= this.w/2;
    }

    move(mouseX, mouseY) {
        this.x = mouseX;
        this.y = mouseY;
    }

    getCenterOfEdge(side) {
        let xEdgeCenter;
        let yEdgeCenter;

        const distanceFromCenterToEdge = this.w / 2;

        if (side === 't') {
            xEdgeCenter = this.x;
            yEdgeCenter = this.y - distanceFromCenterToEdge;
        }
        else if(side === 'r') {
            xEdgeCenter = this.x + distanceFromCenterToEdge;
            yEdgeCenter = this.y;
        }
        else if (side === 'b') {
            xEdgeCenter = this.x;
            yEdgeCenter = this.y + distanceFromCenterToEdge;
        }
        else if (side === 'l') {
            xEdgeCenter = this.x - distanceFromCenterToEdge;
            yEdgeCenter = this.y;
        } else {
            throw new Error("You didn't specify a recognizable side!")
        }


        return {x: xEdgeCenter, y: yEdgeCenter };
    }


    toJsonObj() {
        return { "name": this.title, "type": "BASICSTATE"};
    }
}
