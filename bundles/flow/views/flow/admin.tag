<flow-admin-page>
  <div class="page page-fundraiser">

    <admin-header title="Manage Flows">
      <yield to="right">
        <a href="/admin/flow/create" class="btn btn-lg btn-success">
          <i class="fa fa-plus ml-2"></i> Create Flow
        </a>
      </yield>
    </admin-header>
    
    <div class="container-fluid">
    
      <grid ref="grid" grid={ opts.grid } table-class="table table-striped table-bordered" title="Flow Grid" />
    
    </div>
  </div>
</flow-admin-page>
