/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

// AFFIX CLASS DEFINITION
// ======================

const Affix = function (element, options) {
  this.options = $.extend({}, Affix.DEFAULTS, options);

  this.$target = $(this.options.target)
    .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
    .on(
      'click.bs.affix.data-api',
      $.proxy(this.checkPositionWithEventLoop, this)
    );

  this.$element = $(element);
  this.affixed = null;
  this.unpin = null;
  this.pinnedOffset = null;

  this.checkPosition();
};

Affix.VERSION = '3.3.5';

Affix.RESET = 'affix affix-top affix-bottom';

Affix.DEFAULTS = {
  offset: 0,
  target: window,
};

Affix.prototype.getState = function (
  scrollHeight,
  height,
  offsetTop,
  offsetBottom
) {
  const scrollTop = this.$target.scrollTop();
  const position = this.$element.offset();
  const targetHeight = this.$target.height();

  if (offsetTop && this.affixed === 'top') {
    return scrollTop < offsetTop ? 'top' : false;
  }

  if (this.affixed === 'bottom') {
    if (offsetTop) {
      return scrollTop + this.unpin <= position.top ? false : 'bottom';
    }
    return scrollTop + targetHeight <= scrollHeight - offsetBottom
      ? false
      : 'bottom';
  }

  const initializing = !this.affixed;
  const colliderTop = initializing ? scrollTop : position.top;
  const colliderHeight = initializing ? targetHeight : height;

  if (offsetTop && scrollTop <= offsetTop) {
    return 'top';
  }
  if (
    offsetBottom &&
    colliderTop + colliderHeight >= scrollHeight - offsetBottom
  ) {
    return 'bottom';
  }

  return false;
};

Affix.prototype.getPinnedOffset = function () {
  if (this.pinnedOffset) {
    return this.pinnedOffset;
  }
  this.$element.removeClass(Affix.RESET).addClass('affix');
  const scrollTop = this.$target.scrollTop();
  const position = this.$element.offset();
  return (this.pinnedOffset = position.top - scrollTop);
};

Affix.prototype.checkPositionWithEventLoop = function () {
  setTimeout($.proxy(this.checkPosition, this), 1);
};

Affix.prototype.checkPosition = function () {
  if (!this.$element.is(':visible')) {
    return;
  }

  const height = this.$element.height();
  const offset = this.options.offset;
  let offsetTop = offset.top;
  let offsetBottom = offset.bottom;
  const scrollHeight = Math.max(
    $(document).height(),
    $(document.body).height()
  );

  if (typeof offset !== 'object') {
    offsetBottom = offsetTop = offset;
  }
  if (typeof offsetTop === 'function') {
    offsetTop = offset.top(this.$element);
  }
  if (typeof offsetBottom === 'function') {
    offsetBottom = offset.bottom(this.$element);
  }

  const affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

  if (this.affixed !== affix) {
    if (this.unpin) {
      this.$element.css('top', '');
    }

    const affixType = 'affix' + (affix ? '-' + affix : '');
    const e = $.Event(affixType + '.bs.affix');

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) {
      return;
    }

    this.affixed = affix;
    this.unpin = affix === 'bottom' ? this.getPinnedOffset() : null;

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
  }

  if (affix === 'bottom') {
    // this.$element.offset({
    //   top: scrollHeight - height - offsetBottom
    // })
  }
};

// AFFIX PLUGIN DEFINITION
// =======================

function Plugin(option) {
  return this.each(function () {
    const $this = $(this);
    let data = $this.data('bs.affix');
    const options = typeof option === 'object' && option;

    if (!data) {
      $this.data('bs.affix', (data = new Affix(this, options)));
    }
    if (typeof option === 'string') {
      data[option]();
    }
  });
}

const old = $.fn.affix;

$.fn.affix = Plugin;
$.fn.affix.Constructor = Affix;

// AFFIX NO CONFLICT
// =================

$.fn.affix.noConflict = function () {
  $.fn.affix = old;
  return this;
};

// AFFIX DATA-API
// ==============

$(window).on('load', function () {
  $('[data-spy="affix"]').each(function () {
    const $spy = $(this);
    const data = $spy.data();

    data.offset = data.offset || {};

    if (data.offsetBottom) {
      data.offset.bottom = data.offsetBottom;
    }
    if (data.offsetTop) {
      data.offset.top = data.offsetTop;
    }

    Plugin.call($spy, data);
  });
});
