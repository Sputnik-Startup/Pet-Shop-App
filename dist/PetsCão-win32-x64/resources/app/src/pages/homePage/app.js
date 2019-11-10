setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

new Vue({
    el: '#app',
    data: {
        access: localStorage.getItem('access')
    },
})