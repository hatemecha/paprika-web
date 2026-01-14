const createHeader = (container, isHome = false, activePage = '') => {
  const titleLink = document.createElement('a')
  titleLink.href = isHome ? 'assets/cv.pdf' : 'index.html'
  titleLink.className = 'title-link'
  if (!isHome) {
    titleLink.target = ''
  } else {
    titleLink.target = '_blank'
  }

  const titleImage = document.createElement('img')
  titleImage.src = 'assets/paprika-title.webp'
  titleImage.alt = 'Paprika'
  titleImage.className = isHome ? 'title-image' : 'title-image title-image-small'
  titleLink.appendChild(titleImage)

  container.appendChild(titleLink)

  if (isHome) {
    const mainContent = document.createElement('div')
    mainContent.className = 'main-content'

    const tvWrapper = document.createElement('div')
    tvWrapper.className = 'tv-wrapper'

    const tvImage = document.createElement('img')
    tvImage.src = 'assets/oldtv.webp'
    tvImage.alt = 'TV'
    tvImage.className = 'tv-image'

    const staticOverlay = document.createElement('img')
    staticOverlay.src = 'assets/static.gif'
    staticOverlay.alt = 'Static'
    staticOverlay.className = 'static-overlay'
    staticOverlay.id = 'tv-screen'

    tvWrapper.appendChild(tvImage)
    tvWrapper.appendChild(staticOverlay)
    mainContent.appendChild(tvWrapper)

    const navLinks = document.createElement('nav')
    navLinks.className = 'nav-links'

    const pages = [
      { name: 'musica', href: 'musica.html', image: 'img/musica.webp' },
      { name: 'galeria', href: 'galeria.html', image: 'img/galeria.webp' },
      { name: 'recitales', href: '#', image: 'img/recitales.webp' },
      { name: 'nosotros', href: 'nosotros.html', image: 'img/nosotros.webp' }
    ]

    pages.forEach(page => {
      const link = document.createElement('a')
      link.href = page.href
      link.className = 'nav-link'
      link.setAttribute('data-image', page.image)
      link.textContent = page.name
      navLinks.appendChild(link)
    })

    mainContent.appendChild(navLinks)
    container.appendChild(mainContent)
  } else {
    const navHorizontal = document.createElement('nav')
    navHorizontal.className = 'nav-horizontal'

    const pages = [
      { name: 'musica', href: 'musica.html' },
      { name: 'galeria', href: 'galeria.html' },
      { name: 'recitales', href: 'index.html' },
      { name: 'nosotros', href: 'nosotros.html' }
    ]

    pages.forEach((page, index) => {
      const link = document.createElement('a')
      link.href = page.href
      link.className = 'nav-horizontal-link'
      if (activePage === page.name) {
        link.classList.add('active')
      }
      link.textContent = page.name
      navHorizontal.appendChild(link)

      if (index < pages.length - 1) {
        const separator = document.createElement('span')
        separator.className = 'nav-separator'
        separator.textContent = '|'
        navHorizontal.appendChild(separator)
      }
    })

    container.appendChild(navHorizontal)
  }
}

const createFooter = () => {
  const footer = document.createElement('footer')
  footer.className = 'footer'

  const footerContent = document.createElement('div')
  footerContent.className = 'footer-content'

  const p = document.createElement('p')
  const yearSpan = document.createElement('span')
  yearSpan.id = 'current-year'
  yearSpan.textContent = new Date().getFullYear()

  p.textContent = 'Paprika Spicy © '
  p.appendChild(yearSpan)
  p.appendChild(document.createTextNode(' hatemecha'))

  footerContent.appendChild(p)

  const socialLinks = document.createElement('div')
  socialLinks.className = 'social-links'

  const instagramLink = document.createElement('a')
  instagramLink.href = 'https://www.instagram.com/_p4prik4/'
  instagramLink.target = '_blank'
  instagramLink.rel = 'noopener noreferrer'
  instagramLink.className = 'social-link'
  instagramLink.setAttribute('aria-label', 'Instagram de PAPRIKA')
  instagramLink.innerHTML = '<i class=\'fab fa-instagram\'></i>'

  const youtubeLink = document.createElement('a')
  youtubeLink.href = 'https://www.youtube.com/playlist?list=PL_YuZMoaWvvPZUah5E_D3i9PGZ-VQEAqh'
  youtubeLink.target = '_blank'
  youtubeLink.rel = 'noopener noreferrer'
  youtubeLink.className = 'social-link'
  youtubeLink.setAttribute('aria-label', 'YouTube de PAPRIKA')
  youtubeLink.innerHTML = '<i class=\'fab fa-youtube\'></i>'

  socialLinks.appendChild(instagramLink)
  socialLinks.appendChild(youtubeLink)

  footerContent.appendChild(socialLinks)
  footer.appendChild(footerContent)
  return footer
}

