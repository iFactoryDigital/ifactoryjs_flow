<flow-section>

  <div class="d-flex">
    <div each={ col, i in cols } class="flow-elements py-4 { !(getOpts().children[col] || []).length ? ' flow-elements-empty' : '' }" position={ opts.position === 'tree' ? '' : opts.position + '.' + i }>

      <div each={ element, a in getOpts().children[col] } class="flow-element" element-class={ getPosition(col) } data-is="flow-{ element.tag }" uuid={ getOpts().getElement(element).uuid } set-element={ getOpts().setElement } get-element={ getOpts().getElement } element={ getOpts().getElement(element) } child={ element } on-sidebar={ getOpts().onSidebar } position="{ getOpts().position === 'tree' ? '' : getOpts().position + '.' + i + '.' }{ a }" />

      <div class="flow-add">
        <button class="btn btn-lg btn-block btn-secondary" onclick={ opts.onSidebar }>
          Add Element
        </button>
      </div>
    </div>
  </div>

  <script>
    // set script value
    this.cols = [];

    // add columns
    for (let i = 0; i < parseInt(opts.columns); i++) {
      // push i
      this.cols.push(i);
    }

    /**
     * returns opts
     */
    getOpts() {
      return opts;
    }

    /**
     * returns col size
     */
    getPosition(i) {
      // set col
      let col = '';
      const cols = parseInt(opts.columns);

      // pre/append float
      if (i === cols - 1) {
        col += ' mr-auto';
      }
      if (i === 0) {
        col += ' ml-auto';        
      }

      if (cols > 1) {
        // check first
        if (i === 0) {
          col += ' mr-2';
        }
        if (i <= cols - 1 && i > 0) {
          col += ' mx-2';
        }
        if (i === cols - 1) {
          col += ' ml-2';
        }
      }

      // return
      return col;
    }
  </script>
</flow-section>