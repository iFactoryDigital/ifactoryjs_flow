
// Require dependencies
const Grid       = require('grid');
const tmpl       = require('riot-tmpl');
const Model      = require('model');
const safeEval   = require('safe-eval');
const Controller = require('controller');

// Require models
const Flow = model('flow');

// flow helper
const FlowHelper  = helper('flow');
const emailHelper = helper('email');

/**
 * Build customer controller
 *
 * @acl   admin
 * @fail  next
 * @mount /admin/flow
 */
class FlowAdminController extends Controller {
  /**
   * Construct user customerAdminController controller
   */
  constructor() {
    // Run super
    super();

    // build customer admin controller
    this.build = this.build.bind(this);

    // bind hooks
    this.modelHook = this.modelHook.bind(this);
    this.flowSetupHook = this.flowSetupHook.bind(this);

    // set building
    this.building = this.build();
  }


  // ////////////////////////////////////////////////////////////////////////////
  //
  // BUILD METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////

  /**
   * builds customer admin controller
   */
  async build() {
    // setup flow helper
    this.__helper = new FlowHelper();

    // on ready
    await new Promise(resolve => this.eden.once('eden.ready', resolve));

    // flow setup
    await this.eden.hook('flow.build', this.__helper);
  }


  // ////////////////////////////////////////////////////////////////////////////
  //
  // ACTION METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////


  /**
   * Index action
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @icon     fa fa-bell
   * @menu     {ADMIN} Notifications
   * @title    Notification Administration
   * @parent   /admin/config
   * @route    {get} /
   * @layout   admin
   * @priority 10
   */
  async indexAction(req, res) {
    // Render grid
    res.render('flow/admin', {
      grid : await (await this._grid(req)).render(req),
    });
  }

  /**
   * Index action
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @title    Notification Administration
   * @route    {get} /create
   * @route    {get} /:id/update
   * @layout   admin
   * @priority 10
   */
  async updateAction(req, res) {
    // await building
    await this.building;

    // Set website variable
    let flow = new Flow();
    let create = true;

    // Check for website model
    if (req.params.id) {
      // Load by id
      flow = await Flow.findById(req.params.id);
      create = false;
    }

    // Render page
    res.render('flow/admin/update', {
      flow   : await flow.sanitise(this.__helper),
      title  : create ? 'Create Flow' : `Update ${flow.get('_id')}`,
      config : await this.__helper.render(),
    });
  }

  /**
   * Index action
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @title    Notification Administration
   * @route    {post} /create
   * @route    {post} /:id/update
   * @layout   admin
   * @priority 10
   */
  async submitAction(req, res) {
    // await building
    await this.building;

    // Set website variable
    let flow = new Flow();
    let create = true;

    // Check for website model
    if (req.params.id) {
      // Load by id
      flow = await Flow.findById(req.params.id);
      create = false;
    }

    // set
    flow.set('tree', req.body.tree);
    flow.set('title', req.body.title);
    flow.set('items', req.body.items);
    flow.set('trigger', req.body.trigger);

    // save flow
    await flow.save();

    // Render page
    if (!req.query.json) {
      // return render
      res.render('flow/admin/update', {
        flow   : await flow.sanitise(this.__helper),
        title  : create ? 'Create Flow' : `Update ${flow.get('_id')}`,
        config : await this.__helper.render(),
      });
    }

    // return json
    res.json({
      result  : await flow.sanitise(this.__helper),
      success : true,
    });
  }

  /**
   * index action
   *
   * @param req
   * @param res
   *
   * @acl   admin
   * @fail  next
   * @route {GET} /models
   */
  async modelsAction(req, res) {
    // find children
    let models = Object.keys(cache('models')).map((key) => {
      // return object
      return {
        model : key,
        title : key,
      };
    });

    // hook models
    await this.eden.hook('flow.models', models);

    // set query
    if (req.query.q) {
      // filter models
      models = models.filter((model) => {
        // return model
        return model.model.toLowerCase().includes(req.query.q.toLowerCase());
      });
    }

    // get children
    res.json(models.map((model) => {
      // return object
      return {
        text  : model.title,
        data  : model,
        value : model.model,
      };
    }));
  }

