/* 直接受注用ページ（index.html・hp/）から来た人には「制作者のページへ」をお問い合わせのあるトップに向ける。クラウドソーシング経由（works.html）はそのまま */
(function(){
  try { if (sessionStorage.getItem('uw-src') !== 'index') return; } catch (e) { return; }
  document.querySelectorAll('a[href="../works.html"]').forEach(function(a){ a.href = '../index.html'; });
})();
