class BreathController {
    constructor (callbacks) {
        this._audio = null;
        this._mic = null;
        this._fft = null;
        this._data = null;
        this._velocity = 0;
        this._callbacks = callbacks || {};
        this.ready = new Promise(resolve => {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(mic => {
                this._audio = new AudioContext();
                this._mic = this._audio.createMediaStreamSource(mic);
                this._fft = this._audio.createAnalyser();
                this._fft.smoothingTimeConstant = 0.1;
                this._data = new Float32Array(this._fft.frequencyBinCount);
                this._mic.connect(this._fft);
                this._analyze();
                resolve();
            })
        });
    }

    _analyze () {
        this._fft.getFloatFrequencyData(this._data);
        let sum = 0;
        for (let i = 0; i < 128; ++i)
            sum += this._data[i];
        sum /= 128;
        if (sum < -90)
            sum = -90;
        else if (sum > -70)
            sum = -70;
        const velocity = (Math.sqrt(Math.sqrt((sum + 90) / 20)) * 127) | 0;
        this._update(velocity);
        requestAnimationFrame(this._analyze.bind(this));
    }

    _update (velocity) {
        if (this._velocity == velocity)
            return;
        if (this._callbacks.onVelocityChanged)
            this._callbacks.onVelocityChanged(velocity);
        if (this._velocity == 0 && this._callbacks.onNoteOn)
            this._callbacks.onNoteOn(velocity);
        if (velocity == 0 && this._callbacks.onNoteOff)
            this._callbacks.onNoteOff();
        this._velocity = velocity;
    }
}