  /**
   * field action
   *
   * @param req
   * @param res
   *
   * @acl   admin
   * @fail  next
   * @route {POST} /field
   */
  async fieldAction(req, res) {
    // get fields
    let fields = [];

    // check for
    if (req.body.for === 'action') {
      fields = this.__helper.actions();
    } else if (req.body.for === 'timing') {
      fields = this.__helper.timings();
    } else if (req.body.for === 'logic') {
      fields = this.__helper.logics();
    }

    // get field
    const field = fields.find(f => f.type === req.body.type);

    // get data
    const data = {};
    const action = Object.assign(field.opts, req.body);

    // messy render
    await field.render(action, data);

    // return json
    return res.json({
      result  : { data, action },
      success : true,
    });
  }


  // ////////////////////////////////////////////////////////////////////////////
  //
  // HOOK METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////

  /**
   * setup flow hook
   *
   * @pre flow.build
   */
  async flowSetupHook(flow) {
    // do initial triggers
    flow.trigger('hook', {
      icon  : 'fa fa-play',
      title : 'Named Hook',
    }, (action, render) => {

    }, (opts, element, ...args) => {

    });
    flow.trigger('event', {
      icon  : 'fa fa-calendar-exclamation',
      title : 'Named Event',
    }, (action, render) => {

    }, (opts, element, ...args) => {

    });
    flow.trigger('model', {
      icon  : 'fa fa-calendar-exclamation',
      title : 'Model Change',
    }, (action, render) => {

    }, (opts, element, ...args) => {

    });

    // do initial actions
    flow.action('event.trigger', {
      tag   : 'action-event',
      icon  : 'fa fa-play',
      title : 'Trigger Event',
    }, (action, render) => {

    }, (opts, element, ...args) => {
      // trigger event
      if ((element.config || {}).event) {
        // trigger event
        this.eden.emit(`flow:event.${element.config.event}`, ...args);
      }

      // return true
      return true;
    });
    // do initial actions
    flow.action('email.send', {
      tag   : 'action-email',
      icon  : 'fa fa-envelope',
      title : 'Send Email',
    }, (action, render) => {

    }, async (opts, element, model) => {
      // set config
      element.config = element.config || {};

      // send model
      if (model instanceof Model) {
        // sanitise model
        model = await model.sanitise();
      }

      // send email
      await emailHelper.send((tmpl.tmpl(element.config.to || '', model)).split(',').map(i => i.trim()), 'blank', {
        body    : tmpl.tmpl(element.config.body || '', model),
        subject : tmpl.tmpl(element.config.subject || '', model),
      });

      // return true
      return true;
    });
    flow.action('hook.trigger', {
      tag   : 'action-hook',
      icon  : 'fa fa-calendar-exclamation',
      title : 'Trigger Hook',
    }, (action, render) => {

    }, async (opts, element, ...args) => {
      // trigger event
      if ((element.config || {}).hook) {
        // trigger event
        await this.eden.hook(`flow:hook.${element.config.hook}`, ...args);
      }

      // return true
      return true;
    });
    flow.action('model.set', {
      tag   : 'action-model-set',
      icon  : 'fa fa-plus',
      title : 'Set Value',
    }, (action, render) => {

    }, async (opts, element, model) => {
      // do to set
      let toSet = model;

      // check type
      if (element.config.type === 'this') {
        // send model
        if (!(model instanceof Model)) return false;
      } else if (element.confg.type === 'new') {
        // get new model
        const Mod = model(element.config.model);

        // new model
        toSet = new Mod();
      } else if (element.config.type === 'existing') {
        // get new model
        const Mod = model(element.config.model);

        // new model
        if (element.config.query === 'id') {
          // get model
          toSet = await Mod.findById(element.config.id);
        } else {
          // get model
          toSet = await Mod.where(element.config.where).findOne();
        }
      }

      // set values
      if (!toSet) return false;

      // loop fields
      for (const field of element.config.fields) {
        // set field
        // eslint-disable-next-line no-nested-ternary
        toSet.set(field.name, field.type === 'code' ? safeEval(field.code, model) : (field.type === 'this' ? model : model.get(field.from)));
      }

      // save toSet
      await toSet.save();

      // return true
      return true;
    });

    // do initial timings
    flow.timing('delay', {
      tag   : 'timing-delay',
      icon  : 'fa fa-stopwatch',
      title : 'Time Delay',
    }, (action, render) => {

    }, (opts, element, ...args) => {
      return true;
    });

    // boolean check
    const filterCheck = async (opts, element, model) => {
      // set config
      element.config = element.config || {};

      // check model
      if ((element.config.type || 'value') === 'code') {
        // safe eval code
        return !!safeEval(element.config.code, model);
      }

      // get value
      let value = model[element.config.of];
      const is = element.config.is || 'eq';

      // check model
      if (model instanceof Model) {
        // get value from model
        value = await model.get(element.config.of);
      }

      // check
      if (is === 'eq' && value !== element.config.value) {
        // return false
        return false;
      }
      if (is === 'ne' && value === element.config.value) {
        // return false
        return false;
      }
      if (is === 'gt' && value < element.config.value) {
        // return false
        return false;
      }
      if (is === 'lt' && value > element.config.value) {
        // return false
        return false;
      }

      // return false at every opportunity
      return true;
    };

    // do initial logics
    flow.logic('filter', {
      tag   : 'logic-filter',
      icon  : 'fa fa-filter',
      title : 'Conditional Filter',
    }, (action, render) => {

    }, filterCheck);
    flow.logic('condition.split', {
      tag   : 'logic-split',
      icon  : 'fa fa-code-merge',
      title : 'Conditional Split',
    }, (action, render) => {

    }, async (opts, element, ...args) => {
      // set go
      const go = await filterCheck(opts, element, ...args);

      // get children
      const children = (element.children || [])[go ? 0 : 1] || [];

      // await trigger
      await this.__helper.run(opts.flow, children, opts, ...args);

      // return true
      return true;
    });
  }

