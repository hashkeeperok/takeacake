'use strict';

$(function () {

////////////////////////////////////////////////////////////////////////////////

  $('.fancybox').fancybox({
    'padding': 0,
    'helpers': {
      'overlay': {
        'locked': false
      }
    }
  });

////////////////////////////////////////////////////////////////////////////////

  function scroll_to(id) {
    let elem = $('#' + id);
    if (!elem.length) {
      return;
    }
    let root = $('html, body');
    let elemT = elem.position().top;
    let currT = root.scrollTop();
    root.animate({ 'scrollTop': elemT }, Math.abs(elemT - currT) / 5);
  }

////////////////////////////////////////////////////////////////////////////////

  $('a[href*="#"]').on('click', function () {
    let url = $(this).attr('href');
    if (url.indexOf('http') === 0) {
      return true;
    }
    let id = url.substring(url.indexOf('#') + 1);
    if (!id || 0 === id.length) {
      return;
    }
    scroll_to(id);
    return false;
  });

////////////////////////////////////////////////////////////////////////////////

  function Spin(input, onchange) {
    let _this = this;

    this.input = input.prop('readonly', true).val(1);
    this.value = 1;

    this.input.wrap('<span class="spin-container">');
    this.container = this.input.parent();

    this.btn_minus = $('<span>', { 'class': 'minus' })
      .html('&minus;')
      .prependTo(this.container)
      .on('click', function () {
        _this.value--;
        _this.input.val(_this.value);
        if (typeof onchange === 'function') {
          onchange(_this.value, _this);
        }
        return false;
      });

    this.btn_plus = $('<span>', { 'class': 'plus' })
      .html('&plus;')
      .appendTo(this.container)
      .on('click', function () {
        _this.value++;
        _this.input.val(_this.value);
        if (typeof onchange === 'function') {
          onchange(_this.value, _this);
        }
        return false;
      });

    this.setValue = function (value) {
      _this.input.val(value);
      _this.value = value;
    };

    this.reset = function () {
      _this.setValue(1);
    };

    this.input.data('spin', this);

    return this;
  }

////////////////////////////////////////////////////////////////////////////////
// v2
////////////////////////////////////////////////////////////////////////////////

  function Product(html) {
    let _this = this;

    this.html = html;

    this.id = this.html.attr('data-id');
    this.name = this.html.find('.name').text();
    this.price = this.html.find('.price').text();

    // iOS fix
    this.html.click(function () {});

    // this.html.find('.btn-fullscreen').fancybox({
    // 	'padding' : 0,
    // 	'helpers' : {
    // 		'overlay' : {
    // 			'locked' : false
    // 		}
    // 	}
    // });

    this.html.find('.btn-cart').click(function () {
      _this.addToCart();
      return false;
    });

    this.spin = new Spin(_this.html.find('.amount'), function (value, spin) {
      if (value == 0) {
        if (confirm('Убрать товар из корзины?')) {
          _this.removeFromCart();
        }
        else {
          spin.setValue(1);
        }
      }
      else {
        orderForm.updateAmount(_this.id, value);
      }
    });

    this.getPrice = function () {
      return parseInt(this.price);
    };

    this.getAmount = function () {
      return +this.spin.value;
    };

    this.addToCart = function () {
      this.html.addClass('selected');
      this.spin.reset();
      orderForm.addProduct(this);
      orderForm.updateTotal();
    };

    this.removeFromCart = function () {
      this.html.removeClass('selected');
      orderForm.removeProduct(this);
      orderForm.updateTotal();
    };

    this.updateAmount = function (value) {
      this.spin.setValue(value);
      orderForm.updateTotal();
    };

    this.html.data('product', this);

    return this;
  }

  function OrderForm(html) {
    let _this = this;

    this.html = html;

    this.inputPhone = this.html.find('input[name="phone"]');
    this.inputPhone.mask('+7 (999) 999-99-99');

    this.inputDate = this.html.find('input[name="date"]');
    this.inputDate
      .mask('99.99.9999')
      .datepicker({
        'autoClose': true,
        'minDate': new Date()
      })
      .change(function () {
        _this.updateTotal();
      });

    this.getDate = function () {
      let val = this.inputDate.val();
      if (!val || 0 === val.length) {
        return '';
      }
      return this.inputDate.val()
        .replace(/(\d{2})\.(\d{2})\.(\d{4})/g, '$3-$2-$1');
    };

    this.inputTime = this.html.find('input[name="time"]');
    this.inputTime
      .mask('99:99')
      .on('change', function () {
        let input = $(this);
        let parts = input.val().split(':');
        let hh = +parts[0];
        let mm = +parts[1];
        if (hh > 23) {
          input.val('');
        }
        if (mm > 59) {
          input.val('');
        }
        _this.updateTotal();
      });

    this.getTime = function () {
      let val = this.inputTime.val();
      if (!val || 0 === val.length) {
        return '';
      }
      return this.inputTime.val() + ':00';
    };

    this.products_field = this.html.find('#order-form-products');

    this.html.submit(function () {
      _this.isRush();
      let form = _this.html;
      let loading = $('<div />', { 'class': 'loading' }).appendTo(form);
      let submit = form.find('[type="submit"]').prop('disabled', true);
      $.ajax({
        'type': form.attr('method'),
        'url': form.attr('action'),
        'data': form.serialize(),
        'dataType': 'json'
      })
        .done(function (r) {
          loading.detach();
          submit.prop('disabled', false);

          if (r.status == 'error') {
            alert(r.message);
            return false;
          }

          alert(
            'Спасибо! Данные успешно отправлены. Скоро мы свяжемся с вами для уточнения деталей заказа');
          scroll_to('section-products');
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

    this.addProduct = function (product) {
      let item = $('<div>', { 'class': 'item' }).attr('data-id', product.id);

      let i_name = $('<input>', {
        'type': 'text',
        'name': 'cakes[' + product.id + '][name]'
      })
        .addClass('product')
        .val(product.name)
        .prop('readonly', true)
        .appendTo(item);

      let i_amount = $('<input>', {
        'type': 'text',
        'name': 'cakes[' + product.id + '][amount]',
        'size': 2
      })
        .addClass('amount')
        .appendTo(item);
      new Spin(i_amount, function (value, spin) {
        if (value == 0) {
          if (confirm('Удалить товар из корзины?')) {
            product.removeFromCart();
          }
          else {
            spin.setValue(1);
          }
        }
        else {
          product.updateAmount(value);
        }
      });

      let field = this.products_field;
      if (!field.find('.item').length) {
        field.empty();
      }
      field.append(item);
    };

    this.removeProduct = function (product) {
      let field = this.products_field;
      field.find('.item[data-id="' + product.id + '"]').detach();
      if (!field.find('.item').length) {
        field.html('&mdash;');
      }
    };

    this.updateAmount = function (id, value) {
      let field = this.products_field;
      let item = field.find('.item[data-id="' + id + '"]');
      item.find('.amount').data('spin').setValue(value);
      this.updateTotal();
    };

    this.isRush = function () {
      let orderDate = this.getDate();
      if (!orderDate || 0 === orderDate.length) {
        return false;
      }
      let orderTime = this.getTime();
      if (!orderTime || 0 === orderTime.length) {
        return false;
      }
      let today = new Date();
      let delivery = new Date(orderDate + ' ' + orderTime);
      let diff = (delivery - today) / 1000 / 3600;
      return diff < 12;
    };

    this.updateTotal = function () {
      let total = 0;

      $('.product.selected').each(function () {
        let product = $(this).data('product');
        let price = product.getPrice();
        let amount = product.getAmount();
        total += price * amount;
      });

      if (this.isRush()) {
        this.html.find('#order-form-rush').show();
        total += 0.2 * total;
      }
      else {
        this.html.find('#order-form-rush').hide();
      }

      this.html.find('#order-form-total').find('span').text(total);
    };

    this.reset = function () {
      $('.product.selected').each(function () {
        $(this).data('product').removeFromCart();
      });
      this.html.get(0).reset();
    };

    this.html.data('form', this);

    if (OrderForm.instance) {
      return OrderForm.instance;
    }
    OrderForm.instance = this;
    return this;
  }

////////////////////////////////////////////////////////////////////////////////

  let orderForm = new OrderForm($('#order-form'));

  $('.product').each(function () {
    let product = $(this);
    new Product(product);
  });

////////////////////////////////////////////////////////////////////////////////

  function lazyLoadCover(elem) {
    if (elem.data('isLoading')) {
      return;
    }
    elem.data('isLoading', true);
    let img = new Image();
    img.onload = function () {
      elem
        .removeClass('lazy')
        .data('isLoading', false)
        .css({
          'background-image': 'url(' + this.src + ')',
          'opacity': 0
        })
        .animate({ 'opacity': 1 }, 250);
    };
    img.src = elem.data('src');
  }

  function lazyLoadCovers() {
    let wndT = $(window).scrollTop();
    let wndH = $(window).height();
    $('.products').find('.cover.lazy').each(function () {
      let cover = $(this);
      let coverT = cover.offset().top;
      let coverH = cover.outerHeight();
      if (wndT < coverT + coverH && coverT < wndT + wndH) {
        lazyLoadCover(cover);
      }
    });
  }

  lazyLoadCovers();
  $(window)
    .on('scroll', function () {
      lazyLoadCovers();
    })
    .on('resize', function () {
      lazyLoadCovers();
    });

});
