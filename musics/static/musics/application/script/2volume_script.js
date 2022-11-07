const volume = document.querySelector('.volume')
const audio = document.querySelector('.audio_player')
const volume_container = document.querySelector('.volume_container')
const volume_number = document.querySelector('.volume_number')

const patratu = document.querySelector('::-webkit-slider-thumb')
audio.volume = volume.value/100
volume.addEventListener('click',function(e) {
  audio.volume = e.currentTarget.value / 100;
  volume_number.textContent=e.currentTarget.value
})




//volume.addEventListener('mouseover',()=>{patratu.style.background = 'white'})
//volume.addEventListener('mouseout',()=>{patratu.style.height = '0vh'})