
// require dependencies
const Helper = require('helper');

// require models
const Form = model('form');

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
    this.__logics = [];
    this.__actions = [];
    this.__timings = [];
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
      let fields = [];

      // get element from here
      if (element.for === 'action') {
        fields = this.actions();
      } else if (element.for === 'timing') {
        fields = this.timings();
      } else if (element.for === 'logic') {
        fields = this.logics();
      }

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
   * @param  {Function} run
   *
   * @return {*}
   */
  trigger(type, opts, render, run) {
    // check found
    const found = this.__triggers.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__triggers.push({
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
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} run
   *
   * @return {*}
   */
  timing(type, opts, render, run) {
    // check found
    const found = this.__timings.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__timings.push({
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
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} render
   * @param  {Function} run
   *
   * @return {*}
   */
  logic(type, opts, render, run) {
    // check found
    const found = this.__logics.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__logics.push({
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
  logics() {
    // returns fields
    return this.__logics;
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
   * gets fields
   *
   * @return {Array}
   */
  timings() {
    // returns fields
    return this.__timings;
  }

  /**
   * render fields
   *
   * @return {Array}
   */
  render() {
    // map fields
    return {
      logics : this.__logics.map((logic) => {
        return {
          type : logic.type,
          opts : logic.opts,
        };
      }),
      actions : this.__actions.map((action) => {
        return {
          type : action.type,
          opts : action.opts,
        };
      }),
      timings : this.__timings.map((timing) => {
        return {
          type : timing.type,
          opts : timing.opts,
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
