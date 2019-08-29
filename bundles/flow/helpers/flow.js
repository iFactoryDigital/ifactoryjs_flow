
// require dependencies
const Helper  = require('helper');
const dotProp = require('dot-prop');

// require models
const Flow = model('flow');

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
  async run(flow, elements, opts, ...args) {
    // loop elements
    for (const element of elements) {
      // get fields
      const fields = this.actions();

      // find field
      const field = await fields.find(f => f.type === element.type);

      // return if field not found
      if (!field) return;

      // break flow if not true
      if (await field.run(Object.assign({}, { flow }, opts), Object.assign({}, element, flow.get('items').find(i => i.uuid === element.uuid)), ...args) !== true) return;
    }
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} daemon
   *
   * @return {*}
   */
  trigger(type, opts, render, daemon) {
    // check found
    const found = this.__triggers.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__triggers.push({
        type,
        opts,
        render,
        daemon,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.render = render;
      found.daemon = daemon;
    }

    // run daemon
    daemon(async (data = {}) => {
      // get query
      let query = data.query || {};

      // trigger type
      query = dotProp.set(query, 'trigger.type', type);

      // query for triggers
      const triggers = await (data.flow || Flow).where(query).find();

      // set opts
      if (!data.opts) data.opts = {};

      // query
      data.opts.query = query;
      data.opts.start = new Date();

      // do triggers
      if (triggers.length) {
        // trigger flows
        triggers.forEach((trigger) => {
          // trigger model update
          return this.run(trigger, trigger.get('tree'), data.opts, data.value);
        });
      }
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
module.exports = FlowHelper;
