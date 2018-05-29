<div class="site-brand-wrapper">
  <div class="header-megumi"></div>
  <div class="sakura-front"></div>
  <canvas id="sakura" width="800" height="600"></canvas>
  
  <div class="site-meta {% if theme.custom_logo.enabled %}custom-logo{% endif %}">
    {% if theme.custom_logo.image and theme.scheme === 'Muse' %}
      <div class="site-meta-headline">
        <a>
          <img class="custom-logo-image" src="{{ theme.custom_logo.image }}" alt="{{ config.title }}"/>
        </a>
      </div>
    {% endif %}

    <div class="custom-logo-site-title">
      <div class="brand" rel="start">
        <span class="logo-line-before"><i></i></span>
        <span class="site-title">
          <!-- {{ config.title }} -->

          <div id="animate" class="animate">
            {% for letter in config.title %}{#
              #}<span>{{ letter }}</span>{#
            #}{% endfor %}
          </div>

          <div id="guide" class="guide">
            {% for letter in config.title %}{#
              #}<span>{{ letter }}</span>{#
            #}{% endfor %}
          </div>

        </span>
        <span class="logo-line-after"><i></i></span>
      </div>
    </div>

    {% if theme.seo %}
      <h1 class="site-subtitle" itemprop="description">{{ config.subtitle }}</h1>
    {% else %}
      <p class="site-subtitle">{{ config.subtitle }}</p>
    {% endif %}
  </div>

  <div class="site-nav-toggle">
    <button aria-label="{{ __('accessibility.nav_toggle') }}">
      <span class="btn-bar"></span>
      <span class="btn-bar"></span>
      <span class="btn-bar"></span>
    </button>
  </div>
</div>