  /**
   * setup flow hook
   *
   * @pre *.update
   * @pre *.remove
   * @pre *.create
   * @post *.update
   * @post *.create
   * @post *.remove
   */
  async modelHook(model, a, b) {
    // check model
    if (!(model instanceof Model)) return;

    // set vars
    let hook;
    let type;

    // chec vars
    if (!b) {
      hook = a.hook;
      type = a.type;
    } else {
      hook = b.hook;
      type = b.type;
    }

    // check
    if (!hook || !type) return;

    // get model type
    const modelName = hook.split('.')[0];
    const updateType = hook.split('.')[1];

    // query for triggers
    const triggers = await Flow.where({
      'trigger.type'       : 'model',
      'trigger.data.when'  : type === 'pre' ? 'before' : 'after',
      'trigger.data.model' : modelName,
      'trigger.data.event' : updateType,
    }).find();

    // do triggers
    if (triggers.length) {
      // trigger flows
      await Promise.all(triggers.map((trigger) => {
        // trigger model update
        return this.__helper.run(trigger, trigger.get('tree'), { type : updateType, name : modelName, when : type === 'pre' ? 'before' : 'after' }, model);
      }));
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  //
  // GRID METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////

  /**
   * User grid action
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @route  {post} /grid
   * @return {*}
   */
  async gridAction(req, res) {
    // Return post grid request
    return (await this._grid(req)).post(req, res);
  }

  /**
   * Renders grid
   *
   * @param {Request} req
   *
   * @return {grid}
   */
  async _grid(req) {
    // Create new grid
    const flowGrid = new Grid();

    // Set route
    flowGrid.route('/admin/flow/grid');

    // Set grid model
    flowGrid.id('edenjs.notification');
    flowGrid.model(Flow);
    flowGrid.models(true);

    // Add grid columns
    flowGrid.column('_id', {
      sort     : true,
      title    : 'Id',
      priority : 100,
    }).column('title', {
      sort     : true,
      title    : 'Title',
      priority : 90,
    });

    // add extra columns
    flowGrid.column('updated_at', {
      tag      : 'grid-date',
      sort     : true,
      title    : 'Updated',
      priority : 3,
    }).column('created_at', {
      tag      : 'grid-date',
      sort     : true,
      title    : 'Created',
      priority : 2,
    }).column('actions', {
      tag      : 'flow-actions',
      type     : false,
      width    : '1%',
      title    : 'Actions',
      priority : 1,
    });

    // Set default sort order
    flowGrid.sort('created_at', -1);

    // Return grid
    return flowGrid;
  }
}

/**
 * Export customer controller
 *
 * @type {FlowAdminController}
 */
module.exports = FlowAdminController;
