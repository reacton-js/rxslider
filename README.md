<br>

[EN](https://github.com/reacton-js/rxslider/blob/main/README.md) / [RU](https://github.com/reacton-js/rxslider/blob/main/README_RU.md)

![rxslider](https://raw.githubusercontent.com/reacton-js/rxslider/main/rxslider/logo.jpg)

[GitHub](https://github.com/reacton-js/rxslider) | [NpmJS](https://www.npmjs.com/package/rxslider) | [Example](http://u92502bm.beget.tech/rxslider/)

## rxslider

Responsive X-axis Slider

```html
<!DOCTYPE html>
<html lang="en">
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

The basic slider settings are made through CSS variables in the *rxslider.css* file, as shown below:

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

The slider takes two attributes. The ***data-stop*** attribute without a value disables auto-scrolling:

```html
<div class="rxslider" data-stop>
```

The ***data-time*** attribute specifies the number of milliseconds the slider will pause before moving on to the next slide. By default, this value is 3000 milliseconds, but you can change it:

```html
<div class="rxslider" data-time="1500">
```

<br>

A document can have multiple sliders. By default, sliders are center-aligned and stretch to the full width of the parent element.

To limit the maximum width of any slider, simply add an inline style to it:

```html
<div class="rxslider" style="max-width: 800px;">
```