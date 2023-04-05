/*!
 * rxslider.js v1.2.1
 * (c) 2022-2023 | github.com/reacton-js
 * Released under the MIT License.
 */
'use strict'

!function() {
  // удаляет класс у всех дочерних элементов кроме игнорируемых
  function removeClass(parent, name, ignored) {
    for (const child of parent.children) {
      if (child !== ignored) {
        child.classList.remove(name)
      }
    }
  }

  // перемещает скролл к позиции слайда
  function scrollView(slide, behavior = 'smooth') {
    slide.parentElement.scrollTo({
      left: slide.offsetLeft,
      behavior
    })
  }

  // перемещает слайд в зависимости от направления
  function moveSlide(current, slides, nav, store, effect, isPrev) {
    // получить предыдущий/следующий слайд
    current = isPrev ? current.previousElementSibling : current.nextElementSibling
    
    // если слайд не получен
    if (!current) {
      // получить последний/первый слайд
      const slide = isPrev ? slides.lastElementChild : slides.firstElementChild

      // добавить его в начало/конец
      isPrev ? slides.prepend(slide) : slides.append(slide)

      // сдвинуть следующий/предыдущий слайд к стартовой позиции
      scrollView(isPrev ? slide.nextElementSibling : slide.previousElementSibling, 'instant')

      // сделать последний/первый слайд текущим
      current = slide
    }

    // удалить активный класс у всех кнопок навигации
    removeClass(nav, 'rxslider__active')

    // добавить кнопке навигации из хранилища активный класс
    store.get(current).classList.add('rxslider__active')

    // сдвинуть текущий слайд к стартовой позиции
    scrollView(current)

    // если слайдеру добавлен эффектный класс
    if (effect) {
      // удалить эффектный класс у всех слайдов
      removeClass(slides, effect)

      // добавить эффектный класс текущему слайду
      current.classList.add(effect)
    }

    // вернуть текущий слайд
    return current
  }

  // обновляет интервал прокрутки слайдов
  function updateInterval(id, current, slides, nav, store, effect, back, time) {
    // удалить текущий интервал
    clearInterval(id)

    // вернуть новый интервал прокрутки слайдов
    return setInterval(() => current.el = moveSlide(current.el, slides, nav, store, effect, back), time)
  }

  
  // возвращает функцию для обработчика перемещения указателя
  function getPointerMove(coords, slides, prev, next, sens, subX = 0) {
    return function pointerMove(e) {
      // определить разность текущей и нажатой координаты по оси X
      subX = e.offsetX - coords.downX

      // если разность больше ширины слайдера делённой на чувствительность
      if (subX > slides.offsetWidth / sens) {
        // удалить обработчик перемещения указателя
        slides.removeEventListener('pointermove', pointerMove)

        // вызвать обработчик для кнопки Назад
        prev.click()
      }
      // иначе, если разность меньше ширины слайдера делённой на чувствительность
      else if (subX < -(slides.offsetWidth / sens)) {
        // удалить обработчик перемещения указателя
        slides.removeEventListener('pointermove', pointerMove)

        // вызвать обработчик для кнопки Вперёд
        next.click()
      }
    }
  }

  // возвращает функцию для обработчика нажатия кнопки/пальца
  function getEventDown(slides, pointerMove) {
    return function(e) {
      // если вызывается событие нажатия кнопки мышки
      if (e.type === 'mousedown') {
        e.preventDefault() // отменить действие по умолчанию
      }

      // добавить класс перемещения для слайдера
      slides.classList.add('rxslider__slides--move')

      // добавить обработчик перемещения указателя для слайдера
      slides.addEventListener('pointermove', pointerMove)
    }
  }

  // возвращает функцию для обработчика отпускания кнопки/пальца
  function getEventUp(slides, pointerMove)  {
    return function() {
      // удалить класс перемещения для слайдера
      slides.classList.remove('rxslider__slides--move')
      
      // удалить обработчик перемещения указателя для слайдера
      slides.removeEventListener('pointermove', pointerMove)
    }
  }
  

  // определить хранилище обратных вызовов
  const callbacks = new Set()

  // определить регулярное выражение для поиска эффектных классов
  const regEffect = /rxslider--/

  // получить все слайдеры в документе
  const rxsliders = document.querySelectorAll('.rxslider')

  // перебрать полученные слайдеры
  for (const slider of rxsliders) {
    const prev = slider.querySelector('.rxslider__prev') // кнопка Назад
    const next = slider.querySelector('.rxslider__next') // кнопка Вперёд
    const stop = slider.dataset.hasOwnProperty('stop') // датчик отмены автозапуска
    const back = slider.dataset.hasOwnProperty('back') // датчик обратного направления
    const effect = [...slider.classList].find(cls => regEffect.test(cls)) // эффектный класс
    const slides = slider.querySelector('.rxslider__slides') // родитель слайдов
    const time = parseFloat(slider.dataset.time) || 3000 // временной интервал
    const sens = parseFloat(slider.dataset.sens) || 10 // чувствительность слайдера
    const current = { el: slides.firstElementChild } // текущий слайд
    const store = new WeakMap() // хранилище кнопок навигации

    let idInterval // ID интервала обновления
    let idTimeout // ID таймера удаления
    let delay // задержка удаления

    // если слайдеру добавлен эффектный класс
    if (effect) {
      // добавить эффектный класс текущему слайду
      current.el.classList.add(effect)

      // определить задержку для таймера удаления эффектных классов
      delay = parseFloat(window.getComputedStyle(current.el).transitionDuration) * 1000 / 4
    }

    // создать панель навигации
    const nav = document.createElement('nav')

    // добавить панели элементный класс
    nav.classList.add('rxslider__nav')

    // перебрать все слайды из родительского элемента
    for (const slide of slides.children) {
      // создать новую кнопку навигации
      const button = document.createElement('button')

      // если перебираемый в цикле слайд является текущим
      if (slide === current.el) {
        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')
      }

      // определить обработчик для кнопки навигации
      button.addEventListener('click', () => {
        // если автозапуск не отменялся
        if (!stop) {
          // определить новый интервал прокрутки слайдов
          idInterval = updateInterval(idInterval, current, slides, nav, store, effect, back, time)
        }

        // сделать этот слайд текущим
        current.el = slide

        // удалить активный класс у всех кнопок навигации
        removeClass(nav, 'rxslider__active')

        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')

        // сдвинуть текущий слайд к стартовой позиции
        scrollView(slide)

        // если слайдеру добавлен эффектный класс и определена задержка
        if (effect && delay) {
          // добавить эффектный класс всем слайдам
          for (const child of slides.children) {
            child.classList.add(effect)
          }

          // если таймер удаления определён
          if (idTimeout) {
            // удалить текущий таймер
            clearTimeout(idTimeout)
          }

          // удалить эффектный класс у всех слайдов кроме текущего
          idTimeout = setTimeout(() => removeClass(slides, effect, current.el), delay)
        }
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
      // если автозапуск не отменялся
      if (!stop) {
        // определить новый интервал прокрутки слайдов
        idInterval = updateInterval(idInterval, current, slides, nav, store, effect, back, time)
      }

      // сдвинуть предыдущий слайд и сделать его текущим
      current.el = moveSlide(current.el, slides, nav, store, effect, true)
    })


    // определить обработчик для кнопки Вперёд
    next.addEventListener('click', () => {
      // если автозапуск не отменялся
      if (!stop) {
        // определить новый интервал прокрутки слайдов
        idInterval = updateInterval(idInterval, current, slides, nav, store, effect, back, time)
      }

      // сдвинуть следующий слайд и сделать его текущим
      current.el = moveSlide(current.el, slides, nav, store, effect)
    })


    // определить объект для нажатой координаты
    const coords = { downX: 0 }

    // определить функцию для обработчика перемещения указателя
    const pointerMove = getPointerMove(coords, slides, prev, next, sens)

    // определить функцию для обработчика нажатия кнопки/пальца
    const eventDown = getEventDown(slides, pointerMove)

    // определить функцию для обработчика отпускания кнопки/пальца
    const eventUp = getEventUp(slides, pointerMove)

    // определить нажатую координату по оси X во время активации курсора
    slides.addEventListener('pointerdown', e => coords.downX = e.offsetX)
    
    // определить обработчик нажатия кнопки мышки для слайдера
    slides.addEventListener('mousedown', eventDown)

    // определить обработчик касания пальца для слайдера
    slides.addEventListener('touchstart', eventDown)

    // определить обработчик отпускания кнопки мышки для слайдера
    slides.addEventListener('mouseup', eventUp)
    
    // определить обработчик отпускания пальца для слайдера
    slides.addEventListener('touchend', eventUp)


    // если автозапуск не отменялся
    if (!stop) {
      // определить новый интервал прокрутки слайдов
      idInterval = updateInterval(idInterval, current, slides, nav, store, effect, back, time)
    }

    // добавить обратный вызов в хранилище
    callbacks.add(() => scrollView(current.el, 'instant'))
  }

  
  // при изменении размера окна, вызвать обратные вызовы из хранилища
  window.addEventListener('resize', () => callbacks.forEach(cb => cb()))
}()