class Transition {
    constructor(from, to, event) {
        this.event = event;
        this.from = from;
        this.to = to;
    }

    update() {
        this.connectionPoint = null;
        const fromPoints = [
            this.from.getCenterOfEdge('t'),
            this.from.getCenterOfEdge('b'),
            this.from.getCenterOfEdge('l'),
            this.from.getCenterOfEdge('r')
        ]

        const toPoints = [
            this.to.getCenterOfEdge('t'),
            this.to.getCenterOfEdge('b'),
            this.to.getCenterOfEdge('l'),
            this.to.getCenterOfEdge('r')
        ]

        for(let point of fromPoints) {
            for(let point2 of toPoints) {
                const distance = dist(point.x, point.y, point2.x, point2.y)

                const distBetween = {from: point, to: point2, dist: distance};

                if (this.connectionPoint == null) {
                    this.connectionPoint = distBetween;
                } else if (this.connectionPoint.dist > distBetween.dist) {
                    this.connectionPoint = distBetween;
                }
            }
        }

        this.offset = 10;
        this.angle = atan2(this.connectionPoint.from.y - this.connectionPoint.to.y, this.connectionPoint.from.x - this.connectionPoint.to.x);
        this.lineLengthX = this.connectionPoint.from.x-this.connectionPoint.to.x;
        this.lineLengthY = this.connectionPoint.from.y-this.connectionPoint.to.y;
    }

    isTarget(mouseX, mouseY) {
        // get distance from the point to the two ends of the line
        const d1 = dist(mouseX,mouseY, this.connectionPoint.from.x, this.connectionPoint.from.y);
        const d2 = dist(mouseX,mouseY, this.connectionPoint.to.x, this.connectionPoint.to.y);

        // get the length of the line
        const lineLen = dist(this.connectionPoint.from.x, this.connectionPoint.from.y, this.connectionPoint.to.x, this.connectionPoint.to.y);

        // since floats are so minutely accurate, add
        // a little buffer zone that will give collision
        const buffer = 0.5;    // higher # = less accurate

        // if the two distances are equal to the line's
        // length, the point is on the line!
        // note we use the buffer here to give a range,
        // rather than one #
        if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
            return true;
        }
        return false;
    }

    drawHighlight() {
        push()
        stroke(255, 204, 0);
        strokeWeight(4);
        line(this.connectionPoint.from.x, this.connectionPoint.from.y, this.connectionPoint.to.x, this.connectionPoint.to.y);


        this.drawEventName();

        this.drawTriangle();
        pop()
    }

    draw() {
        line(this.connectionPoint.from.x, this.connectionPoint.from.y, this.connectionPoint.to.x, this.connectionPoint.to.y);


        this.drawEventName();

        this.drawTriangle();


    }

    drawEventName() {
        push();
        translate(this.connectionPoint.from.x - this.lineLengthX/2, this.connectionPoint.from.y - this.lineLengthY/2);
        rotate(this.angle-PI);
        textAlign(CENTER);
        text(this.event, 0, -20);
        pop();
    }

    drawTriangle(){
        push();
        fill(0,0,0);
        translate(this.connectionPoint.to.x, this.connectionPoint.to.y); //translates to the destination vertex
        rotate(this.angle-HALF_PI); //rotates the arrow point
        triangle(-this.offset*0.5, this.offset, this.offset*0.5, this.offset, 0, -this.offset/2); //draws the arrow point as a triangle
        pop();
    }

    toJsonObj() {
        return {"from": this.from.title, "event": this.event, "guard": null, "to": this.to.title};
    }
}
