$().ready(function(){
  $('#brand-table a').click(function(){
    $('#brand').attr('value', this.text);
    $('#brand-modal').modal('hide');
  });
});
