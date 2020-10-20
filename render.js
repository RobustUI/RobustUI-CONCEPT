
let transitions = [];
let model;
let inpState;
let buttonState;
let selState;
let selState2;
let inpTrans;
let buttonTrans;
let modelFile;
let saveButton;
let cameraMoveActive = false;

let currentSelection;

let stateSpace;
function preload() {
    inpState = createInput('');
    inpState.position(100, 1000);
    buttonState = createButton('submit');
    buttonState.position(inpState.x + inpState.width, inpState.y);
    buttonState.mousePressed(addState.bind(this));



    modelFile = createFileInput(handleFile);
    modelFile.position(100, 900);

    saveButton = createButton('Save Model');
    saveButton.position(modelFile.x + modelFile.width, modelFile.y);
    saveButton.mousePressed(saveModel);


    selState = createSelect();
    selState.position(500, 1000);

    selState2 = createSelect();
    selState2.position(selState.x + selState.width + 100, selState.y);

    inpTrans = createInput('');
    inpTrans.position(selState2.x + selState2.width + 100, selState.y);
    buttonTrans = createButton('submit');
    buttonTrans.position(inpTrans.x + inpTrans.width, inpTrans.y);
    buttonTrans.mousePressed(addTransition.bind(this));
    loadJSON('model.json', loadModelFromJSON);
}

function setup() {
    noLoop();
    createCanvas(1920, 1080);
    this.translateOffset = {x: 0, y: 0};
}

function draw() {
    clear();

    update();

    if(this.stateSpace instanceof BasicState) {
        push();
        rect(0, 0, this.stateSpace.states.size*200, this.stateSpace.states.size*200, 5);
        text(this.stateSpace.title, 10, 10);
        pop();
    }

    for(let state of this.stateSpace.states.values()) {
        if (state === currentSelection) {
            state.drawHighlight();
        }else {
            state.draw();
        }
    }

    for (let transition of this.stateSpace.transitions) {
        if (transition === currentSelection) {
            transition.drawHighlight();
        }else {
            transition.draw();
        }
    }
}

function update() {
    for(let state of this.stateSpace.states.values()) {
        state.update();
    }

    for (let transition of this.stateSpace.transitions) {
        transition.update();
    }
}

function mouseDragged() {
    if(currentSelection != null && currentSelection.isTarget(mouseX, mouseY)) {
        loop();
        currentSelection.move(mouseX, mouseY);
    }

    return false;
}

function mouseClicked() {
    loop();
    let hit = false;

    push()
    rect(mouseX, mouseY, 100, 100, 0)
    pop()

    for(let state of this.stateSpace.states.values()) {
        if (state.isTarget(mouseX, mouseY)) {
            currentSelection = state;
            hit = true;
            noLoop();
            return;
        }
    }

    /*if (!hit) {
        for(let transition of transitions) {
            if (transition.isTarget(mouseX, mouseY)) {
                currentSelection = transition;
                hit = true;
                noLoop();
                return;
            }
        }
    }*/

    if (!hit) {
        currentSelection = null;
    }

    noLoop();
}

function doubleClicked() {
    for(let state of this.stateSpace.states.values()) {
        if (state.isTarget(mouseX, mouseY) && state.type !== 'basic') {
            this.stateSpace = state;
            addStatesToDropDown();
            noLoop();
            return;
        }
    }
}

function mouseReleased() {
    noLoop();
}

function keyPressed() {
    loop();
    switch (keyCode) {
        case DELETE:
            if (currentSelection != null) {
                if(currentSelection instanceof BasicState) {
                    this.stateSpace.states.delete(currentSelection.title)
                    for (let i = transitions.length-1; i >= 0; i--) {
                        if (transitions[i].from.title === currentSelection.title || transitions[i].to.title === currentSelection.title) {
                            transitions.splice(i, 1);
                        }
                    }
                    currentSelection = null;
                    addStatesToDropDown();
                } else if(currentSelection instanceof Transition) {
                    const index = transitions.findIndex((e) => e === currentSelection);
                    if(index > -1) {
                        transitions.splice(index, 1);
                    }
                }

            }
        break;
        case 32:
            cameraMoveActive=true;
        break;
        default:

    }
    noLoop();
}

function addTransition() {
    loop();

    let from = selState.value();
    let to = selState2.value();

    this.stateSpace.transitions.push(new Transition(this.stateSpace.states.get(from), this.stateSpace.states.get(to), inpTrans.value()))

    noLoop();
}

function addState() {
    loop();
    this.stateSpace.states.set(inpState.value(), new BasicState(inpState.value(), 400, 400, 100));
    inpState.value('');
    addStatesToDropDown();
    noLoop();
}

function addStatesToDropDown() {
    for(let state of this.stateSpace.states.values()) {
        selState.option(state.title, state.title);
    }

    for(let state of this.stateSpace.states.values()) {
        selState2.option(state.title, state.title);
    }
}

function handleFile(file) {
    loadJSON(file.name, loadModelFromJSON);
}

function loadModelFromJSON(model) {
    loop();
    this.model = ModelParser.parse(model);
    this.stateSpace = this.model;
    addStatesToDropDown();
    noLoop();
}

function saveModel() {

    const file = {
        "abstractTypes": ["ABSTRACT-TYPES", "SHOULD-GO-HERE", "DROPDOWN", "SLECTAGBLEITEM"],
        "components": []
    }

    const json =  {
        "name": "PLACEHOLDERNAME",
        "type": "PLAEHOLDERTYPE",
        "inputs": [],
        "outputs": [],
        "states": Array.from(states.values()).map(s => s.toJsonObj()),
        "events": [],
        "conditions": [],
        "transitions": transitions.map(t => t.toJsonObj())
    };

    file.components.push(json);

    console.log(file);
    saveJSON(file, "newModel.json")
}
