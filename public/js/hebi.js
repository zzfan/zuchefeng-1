$().ready(function(){
  $('#brand-table a').click(function(){
    $('#brand').attr('value', this.text);
    $('#brand-modal').modal('hide');
  });
  $('#editor-save').click(function(){
    $.ajax('/cars/'+$(this).data('car-id')+'/detail',{
      type: "PUT",
      data: {
        content: $("#editor").html(),
        _csrf: $(this).data('csrf')
      },
      success: function(res) {
        console.log(res);
      }
    })
  });
});
