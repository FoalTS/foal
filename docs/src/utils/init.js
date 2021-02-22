function init() {
  _bsa.init('custom', 'CEBI553Y', 'placement:foaltsorg', {
    target: '#carbon-js',
    template:
      `
      <div id="carbonads">
        <span
          ><span class="carbon-wrap"
            ><a
              href="##statlink##"
              class="carbon-img"
              target="_blank"
              rel="noopener sponsored"
              ><img
                src="##smallImage##"
                alt="ads via Carbon"
                border="0"
                height="100"
                width="130"
                style="max-width: 130px" /></a
            ><a
              href="##statlink##"
              class="carbon-text"
              target="_blank"
              rel="noopener sponsored"
              >##description##</a
            ></span
          ><a
            href="##ad_via_link##"
            class="carbon-poweredby"
            target="_blank"
            rel="noopener sponsored"
            >ads via Carbon</a
          ></span
        >
      </div>
      
      `
  });
}

let firstTime = true;

export function initAd() {
  if (typeof _bsa !== 'undefined' && _bsa) {
    console.log('Loading ad')
    init();

    // Oddly enough, we need to initialize the ad twice on the following pages.
    // Otherwise the ad is missing on every other page.
    if (!firstTime) {
      init();
    }
    firstTime = false;
  }
}