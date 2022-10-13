document.getElementById("volume").setAttribute(
"slider","min: 0,
  max: 100,
  value: 0,
  range: "min",
  slide: function(event, ui) {
    setVolume(ui.value / 100);
} ")

function setVolume(myVolume) {
  var myMedia = document.getElementById('myMedia');
  myMedia.volume = myVolume;
}