$().ready(function(){
  $('#brand-table a').click(function(){
    $('#brand').attr('value', this.text);
    $('#brand-modal').modal('hide');
  });
  $('#editor-save').click(function(){
    console.log($('#editor').html());
  });
});
