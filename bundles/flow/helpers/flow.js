
// require dependencies
const Helper  = require('helper');
const dotProp = require('dot-prop');

/**
 * build placement helper
 */
class FlowHelper extends Helper {
  /**
   * construct placement helper
   */
  constructor() {
    // run super
    super();

    // bind methods
    this.build = this.build.bind(this);

    // run build method
    this.build();
  }

  /**
   * builds placement helper
   */
  build() {
    // build placement helper
    this.__actions = [];
    this.__triggers = [];
  }

  /**
   * reset
   */
  reset() {
    // return rebuild
    return this.build();
  }

  /**
   * runs flow
   *
   * @param {Flow}   flow 
   * @param {Object} opts 
   * @param {...any} args 
   */
  async run(flow, elements, opts, value) {
    // loop elements
    for (let i = 0; i < elements.length; i++) {
      // element
      const element = elements[i];

      // get fields
      const fields = this.actions();

      // find field
      const field = await fields.find(f => f.type === element.type);

      // return if field not found
      if (!field) return null;

      // set ran
      const ran = await field.run(Object.assign({}, { flow }, opts), Object.assign({}, element, flow.get('items').find(i => i.uuid === element.uuid)), value);

      // break flow if not true
      if (ran === true) continue;
      if (Array.isArray(ran)) {
        // split out into multiple
        return await Promise.all(ran.map(val => this.run(flow, elements.slice(i + 1), opts, val)));
      }

      // return on nothing
      return null;
    }

    // return
    return null;
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} daemon
   * @param  {Function} save
   *
   * @return {*}
   */
  trigger(type, opts, render, daemon, save, start) {
    // check found
    const found = this.__triggers.find(field => field.type === type);

    // require models
    const Flow = model('flow');

    // return found
    if (!opts) return found;

    // push field
    if (!found) {
      // check found
      this.__triggers.push({
        type,
        opts,
        render,
        daemon,
        save,
        start,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.start = start;
      found.render = render;
      found.daemon = daemon;
    }

    // run daemon
    daemon(async (data = {}) => {
      // query for triggers
      const triggers = await (data.query || Flow).where({
        'trigger.type' : type,
      }).find();

      // set opts
      if (!data.opts) data.opts = {};

      // query
      data.opts.start = new Date();

      // do triggers
      if (!triggers.length) return;

      // trigger flows
      triggers.forEach(async (trigger) => {
        // start
        const t = this.trigger(trigger.get('trigger.type'));

        // check start
        if (t.start) {
          // start
          await t.start(data, trigger);
        }

        // set running
        trigger.set('running_at', new Date());

        // save trigger
        await trigger.save();

        // trigger model update
        await this.run(trigger, trigger.get('tree'), data.opts, data.value);

        // set running
        trigger.unset('running_at');

        // save trigger
        await trigger.save();
      });
    }, () => {}, Flow);
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} run
   *
   * @return {*}
   */
  action(type, opts, render, run) {
    // check found
    const found = this.__actions.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__actions.push({
        run,
        type,
        opts,
        render,
      });
    } else {
      // set on found
      found.run = run;
      found.type = type;
      found.opts = opts;
      found.render = render;
    }
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  actions() {
    // returns fields
    return this.__actions;
  }

  /**
   * render fields
   *
   * @return {Array}
   */
  render() {
    // map fields
    return {
      actions : this.__actions.map((action) => {
        return {
          type : action.type,
          opts : action.opts,
        };
      }),
      triggers : this.__triggers.map((trigger) => {
        return {
          type : trigger.type,
          opts : trigger.opts,
        };
      }),
    };
  }
}

/**
 * export new FlowHelper class
 *
 * @return {FlowHelper}
 */
module.exports = new FlowHelper();
