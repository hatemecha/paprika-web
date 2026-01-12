const defaultStatic = 'assets/static.gif'
let imageInterval = null

const initHomePage = () => {
  const tvScreen = document.getElementById('tv-screen')
  const navLinks = document.querySelectorAll('.nav-link')
  
  if (!tvScreen || navLinks.length === 0) return

  const checkDeviceAndSetup = () => {
    const isMobile = window.innerWidth <= 768
    
    if (imageInterval) {
      clearInterval(imageInterval)
      imageInterval = null
    }
    
    navLinks.forEach(link => {
      link.removeEventListener('mouseenter', handleMouseEnter)
      link.removeEventListener('mouseleave', handleMouseLeave)
    })
    
    if (isMobile) {
      const images = Array.from(navLinks).map(link => link.getAttribute('data-image'))
      let currentIndex = 0
      
      const changeImage = () => {
        if (tvScreen && images.length > 0) {
          tvScreen.src = images[currentIndex]
          currentIndex = (currentIndex + 1) % images.length
        }
      }
      
      changeImage()
      imageInterval = setInterval(changeImage, 1000)
    } else {
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', handleMouseEnter)
        link.addEventListener('mouseleave', handleMouseLeave)
      })
    }
  }

  const handleMouseEnter = (e) => {
    const imagePath = e.currentTarget.getAttribute('data-image')
    if (tvScreen) {
      tvScreen.src = imagePath
    }
  }

  const handleMouseLeave = () => {
    if (tvScreen) {
      tvScreen.src = defaultStatic
    }
  }

  checkDeviceAndSetup()
  window.addEventListener('resize', checkDeviceAndSetup)
}

const initFooter = () => {
  const currentYearElement = document.getElementById('current-year')
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initHomePage()
  initFooter()
})

