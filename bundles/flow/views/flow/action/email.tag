<flow-action-email>
  <div class="card card-flowing card-{ opts.element.color || 'primary' } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      <div class="form-group">
        <label>
          Email Recipient(s)
        </label>
        <input class="form-control" ref="to" value={ (opts.element.config || {}).to } type="text" onchange={ onChange } />
        <small>Seperate with <code>,</code></small>
      </div>
      <div class="form-group">
        <label>
          Email Subject
        </label>
        <input class="form-control" ref="subject" value={ (opts.element.config || {}).subject } type="text" onchange={ onChange } />
      </div>
      <editor ref="body" label="Email Body" content={ (opts.element.config || {}).body } />
    </div>
  </div>

  <script>
    /**
     * on change timing
     *
     * @param {Event} e
     */
    onChange(e) {
      // set element
      opts.setElement(opts.element.uuid, {
        config : {
          to      : this.refs.to.value,
          body    : this.refs.body.val(),
          subject : this.refs.subject.value,
        }
      });
    }

    // do events
    this.on('mount', () => {
      // check frontend
      if (!this.eden.frontend) return;

      // on change
      this.refs.body.on('change', this.onChange);
    });
    this.on('unmount', () => {
      // check frontend
      if (!this.eden.frontend) return;

      // on change
      if (this.refs.body) this.refs.body.removeListener('change', this.onChange);
    });
  </script>
</flow-action-email>