'use strict'

!function() {
  // перемещает слайд к стартовой позиции
  function scrollView(slide, behavior = 'smooth') {
    slide.parentElement.scrollTo({
      left: slide.offsetLeft,
      behavior
    })
  }

  // удаляет старый интервал и устанавливает новый
  function stopInterval(id, next, time) {
    clearInterval(id)
    return setInterval(() => next.click(), time)
  }

  // удаляет класс у кнопок навигации
  function removeClass(nav) {
    for (const btn of nav.children) {
      btn.classList.remove('rxslider__active')
    }
  }
  
  // получить все слайдеры в документе
  const rxsliders = document.querySelectorAll('.rxslider')

  // перебрать полученные слайдеры
  for (const slider of rxsliders) {
    const prev = slider.querySelector('.rxslider__prev') // кнопка Назад
    const next = slider.querySelector('.rxslider__next') // кнопка Вперёд
    const stop = slider.dataset.hasOwnProperty('stop') // датчик автозапуска
    const slides = slider.querySelector('.rxslider__slides') // родитель слайдов
    const time = slider.dataset.time || 3000 // временной интервал
    const store = new WeakMap() // хранилище кнопок навигации
    let current = slides.firstElementChild // текущий слайд
    let idInterval // ID интервала

    // создать панель навигации
    const nav = document.createElement('nav')

    // добавить панели элементный класс
    nav.classList.add('rxslider__nav')

    // перебрать все слайды из родительского элемента
    for (const slide of slides.children) {
      // создать новую кнопку навигации
      const button = document.createElement('button')

      // если перебираемый в цикле слайд является текущим
      if (slide === current) {
        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')
      }

      // определить обработчик для кнопки навигации
      button.addEventListener('click', () => {
        // если автозапуск не отменялся, то обновить интервал прокрутки слайдов
        if (!stop) idInterval = stopInterval(idInterval, next, time)

        // удалить класс у всех кнопок навигации
        removeClass(nav)
        
        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')
        
        // сделать перебираемый в цикле слайд текущим
        current = slide
        
        // сдвинуть текущий слайд к стартовой позиции
        scrollView(current)
      })

      // добавить перебираемый в цикле слайд и кнопку навигации в хранилище
      store.set(slide, button)
      
      // добавить кнопку навигации в панель
      nav.append(button)
    }

    // добавить панель в слайдер
    slider.append(nav)
    

    // определить обработчик для кнопки Назад
    prev.addEventListener('click', () => {
      // если автозапуск не отменялся, то обновить интервал прокрутки слайдов
      if (!stop) idInterval = stopInterval(idInterval, next, time)

      // получить предыдущий слайд
      current = current.previousElementSibling
      
      // если слайд не получен
      if (!current) {
        // получить последний слайд
        const last = slides.lastElementChild

        // добавить его в начало
        slides.prepend(last)

        // сдвинуть следующий слайд к стартовой позиции
        scrollView(last.nextElementSibling, 'instant')

        // сделать последний слайд текущим
        current = last
      }

      // удалить класс у всех кнопок навигации
      removeClass(nav)

      // добавить кнопке навигации из хранилища активный класс
      store.get(current).classList.add('rxslider__active')

      // сдвинуть текущий слайд к стартовой позиции
      scrollView(current)
    })


    // определить обработчик для кнопки Вперёд
    next.addEventListener('click', () => {
      // если автозапуск не отменялся, то обновить интервал прокрутки слайдов
      if (!stop) idInterval = stopInterval(idInterval, next, time)

      // получить следующий слайд
      current = current.nextElementSibling
      
      // если слайд не получен
      if (!current) {
        // получить первый слайд
        const first = slides.firstElementChild

        // добавить его в конец
        slides.append(first)

        // сдвинуть предыдущий слайд к стартовой позиции
        scrollView(first.previousElementSibling, 'instant')
        
        // сделать первый слайд текущим
        current = first
      }

      // удалить класс у всех кнопок навигации
      removeClass(nav)

      // добавить кнопке навигации из хранилища активный класс
      store.get(current).classList.add('rxslider__active')

      // сдвинуть текущий слайд к стартовой позиции
      scrollView(current)
    })


    // если автозапуск не отменялся, то определить интервал прокрутки слайдов
    if (!stop) idInterval = setInterval(() => next.click(), time)

    // при изменении размера окна, сдвинуть слайд к стартовой позиции
    window.addEventListener('resize', () => scrollView(current, 'instant'))
  }
}()