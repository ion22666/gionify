(function() {
  $("#volume_range").slider({
    range: "min",
    min:0,
    max: 100,
    value: 50,
    slide: function(e, ui) {
      player.volume = ui.value/100;
      $("#currentVal").html(ui.value);
    }
  });

}).call(this);
