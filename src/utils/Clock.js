export class Clock {
  constructor () {
    this.id = Math.trunc(Math.random() * 1e10).toString(36);
    this.tick = this.tick.bind(this);
    this.running = false;
    this.reset();
    this._events = [];
  }

  on (name, handler) {
    this._events.push({ name, handler });
  }

  off (name, handler) {
    this._events = this._events.filter(d => d.name !== name && d.handler !== handler);
    console.log('off', this._events.length);
  }

  trigger (name, data) {
    for (const ev of this._events) {
      if (ev.name === name) {
        ev.handler.call(this, data);
      }
    }
  }

  reset () {
    this._ = Date.now();
    this.$ = 0;
    return this;
  }

  start () {
    this.reset();
    this.running = true;
    this.tick();
    return this;
  }

  get elapsed () {
    return Math.trunc((Date.now() - this._) / 1000);
  }

  stop () {
    this.running = false;
    return this;
  }

  tick () {
    if (!this.running) {
      return;
    }
    const e = this.elapsed;
    if (e !== this.$) {
      this.$ = e;
      this.trigger('tick', e);
    }
    requestAnimationFrame(this.tick);
  }
}
