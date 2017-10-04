// Button ID
//  3  7
//  2  6 
//  1  5
//  0  4
class TouchController {
    constructor (callbacks) {
        document.addEventListener('touchstart', this._onChanged.bind(this), false);
        document.addEventListener('touchend', this._onChanged.bind(this), false);
        document.addEventListener('touchmove', e => e.preventDefault(), { passive: false, capture: false });

        this._callbacks = callbacks || {};
        this._touches = {};
        this._idToButtonMap = {};
        this._note = -1;
        this._buttons = new Array(8);
        for (let i = 0; i < this._buttons.length; ++i)
            this._buttons[i] = 0;

        this._noteMap = {
            '11101111':  60, // C
            '11111111':  61, // C#
            '11101110':  62, // D
            '11111110':  63, // D#
            '11101100':  64, // E
            '11101000':  65, // F
            '11111000':  66, // F#
            '11100000':  67, // G
            '11110000':  68, // G#
            '11000000':  69, // A
            '11010000':  70, // A#
            '10000000':  71, // B
            '01000000':  72, // ^C
            '00000000':  72, // ^C
            '01101111':  72, // ^C
            '01010000':  73, // ^C#
            '00010000':  73, // ^C#
            '01101110':  74, // ^D
            '01111110':  75, // ^D#
            '01101100':  76, // ^E
            '01101000':  77, // ^F
            '01111000':  78, // ^F#
            '01100000':  79, // ^G
            '01110000':  80, // ^G#
        };
    }

    _onChanged (e) {
        const touches = {};
 
        // Detect added identifiers.
        for (let touch of e.touches) {
            const id = touch.identifier;
            touches[id] = { x: touch.clientX, y: touch.clientY };
            if (this._touches[id] === undefined)
                this._onStartTouch(id, touches[id]);
        }
 
        // Detect removed identifiers.
        for (let id in this._touches) {
            if (touches[id] === undefined)
                this._onEndTouch(id);
        }
 
        this._touches = touches;
    }

    _onStartTouch (id, touch) {
        const isLeft = (touch.x * 2.0) < window.innerWidth;
        let position = (touch.y * 4.0 / window.innerHeight) | 0;
        if (position >= 4)
            position = 3;
        const button = 3 - position + (isLeft ? 0 : 4);
        this._onPress(button);
        this._idToButtonMap[id] = button;
    }

    _onEndTouch (id) {
        this._onRelease(this._idToButtonMap[id]);
    }

    _onPress(button) {
        if (this._buttons[button] == 1)
          return;
        this._buttons[button] = 1;
        this._onButtonChanged();
    }

    _onRelease(button) {
        if (this._buttons[button] == 0)
          return;
        this._buttons[button] = 0;
        this._onButtonChanged();
    }

    _onButtonChanged() {
        if (this._callbacks.onButtonChanged)
            this._callbacks.onButtonChanged(this._buttons);
        const code = this._buttons.join('');
        const note = this._noteMap[code];
        if (note === undefined)
            note = -1;
        this._note = note;
        if (this._callbacks.onNoteChanged)
            this._callbacks.onNoteChanged(this._note);
    }
}