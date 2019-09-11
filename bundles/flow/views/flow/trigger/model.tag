<flow-trigger-model>
  <div class="card-body">
    This Flow will start 

    <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeWhen } multiple={ true } when={ this.data.when || [] } placeholder="Select When">
      <option value="before" selected={ opts.when.includes('before') }>Before</option>
      <option value="after" selected={ opts.when.includes('after') }>After</option>
    </eden-select>

    the model

    <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeModel } url="/admin/flow/models" model={ this.data.model } placeholder="Select Model">
      <option if={ opts.model } value={ opts.model } selected>{ opts.model }</option>
    </eden-select>

    has been

    <eden-select class="d-inline-block w-auto ml-1 bg-light" onchange={ onChangeEvent } multiple={ true } event={ this.data.event || [] } placeholder="Select Event(s)">
      <option value="create" selected={ opts.event.includes('create') }>Created</option>
      <option value="update" selected={ opts.event.includes('update') }>Updated</option>
      <option value="remove" selected={ opts.event.includes('remove') }>Removed</option>
    </eden-select>
  </div>

  <script>
    // set data
    this.data = opts.item.data || {};

    /**
     * on change when
     *
     * @param {Event} e
     */
    onChangeWhen(e) {
      // set when
      this.data.when = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }

    /**
     * on change model
     *
     * @param {Event} e
     */
    onChangeModel(e) {
      // model
      this.data.model = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }

    /**
     * on change when
     *
     * @param {Event} e
     */
    onChangeEvent(e) {
      // set when
      this.data.event = jQuery(e.target).val();

      // on data
      opts.onData(this.data);
    }
  </script>
</flow-trigger-model>