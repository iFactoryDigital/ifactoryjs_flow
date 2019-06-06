<flow-logic-split>
  <div class="card card-flowing card-{ opts.element.for } mb-3 { opts.elementClass }">
    <div class="card-header">
      <div class="card-icon">
        <i class={ opts.element.icon } />
      </div>

      { opts.element.title }

    </div>
    <div class="card-body">
      SUP 3
    </div>
  </div>

  <flow-section columns={ 2 } position="{ opts.position }.children" class="d-block mx-2" children={ opts.getElement(opts.element).children || {} } set-element={ opts.setElement } get-element={ opts.getElement } />

  <script>

    /**
     * on mount function
     */
    this.on('mount', () => {
      // return
      if (!this.eden.frontend) return;

      // set children
      if (!opts.child.children) {
        // set children
        opts.child.children = [
          [],
          [],
        ];

        // update
        opts.setElement(opts.element.uuid, {});
      }
    });
  </script>
</flow-logic-split>