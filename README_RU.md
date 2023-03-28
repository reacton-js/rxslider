<br>

[EN](https://github.com/reacton-js/rxslider/blob/main/README.md) / [RU](https://github.com/reacton-js/rxslider/blob/main/README_RU.md)

![rxslider](https://raw.githubusercontent.com/reacton-js/rxslider/main/rxslider/logo.jpg)

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
  --btnSize: 40px;
  --navSize: 14px;
  --navPosition: 25px;
  --duration: .3s;
  ...
}
```

<br>

Слайдер принимает три атрибута. Атрибут ***data-stop*** без значения, выключает автоматическую прокрутку:

```html
<div class="rxslider" data-stop>
```

Атрибут ***data-left*** без значения, меняет направление прокрутки слайдера. По умолчанию, слайдер прокручивается в правую сторону, но это можно легко изменить:

```html
<div class="rxslider" data-left>
```

Атрибут ***data-time*** передаёт количество миллисекунд на которое слайдер будет делать остановку, перед переходом к следующему слайду. По умолчанию это значение составляет 3000 миллисекунд, но его можно изменить:

```html
<div class="rxslider" data-time="1500">
```

<br>

В документе может быть несколько слайдеров. По умолчанию, слайдеры выравниваются по центру и растягиваются на всю ширину родительского элемента.

Чтобы ограничить максимальную ширину любого слайдера, просто добавьте в него встроенный стиль:

```html
<div class="rxslider" style="max-width: 800px;">
```