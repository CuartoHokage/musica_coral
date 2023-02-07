$(function(){
    var audio=$('audio');
    function cargarCaciones(){
        $.ajax({
            url:'/canciones'
        }).done(function(canciones){
            var lista=$('.lista-canciones');
            lista.empty();
            canciones.forEach(function(cancion){
                var nuevoElemento= $('<li class="cancion">'+cancion.nombre+'</li>');
                nuevoElemento
                    .on('click', cancion, play)
                    .appendTo(lista);
            })
        }).fail(function(){
            alert('No puede cargar las canciones')
        })
    }

    function play(evento){
        audio[0].pause();
        audio.attr('src', '/canciones/' +evento.data.nombre);
        audio[0].play();
    }
    cargarCaciones();
});