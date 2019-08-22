<flow-sidebar>
  <div class="eden-blocks-backdrop" if={ this.showing } onclick={ hide } />
  <div class={ 'eden-blocks-sidebar' : true, 'eden-blocks-sidebar-show' : this.showing }>
    <div class="card">
      <div class="card-header">
        <p class="lead m-0">
          Flow Builder
        </p>
        <small class="d-block">
          Drag and drop components to build your flow.
        </small>
      </div>

      <div class="card-body" if={ !opts.refreshing }>
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

      <div class="card-footer">
        <button type="button" class="btn btn-secondary float-right" onclick={ hide }>Close</button>
      </div>
    </div>
  </div>
  
  <script>
    // do i189n
    this.mixin('i18n');

    // set showing
    this.showing = false;

    /**
     * Shows sidebar
     */
    show() {
      // set showing
      this.showing = true;

      // update
      this.update();
    }

    /**
     * Shows sidebar
     */
    hide() {
      // set showing
      this.showing = false;

      // update
      this.update();
    }
    
  </script>
</flow-sidebar>
