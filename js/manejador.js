

function evaluar() {
    const entrada = document.getElementById('entrada').value;
    // Si la entrada está vacía, no se evalúa
    if (!entrada) {
        document.getElementById('resultado').textContent = 'Ingrese una expresión';
        return;
    }
    evaluateExpression(entrada).then(resultado => {
        document.getElementById('resultado').textContent = typeof resultado === 'string' ? resultado : "Expresión válida";
    });
}

function limpiar() {
    document.getElementById('entrada').value = '';
    document.getElementById('resultado').textContent = '';
}

function progress() {
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';

    var container = document.getElementById('container');
    container.innerHTML = '';

    var bar = new ProgressBar.Circle(container, {
    color: '#aaa',
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: { autoStyleContainer: false },
    from: { color: '#aaa', width: 1 },
    to: { color: '#333', width: 4 },
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
        var value = Math.round(circle.value() * 100);
        circle.setText(value === 0 ? '' : value + '%');
    }
    });

    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';
    bar.animate(1.0, function() {
    overlay.style.display = 'none';
    });
}

document.querySelector('.evaluate').addEventListener('click', function() {
    evaluar();
    progress();
});
