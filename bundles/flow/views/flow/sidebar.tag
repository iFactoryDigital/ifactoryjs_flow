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
          <div each={ action, i in opts.config.actions } type={ action.type } class="card card-flow card-action card-{ action.opts.color || 'primary' } mb-2">
            <div class="card-icon">
              <i class={ action.opts.icon } />
            </div>
            <div class="card-body">
              { action.opts.title }
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button type="button" class="btn btn-secondary float-right" onclick={ hide }>Close</button>

        <button class={ 'btn btn-lg btn-success' : true, 'disabled' : opts.loading() } disabled={ opts.loading() } if={ opts.hasUpdate } onclick={ opts.onSave }>
          { opts.loading('saving') ? 'Saving...' : 'Save' }
        </button>
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
