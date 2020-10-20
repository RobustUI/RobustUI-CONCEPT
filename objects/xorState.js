class XorState extends BasicState{
    constructor(title, subStates, transitions, x, y, w) {
        super(title, x, y, w);
        this.states = subStates;
        this.transitions = transitions;
        this.type = 'xor';
    }
}
