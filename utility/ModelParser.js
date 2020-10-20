class ModelParser {
    static parse(model) {
        let states = new Map();
        let offset = 100;
        let components = new Map();
        let stateFactory;

        model.components.forEach((component) => {
            components.set(component.name, component);
        })

        stateFactory = new StateFactory(components);

        model.components.forEach((component) => {
            const newState = stateFactory.create(component, offset);
            if (newState) {
                states.set(component.name, newState);
                offset += 150;
            }
        })


        return {
            states: states,
            transitions: [],
        };
    }
}


/*
    components.forEach((component) => {
        states.set(component.name, StateFactory.create(component, offset));
        offset += 150;
    })

    component.states.forEach((state) => {
        states.set(state.name, StateFactory.create(state, offset));
        offset += 150;
    });

    component.transitions.forEach((transition) => {
        if (transition.from != null && transition.to != null) {
            transitions.push(new Transition(states.get(transition.from), states.get(transition.to), transition.event))
        }
    });
 */
