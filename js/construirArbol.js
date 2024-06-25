document.addEventListener("DOMContentLoaded", function () {
    const evaluateButton = document.querySelector('.evaluate');
    const clearButton = document.querySelector('.clear');

    evaluateButton.addEventListener('click', evaluateAndDisplayTree);
    clearButton.addEventListener('click', clearTree);

    async function evaluateAndDisplayTree() {
        const entrada = document.getElementById('entrada').value;
        const resultado = await evaluateExpression(entrada);

        // Aquí se podría usar displayTree si decides no usar el evento personalizado
        // displayTree(resultado);
    }

    function clearTree() {
        d3.select("#tree").html("");
    }
});
