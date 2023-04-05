<br>

[EN](https://github.com/reacton-js/rxslider/blob/main/README.md) / [RU](https://github.com/reacton-js/rxslider/blob/main/README_RU.md)

![rxslider](https://raw.githubusercontent.com/reacton-js/rxslider/main/logo.jpg)

[GitHub](https://github.com/reacton-js/rxslider) | [NpmJS](https://www.npmjs.com/package/rxslider) | [Пример](http://u92502bm.beget.tech/rxslider/)

## rxslider

Отзывчивый горизонтальный слайдер

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>rxslider</title>
  <link rel="stylesheet" href="rxslider.min.css">
</head>
<body>
  
  <div class="rxslider" style="max-width: 800px;">
    <button class="rxslider__prev">≺</button>
    <div class="rxslider__slides">
      <div>
        <img src="img/1.jpg" alt="1">
      </div>
      <div>
        <img src="img/2.jpg" alt="2">
      </div>
      <div>
        <img src="img/3.jpg" alt="3">
      </div>
      <div>
        <img src="img/4.jpg" alt="4">
      </div>
      <div>
        <img src="img/5.jpg" alt="5">
      </div>
      <div>
        <img src="img/6.jpg" alt="6">
      </div>
      <div>
        <img src="img/7.jpg" alt="7">
      </div>
    </div>
    <button class="rxslider__next">≻</button>
  </div>

  <script src="rxslider.min.js"></script>
</body>
</html>
```

<br>

Основные настройки слайдера производятся через переменные CSS в файле *rxslider.css*, как показано ниже:

```css
.rxslider {
  --lightColor: #fff; 
  --darkColor: #222;
  --btnFontSize: 14px;
  --btnPosition: 20px;
  --btnPadding: .3em;
  --btnDuration: .3s;
  --btnSize: 40px;
  --navSize: 14px;
  --navPosition: 25px;
}
```

Вы можете их переопределить, после подключения базового файла стилей слайдера:

```html
...
  <link rel="stylesheet" href="rxslider.min.css">
  <style>
    .rxslider {
      --lightColor: red;
    }
  </style>
</head>
```

<br>

Слайдер принимает четыре атрибута. Атрибут ***data-stop*** без значения, выключает автоматическую прокрутку:

```html
<div class="rxslider" data-stop>
```

Атрибут ***data-back*** без значения, меняет направление прокрутки слайдера. По умолчанию, слайдер прокручивается в правую сторону, но это можно легко изменить:

```html
<div class="rxslider" data-back>
```

Атрибут ***data-time*** передаёт количество миллисекунд на которое слайдер будет делать остановку, перед переходом к следующему слайду. По умолчанию это значение составляет 3000 миллисекунд, но его можно изменить:

```html
<div class="rxslider" data-time="1500">
```

Атрибут ***data-sens*** определяет чувствительность слайдера при перетаскивании к следующему/предыдущему слайду. По умолчанию это значение равно 10. Чем выше это значение, тем меньшее расстояние необходимо протащить слайд:

```html
<div class="rxslider" data-sens="30">
```

<br>

В документе может быть несколько слайдеров. По умолчанию, слайдеры выравниваются по центру и растягиваются на всю ширину родительского элемента.

Чтобы ограничить максимальную ширину любого слайдера, просто добавьте в него встроенный стиль:

```html
<div class="rxslider" style="max-width: 800px;">
```

<br>

### Пользовательские эффекты

<hr>

По умолчанию, слайды прокручиваются без изменения своего внешнего вида. Слайдер позволяет определять [эффекты](http://u92502bm.beget.tech/rxslider/), применяемые к его слайдам.

Слайдами считаются все дочерние элементы, которые находятся внутри элемента с классом «rxslider__slides»:

```html
<div class="rxslider__slides">
  <div>
    <img src="img/1.jpg" alt="1">
  </div>
  <div>
    <img src="img/2.jpg" alt="2">
  </div>
  <div>
    <img src="img/3.jpg" alt="3">
  </div>
  <div>
    <img src="img/4.jpg" alt="4">
  </div>
  <div>
    <img src="img/5.jpg" alt="5">
  </div>
  <div>
    <img src="img/6.jpg" alt="6">
  </div>
  <div>
    <img src="img/7.jpg" alt="7">
  </div>
</div>
```

Слайды не имеют собственных классов. Они используются как безымянный контейнер и содержат в себе другие элементы, например, изображения, как в примере выше.

<br>

Для создания эффектов, применяются предопределённые переменные CSS, которые хранятся в файле *rxslider-vars.css*. Этот файл нужно подключить после базовых стилей слайдера:

```html
...
  <link rel="stylesheet" href="rxslider.min.css">
  <link rel="stylesheet" href="rxslider-vars.min.css">
</head>
```

<br>

В файле определены несколько переменных для свойств, наиболее подходящих для применения эффектов. Их названия соответствуют названиям свойств, значения которых они определяют.

Например, для свойства **transition** имеется переменная "--transition", как показано ниже:

```css
transition: var(--transition, revert);
transform: var(--transform, revert);
transform-style: var(--transform-style, revert);
transform-origin: var(--transform-origin, revert);
animation: var(--animation, revert);
perspective: var(--perspective, revert);
perspective-origin: var(--perspective-origin, revert);
backface-visibility: var(--backface-visibility, revert);
opacity: var(--opacity, revert);
color: var(--color, revert);
font-size: var(--font-size, revert);
background: var(--background, revert);
```

<br>

Такое же количество переменных существует для родителя слайдов, т.е. для элемента «rxslider__slides». Их названия начинаются с префикса "--parent", за которым следует название свойства:

```css
transition: var(--parent-transition, revert);
transform: var(--parent-transform, revert);
transform-style: var(--parent-transform-style, revert);
transform-origin: var(--parent-transform-origin, revert);
animation: var(--parent-animation, revert);
perspective: var(--parent-perspective, revert);
perspective-origin: var(--parent-perspective-origin, revert);
backface-visibility: var(--parent-backface-visibility, revert);
opacity: var(--parent-opacity, revert);
color: var(--parent-color, revert);
font-size: var(--parent-font-size, revert);
background: var(--parent-background, revert);
```

<br>

Столько же переменных существует и для прямых дочерних элементов слайдов, например, изображений. Их названия начинаются с префикса "--child", за которым следует название свойства:

```css
transition: var(--child-transition, revert);
transform: var(--child-transform, revert);
transform-style: var(--child-transform-style, revert);
transform-origin: var(--child-transform-origin, revert);
animation: var(--child-animation, revert);
perspective: var(--child-perspective, revert);
perspective-origin: var(--child-perspective-origin, revert);
backface-visibility: var(--child-backface-visibility, revert);
opacity: var(--child-opacity, revert);
color: var(--child-color, revert);
font-size: var(--child-font-size, revert);
background: var(--child-background, revert);
```

<br>

Вы можете определять новые переменные в файле *rxslider-vars.css* для любых свойств, которые хотите использовать при создании эффектов, например:

```css
text-align: var(--text-align, revert);
```

<br>

Все эти переменные позволяют определять свойства для родителя, слайда и его прямого потомка в специальном классе, который добавляется после подключения базовых стилей.

Его название состоит из названия класса слайдера, двойного тире, как у переменных, и произвольного названия пользовательского эффекта, например:

```css
.rxslider--myeffect {
  --transition: all 2s;
  --transform: rotate(0) scale(.1);
  --transform-origin: 80% 20%;
  --opacity: .1;

  transform: rotate(360deg) scale(1);
  opacity: 1;
}
```

Затем необходимо добавить название этого класса к элементу слайдера:

```html
<div class="rxslider rxslider--myeffect">
```

<br>

В примере выше, определялись четыре переменные для свойств перехода, трансформации и прозрачности слайдов:

```css
--transition: all 2s;
--transform: rotate(0) scale(.1);
--transform-origin: 80% 20%;
--opacity: .1;
```

<br>

Кроме переменных, в классе было явно определено два свойства для трансформации и прозрачности:

```css
transform: rotate(360deg) scale(1);
opacity: 1;
```

<br>

Переменные определяют значения свойств до назначения активному в окне слайду специального класса, а свойства задаваемые в классе явно, уже после того, как этот класс будет ему добавлен.

Таким образом, можно создавать большое количество [различных эффектов](http://u92502bm.beget.tech/rxslider/), как показано ниже:

```html
<style>
  /* ------- rxslider--one ------- */
  .rxslider--one {
    --transition: all 2s;
    --transform: rotate(0) scale(.1);
    --transform-origin: 80% 20%;
    --opacity: .1;

    transform: rotate(360deg) scale(1);
    opacity: 1;
  }

  /* ------- rxslider--two ------- */
  .rxslider--two {
    --parent-perspective: 400px;
    --transition: all 2s;
    --transform: rotateX(0) scale(0);

    transform: rotateX(360deg) scale(1);
  }

  /* ------- rxslider--three ------- */
  .rxslider--three {
    --child-animation: three 3s infinite;
  }
  @keyframes three {
    0% {
      opacity: 0;
      transform: scale(1.5);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }
</style>
```