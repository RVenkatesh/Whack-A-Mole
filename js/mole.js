/** Mole */
export default class Mole {
    constructor($moleEl) {
        if (!$moleEl) {
            console.error('There is no Mole in that hole!!!');
            return;
        }
        this.$el = $moleEl;
    }
    show() {
        // Show this Mole here
        this.$el.classList.add('shown');
        this.shown = true;
    }
    hide() {
        this.$el.classList.remove('shown');
        this.shown = false;
    }
    hit() {
        // This Mole is been hit!!!
        this.$el.classList.add('hit');
        return new Promise(resolve => {
            setTimeout(() => {
                this.hide();
                this.$el.classList.remove('hit');
                resolve();
            }, 500);
        });
    }
    miss() {
        // This one escaped, add appropriate happy mood classes here
        this.$el.classList.add('miss');
        return new Promise(resolve => {
            setTimeout(() => {
                this.hide();
                this.$el.classList.remove('miss');
                resolve();
            }, 0);
        });
    }
}