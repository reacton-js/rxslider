/*!
 * rxslider.js v1.2.5
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
  function updateInterval(id, data, slides, nav, store, effect, back, time) {
    // удалить текущий интервал
    clearInterval(id)

    // вернуть новый интервал прокрутки слайдов
    return setInterval(() => data.current = moveSlide(data.current, slides, nav, store, effect, back), time)
  }

  
  // возвращает функцию для обработчика перемещения указателя
  function getPointerMove(data, slides, prev, next, sens, subX = 0) {
    return function pointerMove(e) {
      // определить разность текущей и сохранённой координаты
      subX = e.offsetX - data.downX

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

  // возвращает функцию для обработчика нажатия указателя
  function getEventDown(data, slides, pointerMove) {
    return function(e) {
      // отменить действие по умолчанию
      e.preventDefault()
      
      // определить координату по оси X
      data.downX = e.offsetX

      // добавить обработчик перемещения указателя для слайдера
      slides.addEventListener('pointermove', pointerMove)
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
    const store = new WeakMap() // хранилище кнопок навигации
    const nav = document.createElement('nav') // панель навигации
    const data = { // объект изменяемых данных слайдера
      current: slides.firstElementChild, // текущий слайд
      downX: 0 // X-координата нажатого курсора
    }

    let idInterval // ID интервала обновления
    let idTimeout // ID таймера удаления
    let delay // задержка удаления


    // добавить панели навигации элементный класс
    nav.classList.add('rxslider__nav')

    // если слайдеру добавлен эффектный класс
    if (effect) {
      // добавить эффектный класс текущему слайду
      data.current.classList.add(effect)

      // определить задержку для таймера удаления эффектных классов
      delay = parseFloat(window.getComputedStyle(data.current).transitionDuration) * 1000 / 4
    }
    
    
    // перебрать все слайды из родительского элемента
    for (const slide of slides.children) {
      // создать новую кнопку навигации
      const button = document.createElement('button')

      // если перебираемый в цикле слайд является текущим
      if (slide === data.current) {
        // добавить кнопке навигации активный класс
        button.classList.add('rxslider__active')
      }

      // определить обработчик для кнопки навигации
      button.addEventListener('click', () => {
        // если автозапуск не отменялся
        if (!stop) {
          // определить новый интервал прокрутки слайдов
          idInterval = updateInterval(idInterval, data, slides, nav, store, effect, back, time)
        }

        // сделать этот слайд текущим
        data.current = slide

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
          idTimeout = setTimeout(() => removeClass(slides, effect, data.current), delay)
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
        idInterval = updateInterval(idInterval, data, slides, nav, store, effect, back, time)
      }

      // сдвинуть предыдущий слайд и сделать его текущим
      data.current = moveSlide(data.current, slides, nav, store, effect, true)
    })


    // определить обработчик для кнопки Вперёд
    next.addEventListener('click', () => {
      // если автозапуск не отменялся
      if (!stop) {
        // определить новый интервал прокрутки слайдов
        idInterval = updateInterval(idInterval, data, slides, nav, store, effect, back, time)
      }

      // сдвинуть следующий слайд и сделать его текущим
      data.current = moveSlide(data.current, slides, nav, store, effect)
    })


    // определить функцию для обработчика перемещения указателя
    const pointerMove = getPointerMove(data, slides, prev, next, sens)
    
    // определить обработчик нажатия указателя для слайдера
    slides.addEventListener('pointerdown', getEventDown(data, slides, pointerMove))

    // при отпускании указателя, удалить обработчик перемещения для слайдера
    slides.addEventListener('pointerup', () => slides.removeEventListener('pointermove', pointerMove))

    // при выходе указателя за границы, удалить обработчик перемещения для слайдера
    slides.addEventListener('pointerleave', () => slides.removeEventListener('pointermove', pointerMove))


    // если автозапуск не отменялся
    if (!stop) {
      // определить новый интервал прокрутки слайдов
      idInterval = updateInterval(idInterval, data, slides, nav, store, effect, back, time)
    }

    // добавить обратный вызов в хранилище
    callbacks.add(() => scrollView(data.current, 'instant'))
  }

  
  // при изменении размера окна, вызвать обратные вызовы из хранилища
  window.addEventListener('resize', () => callbacks.forEach(cb => cb()))
}()