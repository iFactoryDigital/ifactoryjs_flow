<flow-admin-update-page>
  <div class="page page-fundraiser">

    <admin-header title="Manage { this.flow.title ? '"' + this.flow.title + '"' : 'Flow' }">
      <yield to="right">
      
      </yield>
    </admin-header>
    
    <div class="container-fluid">

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
            <div class="card-body">
              <p class="lead mb-3">
                Actions
              </p>

              <div class="card card-flow card-action mb-2" each={ action, i in opts.config.actions }>
                <div class="card-icon">
                  <i class={ action.opts.icon } />
                </div>
                <div class="card-body">
                  { action.opts.title }
                </div>
              </div>

              <p class="lead my-3">
                Timing
              </p>

              <div class="card card-flow card-timing mb-2" each={ timing, i in opts.config.timings }>
                <div class="card-icon">
                  <i class={ timing.opts.icon } />
                </div>
                <div class="card-body">
                  { timing.opts.title }
                </div>
              </div>
              
              <p class="lead my-3">
                Logic
              </p>

              <div class="card card-flow card-logic mb-2" each={ logic, i in opts.config.logics }>
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

        <div class="col">

          <div class="row">
            <div class="col-4 mx-auto">
              
              <div class="card card-flowing card-trigger bg-light">
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

                <div if={ getTrigger() } data-is="flow-trigger-{ getTrigger().type }" trigger={ trigger } flow={ flow } on-data={ onDataTrigger } />
              </div>

            </div>
          </div>

        </div>
      </div>
    
    </div>
  </div>

  <script>
    // set flow
    this.flow = opts.flow || {};

    /**
     * on change trigger
     *
     * @param {Event} e
     */
    onChangeTrigger(e) {
      // set trigger
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
      this.flow.trigger.data = data;

      // update view
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

  </script>
</flow-admin-update-page>
