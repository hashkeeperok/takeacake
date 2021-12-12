'use strict';

$(document).ready(function () {
  function scroll_to(id) {
    var elem = $('#' + id);
    if (!elem.length)
      return;
    var root = $('html, body');
    var elemT = elem.position().top;
    var currT = root.scrollTop();
    root.animate({'scrollTop' : elemT}, Math.abs(elemT - currT) / 5);
  }

  function Cake(elem) {
    let _this = this;

    _this.shape = 1;
    _this.levelsCount = 3;
    _this.levels = ['vanilla', 'vanilla', 'vanilla'];
    _this.inner = 'white';
    _this.outer = 0;
    _this.topping = 0;
    _this.berries = [];
    _this.decors = [];

    _this.elem = elem;
    _this.elLevels = _this.elem.find('.cake__levels');
    _this.elInners = _this.elem.find('.cake__inners');
    _this.elOuters = _this.elem.find('.cake__outers');
    _this.elToppings = _this.elem.find('.cake__toppings');
    _this.elBerries = _this.elem.find('.cake__berries');
    _this.elDecors = _this.elem.find('.cake__decors');

    _this.setShape = function (value) {
      _this.shape = value;
    };

    _this.setLevelsCount = function (value) {
      _this.levelsCount = value;
      _this.elem.attr('class', _this.elem.attr('class').replace(/cake--levels--[\S]+/, ''));
      _this.elem.addClass('cake--levels--' + value);
    };

    _this.setLevel = function (index, value) {
      _this.levels[index] = value;
      let elLevel = _this.elLevels.find('.cake__level--index--' + index);
      elLevel.attr('class', elLevel.attr('class').replace(/cake__level--type--[\S]+/, ''));
      elLevel.addClass('cake__level--type--' + value);
    };

    _this.setInner = function (value) {
      _this.inner = value;
      _this.elInners.children().hide();
      if (_this.inner != 0) {
        _this.elInners.find('.cake__inner--' + value).show();
      }
    };

    _this.setOuter = function (value) {
      _this.outer = value;
      _this.elOuters.children().hide();
      if (_this.outer != 0) {
        _this.elOuters.find('.cake__outer--' + value).show();
      }
    };

    _this.setTopping = function (value) {
      _this.topping = value;
      _this.elToppings.children().hide();
      if (_this.topping != 0) {
        _this.elToppings.find('.cake__topping--' + value).show();
      }
    };

    _this.setBerries = function (value) {
      let index = _this.berries.indexOf(value);
      if (index !== -1) {
        _this.berries.splice(index, 1);
      }
      else {
        _this.berries.push(value);
      }
      let _x = [];
      _x[0] = _this.berries.indexOf('blackberry') !== -1 ? 1 : 0;
      _x[1] = _this.berries.indexOf('blueberry') !== -1 ? 1 : 0;
      _x[2] = _this.berries.indexOf('raspberry') !== -1 ? 1 : 0;
      _x[3] = _this.berries.indexOf('strawberry') !== -1 ? 1 : 0;
      _x = _x.join('');
      _this.elBerries.children().hide();
      _this.elBerries.find('.cake__berry--' + _x).show();
    };

    _this.resetBerries = function () {
      _this.elBerries.find('.cake__berry').hide();
      _this.berries = [];
    };

    _this.setDecors = function (value) {
      let index = _this.decors.indexOf(value);
      if (index !== -1) {
        _this.elDecors.find('.cake__decor--' + value).hide();
        _this.decors.splice(index, 1);
      }
      else {
        _this.elDecors.find('.cake__decor--' + value).show();
        _this.decors.push(value);
      }
    };

    _this.resetDecors = function () {
      _this.elDecors.find('.cake__decor').hide();
      _this.decors = [];
    };

    _this.reset = function () {
      _this.setShape(1);
      _this.setLevelsCount(3);
      _this.setLevel(0, 'vanilla');
      _this.setLevel(1, 'vanilla');
      _this.setLevel(2, 'vanilla');
      _this.setInner('white');
      _this.setOuter(0);
      _this.setTopping(0);
      _this.resetBerries();
      _this.resetDecors();
    };

    _this.reset();
  }

  function DesignerForm(elem) {
    let _this = this;

    _this.elem = elem;

    _this.cake = new Cake($('#cake'));

    _this.iShape = _this.elem.find('input[name="shape"]');
    _this.iShape.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setShape(value);
    });

    _this.iLevelsCount = _this.elem.find('input[name="levels_count"]');
    _this.iLevelsCount.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setLevelsCount(value);
    });

    _this.iLevels = _this.elem.find('input[name^="levels["]');
    _this.iLevels.change(function () {
      let input = $(this);
      let level = input.attr('name').replace(/levels\[(\d+)\]/, '$1');
      let value = input.val();
      _this.cake.setLevel(level, value);
    });

    _this.iInner = _this.elem.find('input[name="inner"]');
    _this.iInner.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setInner(value);
    });

    _this.iOuter = _this.elem.find('input[name="outer"]');
    _this.iOuter.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setOuter(value);
    });

    _this.iTopping = _this.elem.find('input[name="topping"]');
    _this.iTopping.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setTopping(value);
    });

    _this.iBerries = _this.elem.find('input[name^="berries["]');
    _this.iBerries.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setBerries(value);
    });

    _this.iDecors = _this.elem.find('input[name^="decors["]');
    _this.iDecors.change(function () {
      let input = $(this);
      let value = input.val();
      _this.cake.setDecors(value);
    });

    _this.iSign = _this.elem.find('[name="sign"]');
    _this.iComments = _this.elem.find('[name="comments"]');

    _this.iName = _this.elem.find('[name="name"]');
    _this.iEmail = _this.elem.find('[name="email"]');
    _this.iPhone = _this.elem.find('[name="phone"]');
    _this.iPhone.mask('+7 (999) 999-99-99');
    _this.iDate = _this.elem.find('[name="date"]');
    _this.iDate
      .mask('99.99.9999')
      .datepicker({
        'autoClose' : true,
        'minDate' : new Date()
      });
    _this.iPromo = _this.elem.find('[name="promo"]');

    _this.reset = function () {
      _this.iName.val('');
      _this.iEmail.val('');
      _this.iPhone.val('');
      _this.iDate.val('');
      _this.iPromo.val('');
      _this.iSign.val('');
      _this.iComments.val('');
    };

    _this.elem.submit(function () {
      let form = _this.elem;
      let loading = $('<div />', {'class' : 'loading'}).appendTo(form);
      let submit = form.find('[type="submit"]').prop('disabled', true);
      $.ajax({
        'type' : form.attr('method'),
        'url' : form.attr('action'),
        'data' : form.serialize(),
        'dataType' : 'json'
      })
      .done(function (r) {
        loading.detach();
        submit.prop('disabled', false);

        if (r.status == 'error') {
          alert(r.message);
          return false;
        }

        alert('Спасибо! Данные успешно отправлены. Скоро мы свяжемся с вами для уточнения деталей заказа');
        scroll_to('section-designer');
        _this.reset();

        return false;
      })
      .fail(function (r) {
        loading.detach();
        submit.prop('disabled', false);
        console.log(r);
      });
      return false;
    });
  }

  //let designer = new DesignerForm($('#designer'));
  new DesignerForm($('#designer'));

});