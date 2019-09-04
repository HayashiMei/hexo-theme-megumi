function pisces() {
  $(document).ready(() => {
    const sidebarInner = $('.sidebar-inner');

    initAffix();
    resizeListener();

    function initAffix() {
      const headerOffset = getHeaderOffset(),
        footerOffset = getFooterOffset(),
        sidebarHeight =
          $('#sidebar').height() + NexT.utils.getSidebarb2tHeight(),
        contentHeight = $('#content').height();

      // Not affix if sidebar taller then content (to prevent bottom jumping).
      if (headerOffset + sidebarHeight < contentHeight) {
        sidebarInner.affix({
          offset: {
            top: headerOffset - 2 * CONFIG.sidebar.offset,
            bottom: footerOffset,
          },
        });
      }

      // setSidebarMarginTop(headerOffset).css({ 'margin-left': 'initial' });
    }

    function resizeListener() {
      const mql = window.matchMedia('(min-width: 991px)');
      mql.addListener(e => {
        if (e.matches) {
          recalculateAffixPosition();
        }
      });
    }

    function getHeaderOffset() {
      return $('.header-inner').height() + CONFIG.sidebar.offset;
    }

    function getFooterOffset() {
      const footerInner = $('.footer-inner'),
        footerMargin =
          footerInner.outerHeight(true) - footerInner.outerHeight(),
        footerOffset = footerInner.outerHeight(true) + footerMargin;
      return footerOffset;
    }

    function recalculateAffixPosition() {
      $(window).off('.affix');
      sidebarInner
        .removeData('bs.affix')
        .removeClass('affix affix-top affix-bottom');
      initAffix();
    }
  });
}

module.exports = pisces;
