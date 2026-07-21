(function(){
    var saved = localStorage.getItem('admin-theme');
    if (!saved) saved = 'light';
    document.documentElement.setAttribute('data-theme', saved);
    setTimeout(function(){ updateLabel(); }, 50);
})();

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('admin-theme', next);
    updateLabel();
}

function updateLabel() {
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var label = document.getElementById('themeLabel');
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    if (theme === 'dark') {
        btn.innerHTML = '<svg class="crm-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span id="themeLabel">Modo Claro</span>';
    } else {
        btn.innerHTML = '<svg class="crm-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span id="themeLabel">Modo Oscuro</span>';
    }
}
