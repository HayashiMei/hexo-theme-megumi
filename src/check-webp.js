function checkWebpFeature(callback) {
  if (CONFIG.supportWebp !== undefined) {
    return callback();
  }

  const kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha:
      'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation:
      'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
  };
  const img = new Image();

  img.onload = () => {
    CONFIG.supportWebp = img.width > 0 && img.height > 0;
    callback();
  };

  img.onerror = () => {
    CONFIG.supportWebp = false;
    callback();
  };

  img.src = 'data:image/webp;base64,' + kTestImages['lossless'];
}

module.exports = checkWebpFeature;
