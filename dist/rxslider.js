/*!
 * rxslider.js v1.4.10
 * (c) 2022-2023 | github.com/reacton-js
 * Released under the MIT License.
 */
'use strict'

!function() {
  // перемещает скролл к позиции слайда
  function scrollView(slide, behavior = 'smooth') {
    slide.parentElement.scrollTo({
      left: slide.offsetLeft,
      behavior
    })
  }

  // удаляет класс у всех дочерних элементов кроме игнорируемых
  function removeClass(parent, name, ignored) {
    for (const child of parent.children) {
      if (child !== ignored) {
        child.classList.remove(name)
      }
    }
  }

  // устанавливает активный класс для слайдов и кнопок навигации
  function setClass(current, slides, nav, store) {
    // удалить активный класс у всех слайдов
    removeClass(slides, 'rxslider__active')

    // добавить текущему слайду активный класс
    current.classList.add('rxslider__active')

    // удалить активный класс у всех кнопок навигации
    removeClass(nav, 'rxslider__nav-active')

    // добавить кнопке навигации из хранилища активный класс
    store.get(current).classList.add('rxslider__nav-active')
  }


  // перемещает слайд в зависимости от направления
  function moveSlide(data, slides, nav, store, effect, isPrev) {
    // получить предыдущий/следующий слайд
    let current = isPrev ? data.current.previousElementSibling : data.current.nextElementSibling
    
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

    // установить активный класс для слайдов и кнопок навигации
    setClass(current, slides, nav, store)

    // сдвинуть текущий слайд к стартовой позиции
    scrollView(current)

    // если слайдеру добавлен эффектный класс
    if (effect) {
      // удалить эффектный класс у всех слайдов
      removeClass(slides, effect)

      // добавить эффектный класс текущему слайду
      current.classList.add(effect)
    }

    // сохранить текущий слайд в свойстве объекта
    data.current = current
  }

  // обновляет интервал прокрутки слайдов
  function updateInterval(data, slides, nav, store, effect, back, time) {
    // если интервал не содержит значение NaN
    if (!isNaN(data.idInterval)) {
      clearInterval(data.idInterval) // удалить текущий интервал
    }

    // сохранить новый интервал в свойстве объекта
    data.idInterval = setInterval(() => moveSlide(data, slides, nav, store, effect, back), time)
  }

  
  // возвращает функцию для обработчика перемещения указателя
  function getPointerMove(data, slides, prev, next, sens, removeEvents, subX = 0) {
    return function pointerMove(e) {
      // определить разность текущей и сохранённой координаты
      subX = e.offsetX - data.downX

      // сдвинуть слайды на один пиксель влево/вправо
      slides.scrollLeft += subX > 0 ? -1 : subX < 0 ? 1 : 0

      // если разность больше ширины слайдера делённой на чувствительность
      if (subX > slides.offsetWidth / sens) {
        // вызвать функцию для удаления обработчиков указателя
        removeEvents()

        // вызвать обработчик для кнопки Назад
        prev.dispatchEvent(new PointerEvent('pointerdown'))
      }
      // иначе, если разность меньше ширины слайдера делённой на чувствительность
      else if (subX < -(slides.offsetWidth / sens)) {
        // вызвать функцию для удаления обработчиков указателя
        removeEvents()

        // вызвать обработчик для кнопки Вперёд
        next.dispatchEvent(new PointerEvent('pointerdown'))
      }
    }
  }

  // возвращает функцию для обработчика нажатия указателя
  function getEventDown(data, slides, pointerMove, removeEvents) {
    return function(e) {
      // отменить действие по умолчанию
      e.preventDefault()

      // удалить текущий интервал
      clearInterval(data.idInterval)

      // присвоить интервалу значение NaN
      data.idInterval = NaN
      
      // определить координату по оси X
      data.downX = e.offsetX

      // добавить обработчик перемещения указателя внутри слайдера
      slides.addEventListener('pointermove', pointerMove)

      // добавить обработчик отпускания указателя внутри слайдера
      slides.addEventListener('pointerup', removeEvents)

      // добавить обработчик выхода указателя за границы слайдера
      slides.addEventListener('pointerleave', removeEvents)
    }
  }

  // вызывается в обработчике кнопок Назад/Вперёд
  function onDown(data, slides, nav, store, effect, back, time, stop, isPrev) {
    // если автозапуск не отменялся, то определить новый интервал прокрутки слайдов
    stop || updateInterval(data, slides, nav, store, effect, back, time)

    // сдвинуть следующий слайд и сделать его текущим
    moveSlide(data, slides, nav, store, effect, isPrev)
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
      idInterval: NaN, // ID интервала обновления
      downX: 0 // X-координата нажатого курсора
    }

    let idTimeout // ID таймера удаления
    let delay // задержка удаления

    // добавить текущему слайду активный класс
    data.current.classList.add('rxslider__active')

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
        button.classList.add('rxslider__nav-active')
      }

      // определить обработчик для кнопки навигации
      button.addEventListener('pointerdown', () => {
        // если автозапуск не отменялся, то определить новый интервал прокрутки слайдов
        stop || updateInterval(data, slides, nav, store, effect, back, time)

        // сделать этот слайд текущим
        data.current = slide

        // установить активный класс для слайдов и кнопок навигации
        setClass(data.current, slides, nav, store)
        
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
    prev.addEventListener('pointerdown', () => onDown(data, slides, nav, store, effect, back, time, stop, true))

    // определить обработчик для кнопки Вперёд
    next.addEventListener('pointerdown', () => onDown(data, slides, nav, store, effect, back, time, stop))


    // определить функцию для удаления обработчиков указателя
    const removeEvents = e => {
      // если функция вызывается как обработчик
      if (e) {
        // если автозапуск не отменялся, то определить новый интервал прокрутки слайдов
        stop || updateInterval(data, slides, nav, store, effect, back, time)

        // сдвинуть текущий слайд к стартовой позиции
        scrollView(data.current)
      }
      
      // удалить обработчик перемещения указателя внутри слайдера
      slides.removeEventListener('pointermove', pointerMove)

      // удалить обработчик отпускания указателя внутри слайдера
      slides.removeEventListener('pointerup', removeEvents)

      // удалить обработчик выхода указателя за границы слайдера
      slides.removeEventListener('pointerleave', removeEvents)
    }

    // определить функцию для обработчика перемещения указателя внутри слайдера
    const pointerMove = getPointerMove(data, slides, prev, next, sens, removeEvents)
    
    // добавить обработчик нажатия указателя внутри слайдера
    slides.addEventListener('pointerdown', getEventDown(data, slides, pointerMove, removeEvents))

    
    // если автозапуск не отменялся, то определить новый интервал прокрутки слайдов
    stop || updateInterval(data, slides, nav, store, effect, back, time)

    // добавить обратный вызов в хранилище
    callbacks.add(() => scrollView(data.current, 'instant'))
  }

  
  // при изменении размера окна, вызвать обратные вызовы из хранилища
  window.addEventListener('resize', () => callbacks.forEach(cb => cb()))
}()