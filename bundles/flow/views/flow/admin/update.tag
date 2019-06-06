<flow-admin-update-page>
  <div class="page page-fundraiser">

    <admin-header title="Manage { this.flow.title ? '"' + this.flow.title + '"' : 'Flow' }" has-update={ this.hasUpdate } on-save={ save } loading={ loading }>
      <yield to="right">
        <button class={ 'btn btn-lg btn-success' : true, 'disabled' : opts.loading() } disabled={ opts.loading() } if={ opts.hasUpdate } onclick={ opts.onSave }>
          { opts.loading('saving') ? 'Saving...' : 'Save' }
        </button>
      </yield>
    </admin-header>
    
    <div class="container-fluid" ref="placement">

      <div class="row">
        <div class="col-3">

          <div class="card">
            <div class="card-header">
              <p class="lead m-0">
                Flow Builder
              </p>
              <small class="d-block">
                Drag and drop components to build your flow.
              </small>
            </div>
            <div class="card-body" if={ !this.refreshing }>
              <p class="lead mb-3">
                Actions
              </p>

              <div class="builder-elements">
                <div class="card card-flow card-action mb-2" each={ action, i in opts.config.actions } type={ action.type } for="action">
                  <div class="card-icon">
                    <i class={ action.opts.icon } />
                  </div>
                  <div class="card-body">
                    { action.opts.title }
                  </div>
                </div>
              </div>

              <p class="lead my-3">
                Timing
              </p>

              <div class="builder-elements">
                <div class="card card-flow card-timing mb-2" each={ timing, i in opts.config.timings } type={ timing.type } for="timing">
                  <div class="card-icon">
                    <i class={ timing.opts.icon } />
                  </div>
                  <div class="card-body">
                    { timing.opts.title }
                  </div>
                </div>
              </div>
              
              <p class="lead my-3">
                Logic
              </p>

              <div class="builder-elements">
                <div class="card card-flow card-logic mb-2" each={ logic, i in opts.config.logics } type={ logic.type } for="logic">
                  <div class="card-icon">
                    <i class={ logic.opts.icon } />
                  </div>
                  <div class="card-body">
                    { logic.opts.title }
                  </div>
                </div>
              </div>
              
            </div>
          </div>

        </div>

        <div class="col-9" ref="flow">

          <div class="flow-container" ref="flow-container">
            <div class="flow-inner" style="{ this.width ? 'width : ' + this.width + 'rem' : '' }">
              <!-- trigger -->

              <div class="card card-flowing card-trigger bg-light mb-4">
                <div class="card-header">
                  <div class="card-icon">
                    <i class="fa fa-bolt" />
                  </div>

                  Trigger on
                  
                  <eden-select class="d-inline-block w-auto ml-1" onchange={ onChangeTrigger } triggers={ opts.config.triggers } get-trigger={ getTrigger }>
                    <option value="">Select Trigger</option>
                    <option each={ trigger, i in opts.triggers } value={ trigger.type } selected={ (opts.getTrigger() || {}).type === trigger.type }>{ trigger.opts.title }</option>
                  </eden-select>
                </div>
                <div class="card-body text-center" if={ !getTrigger() }>
                  Please select your trigger
                </div>

                <div if={ getTrigger() } data-is="flow-trigger-{ getTrigger().type }" item={ getTrigger() } flow={ flow } on-data={ onDataTrigger } />
              </div>

              <!-- / trigger -->

              <div class="d-flex">
                <flow-section position="tree" class="d-block mx-auto" columns="1" get-element={ getElement } set-element={ setElement } children={ { 0 : this.flow.tree } } if={ !this.refreshing } />
              </div>
            </div>
          </div>

        </div>
      </div>
    
    </div>
  </div>

  <script>
    // mixins
    this.mixin('loading');

    // require deps
    const uuid      = require('uuid');
    const Scrollbar = require('perfect-scrollbar');

    // set flow
    this.flow       = opts.flow || {};
    this.hasUpdate  = false;
    this.refreshing = false;

    // set flow tree
    if (!this.flow.render) {
      // set flow tree
      this.flow.render = {};
    }

    /**
     * on change trigger
     *
     * @param {Event} e
     */
    onChangeTrigger(e) {
      // set trigger
      this.hasUpdate = true;
      this.flow.trigger = {
        type : jQuery(e.target).val(),
        data : {},
      };

      // update view
      this.update();
    }

    /**
     * on change trigger
     *
     * @param {Event} e
     */
    onDataTrigger(data) {
      // set data
      this.hasUpdate = true;
      this.flow.trigger.data = data;

      // update view
      this.update();
    }

    /**
     * returns trigger
     *
     * @return {*}
     */
    getElement(el) {
      // return nothing
      return Object.assign({}, el, this.flow.items.find(i => i.uuid === el.uuid), {
        data : this.flow.render[el.uuid],
      });
    }

    /**
     * returns trigger
     *
     * @return {*}
     */
    setElement(id, el) {
      // return nothing
      const item = this.flow.items.find(i => i.uuid === id);

      // loop keys
      for (let key in el) {
        // set value
        item[key] = el[key];
      }

      // set update
      this.hasUpdate = true;
      
      // update
      this.update();
    }

    /**
     * returns trigger
     *
     * @return {*}
     */
    getTrigger() {
      // return nothing
      if (!this.flow.trigger) return;

      // get config trigger
      const triggerConfig = opts.config.triggers.find(t => t.type === this.flow.trigger.type);

      // check trigger config
      if (!triggerConfig) return;

      // return got trigger
      return Object.assign({}, this.flow.trigger, triggerConfig);
    }

    /**
     * Initialize draggable logic 
     */
    initDraggable() {
      // require dragula
      const dragula = require('dragula');
      const dotProp = require('dot-prop-immutable');

      // do dragula
      this.dragula = dragula([...(jQuery('.builder-elements', this.refs.placement).toArray()), ...(jQuery('.flow-elements', this.refs.placement).toArray())], {
        moves : (el, container, handle) => {
          return true;
        },
        copy : (el, container) => {
          // check container class
          return jQuery(container).hasClass('builder-elements');
        }
      }).on('drop', async (el, target, source, sibling) => {
        // set update
        this.hasUpdate = true;

        // check if drop to left
        if (jQuery(el).closest('.builder-elements').length) {
          // check position
          if (jQuery(el).attr('position')) {
            // delete from position
            this.flow.tree = dotProp.delete(this.flow.tree, jQuery(el).attr('position'));
          }

          // update
          this.refreshing = true;
          this.update();
          this.refreshing = false;
          this.update();

          // return
          return;
        }

        // target/source
        target = jQuery(target);
        source = jQuery(source);

        // check position
        if (jQuery(el).attr('position')) {
          // delete from position
          this.flow.tree = dotProp.delete(this.flow.tree, jQuery(el).attr('position'));
        }

        // set position
        const position = target.attr('position') || '';
        const elements = await Promise.all(jQuery('> .flow-element, > .card-flow', target).toArray().map(async (el, i) => {
          // set values
          const currentPos  = jQuery(el).attr('position');
          const currentUuid = jQuery(el).attr('uuid');
          const currentItem = (currentUuid ? this.flow.items.find(item => item.uuid === currentUuid) : {}) || {};
          const currentTree = (currentUuid ? (currentPos.includes('.') ? dotProp.get(this.flow.tree, currentPos) : this.flow.tree[currentPos]) : {}) || {};

          // set priority
          let element = Object.assign(currentItem, currentTree, {
            priority : i,
          });

          // set uuid
          if (!element.type) {
            // set values
            element.for  = jQuery(el).attr('for');
            element.type = jQuery(el).attr('type');
          } 

          // set uuid
          if (!element.uuid) {
            // element is new
            element.uuid = uuid();

            // load element field
            const res = (await eden.router.post('/admin/flow/field', element)).result;

            // set element
            element = res.action;
  
            // set render data
            this.flow.render[element.uuid] = res.data;
          }

          // return element
          return element;
        }));

        // in parent
        if (!(position || '').length) {
          // set tree as elements
          this.flow.tree = elements;
        } else {
          // set elements
          this.flow.tree = dotProp.set(this.flow.tree, position, elements);
        }

        // flattens a tree
        const flatten = (children) => {
          // get arr
          const arr = [];

          // return mappend children
          children.map((child) => {
            // set children
            if (child.children) {
              // loop children
              for (let key in child.children) {
                // push to flattened array
                arr.push(...(flatten(child.children[key])));
              }
            }

            // clone child
            const cloneChild = JSON.parse(JSON.stringify(Object.assign({}, child, this.flow.items.find(item => item.uuid === child.uuid) || {})));

            // delete fields
            delete cloneChild.children;

            // push child
            arr.push(cloneChild);
          });

          // return array
          return arr;
        };

        // flatten tree
        this.flow.items = flatten(this.flow.tree);

        // update
        this.refreshing = true;
        this.update();
        this.refreshing = false;
        this.update();
      }).on('drag', (el, source) => {
        
      }).on('dragend', () => {
        
      }).on('over', function (el, container) {
        
      }).on('out', function (el, container) {
        
      });

      // on update
      this.on('updated', () => {
        // set containers
        this.dragula.containers = [...(jQuery('.builder-elements', this.refs.placement).toArray()), ...(jQuery('.flow-elements', this.refs.placement).toArray())];
      });
    }

    /**
     * Initialize draggable logic 
     */
    initScrollbar() {
      // check width
      checkWidth = (children) => {
        // reduce for current level width addition value
        // how many branches max split off this trunk
        let topSplit = children.reduce((top, child) => {
          // check width
          if (Object.keys(child.children || {}).length > top) return Object.keys(child.children).length;

          // return top
          return top;
        }, 0);

        // reduce every branch off this trunks own width value
        // how many branches split off this trunk's branches
        const count = children.filter((child) => Object.keys(child.children || {}).length).reduce((accum, item) => {
          // return accumulated recursive width
          return accum + Object.values(item.children).reduce((a, children) => {
            // return recursive width
            return a + checkWidth(children || []);
          }, 0);
        }, 0) + topSplit;

        // we take off one as we don't need to count ourselves
        if ((count - 1) < 0) return 0;

        // reutrn width add
        return count - 1;
      };

      // add to initial 1 width
      const width = 1 + checkWidth(this.flow.tree || []);

      // set width
      this.width = (width * 36);

      // set up scrollbar
      if (!this.scrollbar) {
        // do scrollbar
        this.scrollbar = new Scrollbar(this.refs['flow-container']);
      }
    }

    /**
     * saves flow
     */
    async save() {
      // set loading
      this.loading('saving', true);

      // load
      const flow = (await eden.router.post(`/admin/flow/${this.flow.id ? this.flow.id + '/update?json=true' : 'create?json=true'}`, this.flow)).result;

      // set flow
      this.flow = flow;
      this.hasUpdate = false;

      // replace history
      const state = Object.assign({}, {
        prevent : true,
      }, eden.router.history.location.state);

      // replace url
      eden.router.history.replace({
        state,
        pathname : `/admin/flow/${this.flow.id ? this.flow.id + '/update' : 'create'}`,
      });

      // update
      this.loading('saving', false);
      this.refreshing = true;
      this.update();
      this.refreshing = false;
      this.update();
    }

    /**
     * On mount
     */
    this.on('mount', () => {
      // check frontend
      if (!this.eden.frontend) return; 

      // do draggable
      this.initDraggable();
      this.initScrollbar();

      // on resize
      jQuery(window).on('resize', this.initScrollbar);
    });

    /**
     * On mount
     */
    this.on('update', () => {
      // check frontend
      if (!this.eden.frontend) return; 

      // do draggable
      this.initScrollbar();
    });

    /**
     * On mount
     */
    this.on('unmount', () => {
      // check frontend
      if (!this.eden.frontend) return;

      // on resize
      jQuery(window).off('resize', this.initScrollbar);
    });

  </script>
</flow-admin-update-page>
