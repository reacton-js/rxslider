/*!
 * rxslider.js v1.1.0
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
    const time = slider.dataset.time || 3000 // временной интервал
    const store = new WeakMap() // хранилище кнопок навигации
    
    let current = slides.firstElementChild // текущий слайд
    let idInterval // ID интервала обновления
    let idTimeout // ID таймера удаления
    let delay // задержка удаления

    // если слайдеру добавлен эффектный класс
    if (effect) {
      // добавить эффектный класс текущему слайду
      current.classList.add(effect)

      // определить задержку для таймера удаления эффектных классов
      delay = parseFloat(window.getComputedStyle(current).transitionDuration) * 1000 / 4
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
      if (slide === current) {
        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')
      }

      // определить обработчик для кнопки навигации
      button.addEventListener('click', () => {
        // если автозапуск не отменялся
        if (!stop) {
          // удалить текущий интервал
          clearInterval(idInterval)

          // определить новый интервал прокрутки слайдов
          idInterval = setInterval(() => current = moveSlide(current, slides, nav, store, effect, back), time)
        }

        // сделать этот слайд текущим
        current = slide

        // удалить активный класс у всех кнопок навигации
        removeClass(nav, 'rxslider__active')

        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')

        // сдвинуть текущий слайд к стартовой позиции
        scrollView(slide)

        // если слайдеру добавлен эффектный класс
        if (effect) {
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
          idTimeout = setTimeout(() => removeClass(slides, effect, current), delay)
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
        // удалить текущий интервал
        clearInterval(idInterval)

        // определить новый интервал прокрутки слайдов
        idInterval = setInterval(() => current = moveSlide(current, slides, nav, store, effect, back), time)
      }

      // сдвинуть предыдущий слайд и сделать его текущим
      current = moveSlide(current, slides, nav, store, effect, true)
    })


    // определить обработчик для кнопки Вперёд
    next.addEventListener('click', () => {
      // если автозапуск не отменялся
      if (!stop) {
        // удалить текущий интервал
        clearInterval(idInterval)

        // определить новый интервал прокрутки слайдов
        idInterval = setInterval(() => current = moveSlide(current, slides, nav, store, effect, back), time)
      }

      // сдвинуть следующий слайд и сделать его текущим
      current = moveSlide(current, slides, nav, store, effect)
    })


    // если автозапуск не отменялся
    if (!stop) {
      // определить интервал прокрутки слайдов
      idInterval = setInterval(() => current = moveSlide(current, slides, nav, store, effect, back), time)
    }

    // добавить обратный вызов в хранилище
    callbacks.add(() => scrollView(current, 'instant'))
  }

  
  // определить датчик выполнения
  let teak = true

  // при изменении размера окна, вызвать обратные вызовы из хранилища
  window.addEventListener('resize', () => {
    // если датчик включен
    if (teak) {
      window.requestAnimationFrame(() => {
        // выполнить обратные вызовы всех слайдеров
        callbacks.forEach(cb => cb())

        // включить датчик
        teak = true
      })

      // выключить датчик
      teak = false
    }
  })
}()