const volume = document.querySelector('.volume')
const audio = document.querySelector('.audio-player')
const volume_container = document.querySelector('.volume_container')
const volume_number = document.querySelector('.volume_number')

const patratu = document.querySelector('::-webkit-slider-thumb')

volume.addEventListener('change',function(e) {
  
  audio.volume = e.currentTarget.value / 100;
  volume_number.textContent=e.currentTarget.value
})

volume.addEventListener('mouseover',()=>{patratu.style.background = 'white'})
volume.addEventListener('mouseout',()=>{patratu.style.height = '0vh'})