
// Require dependencies
const Grid       = require('grid');
const tmpl       = require('riot-tmpl');
const Model      = require('model');
const moment     = require('moment');
const safeEval   = require('safe-eval');
const Controller = require('controller');
const config     = require('config');

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
    // on ready
    await new Promise(resolve => this.eden.once('eden.ready', resolve));

    // flow setup
    await this.eden.hook('flow.build', FlowHelper);
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
   * @title    Flow Administration
   * @parent   /admin/fleet/company
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
      flow   : await flow.sanitise(),
      title  : create ? 'Create Flow' : `Update ${flow.get('_id')}`,
      config : await FlowHelper.render(),
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

    // ru save
    const trigger = FlowHelper.trigger(flow.get('trigger.type'));

    // trigger save
    if (trigger && trigger.save) {
      // save trigger
      await trigger.save(flow.get('trigger.data'), flow);
    }

    // save flow
    await flow.save();

    // Render page
    if (!req.query.json) {
      // return render
      res.render('flow/admin/update', {
        flow   : await flow.sanitise(),
        title  : create ? 'Create Flow' : `Update ${flow.get('_id')}`,
        config : await FlowHelper.render(),
      });
    }

    // return json
    res.json({
      result  : await flow.sanitise(),
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
    const fields = FlowHelper.actions();

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
    /*
      EDEN TRIGGERS
    */

    // do initial triggers
    flow.trigger('cron', {
      icon  : 'fa fa-clock',
      title : 'Date/Time',
    }, (action, render) => {

    }, (run, cancel, query) => {
      // set interval for query
      setInterval(async () => {
        // set query
        const q = query.lte('execute_at', new Date());

        // run with query
        await run({
          query : q,
          value : {},
        });
      }, 5000);
    }, (element, flowModel) => {
      // days
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      // parse next date
      const previous = flowModel.get('executed_at') || new Date();
      let next = moment();

      // set time
      if (element.time) {
        // set time
        next.set({
          hour   : parseInt(element.time.split(':')[0], 10),
          minute : parseInt(element.time.split(':')[1], 10),
          second : 0,
        });
      }

      // set day
      if (element.when === 'week') {
        // set next
        next = next.day(days.indexOf((element.day || 'monday').toLowerCase()) + 1);
      }

      // check last executed
      if (next.toDate() < new Date()) {
        if (element.when === 'minute') {
          // add one week
          next = next.add(1, 'minute');
        } else if (element.when === 'hour') {
          // add one week
          next = next.add(1, 'hour');
        } else if (element.when === 'week') {
          // add one week
          next = next.add(7, 'days');
        } else if (element.when === 'month') {
          // add
          next = next.add(1, 'months');
        }
      }

      // set values
      flowModel.set('executed_at', previous);
      flowModel.set('execute_at', next.toDate());
    }, (data, flowModel) => {
      // check when
      if (flowModel.get('trigger.data.when') === 'week') {
        // set execute at
        flowModel.set('execute_at', moment(flowModel.get('execute_at')).add(7, 'days').toDate());
      } else if (flowModel.get('trigger.data.when') === 'month') {
        // set execute at
        flowModel.set('execute_at', moment(flowModel.get('execute_at')).add(1, 'month').toDate());
      } else if (flowModel.get('trigger.data.when') === 'minute') {
        // set execute at
        flowModel.set('execute_at', moment(new Date()).add(1, 'minute').toDate());
      } else if (flowModel.get('trigger.data.when') === 'hour') {
        // set execute at
        flowModel.set('execute_at', moment(new Date()).add(1, 'hour').toDate());
      }

      // set executed at
      flowModel.set('executed_at', new Date());
    });
    flow.trigger('hook', {
      icon  : 'fa fa-play',
      title : 'Named Hook',
    }, (action, render) => {

    }, (run, cancel, query) => {
      // execute function
      const execute = (...subArgs) => {
        // find hook/type
        const { hook, type } = subArgs.find(s => s.hook && s.type);

        // check
        if (!hook || !type) return;

        // create trigger object
        const data = {
          opts  : { type, hook, when : type === 'pre' ? 'before' : 'after' },
          value : { args : subArgs },
          query : query.where({
            'trigger.data.when' : type === 'pre' ? 'before' : 'after',
            'trigger.data.hook' : hook,
          }),
        };

        // run trigger
        run(data);
      };

      // add hooks
      this.eden.pre('*', execute);
      this.eden.post('*', execute);
    });
    flow.trigger('event', {
      icon  : 'fa fa-calendar-exclamation',
      title : 'Named Event',
    }, (action, render) => {

    }, (run, cancel, query) => {
      // execute function
      const execute = (...subArgs) => {
        // find hook/type
        const { event } = subArgs.find(s => s.event);

        // check
        if (!event) return;

        // create trigger object
        const data = {
          opts  : { event },
          value : { args : subArgs },
          query : query.where({
            'trigger.data.event' : event,
          }),
        };

        // run trigger
        run(data);
      };

      // add hooks
      this.eden.on('*', execute);
    });
    flow.trigger('model', {
      icon  : 'fa fa-calendar-exclamation',
      title : 'Model Change',
    }, (action, render) => {

    }, (run, cancel, query) => {
      // execute function
      const execute = (model, a, b) => {
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

        // create trigger object
        const data = {
          opts  : { type : updateType, name : modelName, when : type === 'pre' ? 'before' : 'after' },
          value : { model },
          query : query.where({
            'trigger.data.when'  : type === 'pre' ? 'before' : 'after',
            'trigger.data.model' : modelName,
            'trigger.data.event' : updateType,
          }),
        };

        // run trigger
        run(data);
      };

      // add hooks
      this.eden.pre('*.update', execute);
      this.eden.pre('*.remove', execute);
      this.eden.pre('*.create', execute);
      this.eden.post('*.update', execute);
      this.eden.post('*.remove', execute);
      this.eden.post('*.create', execute);
    });
    flow.trigger('value', {
      icon  : 'fa fa-calendar-exclamation',
      title : 'Model Value',
    }, (action, render) => {

    }, (run, cancel, query) => {

    });

    /*
      EDEN ACTIONS
    */
    // do initial actions
    flow.action('event.trigger', {
      tag   : 'event',
      icon  : 'fa fa-play',
      title : 'Trigger Event',
    }, (action, render) => {

    }, (opts, element, data) => {
      // trigger event
      if ((element.config || {}).event) {
        // trigger event
        this.eden.emit(`flow:event.${element.config.event}`, data);
      }

      // return true
      return true;
    });
    // do initial actions
    flow.action('email.send', {
      tag   : 'email',
      icon  : 'fa fa-envelope',
      title : 'Send Email',
    }, (action, render) => {

    }, async (opts, element, data) => {
      // set config
      element.config = element.config || {};

      // clone data
      const newData = Object.assign({}, data);

      // send model
      if (newData.model instanceof Model) {
        // sanitise model
        newData.model = await newData.model.sanitise();
      }

      //Prevent send email in Dev
      if (config.get('flowemail')) {
        // send email
        await emailHelper.send((tmpl.tmpl(element.config.to || '', newData)).split(',').map(i => i.trim()), 'blank', {
          body    : tmpl.tmpl(element.config.body || '', newData),
          subject : tmpl.tmpl(element.config.subject || '', newData),
        });
      }
      // return true
      return true;
    });
    flow.action('hook.trigger', {
      tag   : 'hook',
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
    flow.action('model.query', {
      tag   : 'model-query',
      icon  : 'fa fa-plus',
      title : 'Find Model(s)',
    }, (action, render) => {

    }, async (opts, element, data) => {
      // query for data
      const Model = model(element.config.model);

      // create query
      let query = Model;

      // sanitise model
      if (data.model) data.model = await data.model.sanitise();

      // loop queries
      element.config.queries.forEach((q) => {
        // get values
        const { method, type } = q;
        let { key, value } = q;

        // data
        key = tmpl.tmpl(key, data);
        value = tmpl.tmpl(value, data);

        // check type
        if (type === 'number') {
          // parse
          value = parseFloat(value);
        } else if (type === 'boolean') {
          // set value
          value = value.toLowerCase() === 'true';
        }

        // add to query
        if (method === 'eq' || !method) {
          // query
          query = query.where({
            [key] : value,
          });
        } else if (['gt', 'lt'].includes(method)) {
          // set gt/lt
          query = query[method](key, value);
        } else if (method === 'ne') {
          // not equal
          query = query.ne(key, value);
        }
      });

      // return true
      return (await query.limit(element.config.count || 1).find()).map((item) => {
        // clone data
        const cloneData = Object.assign({}, data, {
          model : item,
        }, {});

        // return clone data
        return cloneData;
      });
    });
    flow.action('model.set', {
      tag   : 'model-set',
      icon  : 'fa fa-plus',
      title : 'Set Value',
    }, (action, render) => {

    }, async (opts, element, { model }) => {
      // sets
      element.config.sets.forEach((set) => {
        // set values
        let { value } = set;
        const { key, type } = set;

        // check type
        if (type === 'number') {
          // parse
          value = parseFloat(value);
        } else if (type === 'boolean') {
          // set value
          value = value.toLowerCase() === 'true';
        }

        // set
        model.set(key, value);
      });

      // save toSet
      await model.save();

      // return true
      return true;
    });
    flow.action('model.clone', {
      tag   : 'model-clone',
      icon  : 'fa fa-copy',
      title : 'Clone Model',
    }, (action, render) => {

    }, async (opts, element, data) => {
      // got
      const got = data.model.get();
      delete got._id;

      // new model
      const NewModel = model(data.model.constructor.name);
      const newModel = new NewModel(got);

      // set new model
      data.model = newModel;

      // return true
      return true;
    });
    flow.action('delay', {
      tag   : 'delay',
      icon  : 'fa fa-stopwatch',
      color : 'info',
      title : 'Time Delay',
    }, (action, render) => {

    }, (opts, element, data) => {
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

      if (model && model.model) model = model.model;

      // check model
      if (model instanceof Model) {
        // get value from model
        value = await model.get(element.config.of);
      }

      // check
      if (is === 'eq' && value && String(value) !== element.config.value) {
        console.log(is +"="+value+"="+element.config.value);
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
    flow.action('filter', {
      tag   : 'filter',
      icon  : 'fa fa-filter',
      color : 'warning',
      title : 'Conditional Filter',
    }, (action, render) => {

    }, filterCheck);
    flow.action('condition.split', {
      tag   : 'split',
      icon  : 'fa fa-code-merge',
      color : 'warning',
      title : 'Conditional Split',
    }, (action, render) => {

    }, async (opts, element, ...args) => {
      // set go
      const go = await filterCheck(opts, element, ...args);

      // get children
      const children = (element.children || [])[go ? 0 : 1] || [];

      // await trigger
      await FlowHelper.run(opts.flow, children, opts, ...args);

      // return true
      return true;
    });
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
