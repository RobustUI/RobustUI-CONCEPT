class StateFactory {

    constructor(components) {
        this.components = components;
    }

    create(state, posX = 100, posY = 100, width = 100) {
        let data;
        let subStates;
        let transitions = [];
        switch(state.type.toUpperCase()) {
            case 'BASICSTATE':
                return new BasicState(state.name, posX, posY, width);
            break;

            case 'ANDSTATE':
                data = state;
                if (this.components.has(state.name)) {
                    data = this.components.get(state.name);
                }

                if (data.parsed) {
                    return null;
                }

                data.parsed = true;

                subStates = data.states.map((subState) => this.create(subState));

                return new BasicState(data.name, posX, posY, width);
            break;

            case 'XORSTATE':
                data = state;
                if (this.components.has(state.name)) {
                    data = this.components.get(state.name);
                }

                if (data.parsed) {
                    return null;
                }

                data.parsed = true;

                subStates = new Map();

                data.states.forEach((subState) => {
                    subStates.set(subState.name, this.create(subState));
                });

                data.transitions.forEach((transition) => {
                    if (transition.from != null && transition.to != null) {
                        transitions.push(new Transition(subStates.get(transition.from), subStates.get(transition.to), transition.event))
                    }
                });

                return new XorState(data.name, subStates, transitions, posX, posY, width);
            break;

            default:
                throw new Error("Unknown state type in StateFactory: " + state.type);
        }
    }
}
