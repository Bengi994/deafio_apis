document.getElementById('convert').addEventListener('click', async function() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const resultElement = document.getElementById('result');

    if (amount === '') {
        resultElement.textContent = 'Por favor, ingrese un monto.';
        return;
    }

    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        const rate = data.serie[0].valor;
        const result = (amount / rate).toFixed(2);
        resultElement.textContent = `Resultado: ${result}`;

        // Mostrar gráfico
        showChart(data.serie.slice(0, 10));
    } catch (error) {
        resultElement.textContent = 'Error al obtener los datos.';
        console.error(error);
    }
});

let chartInstance;

function showChart(data) {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    const labels = data.map(item => item.fecha.substring(0, 10));
    const values = data.map(item => item.valor);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor en los últimos 10 días',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                }
            }
        }
    });
}
