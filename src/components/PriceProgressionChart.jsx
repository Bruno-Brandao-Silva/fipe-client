import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
const PriceProgressionChart = ({ searchResult }) => {
    // Extrair os valores e os meses de referência do resultado da pesquisa
    const valores = searchResult.map(item => parseFloat(item.Valor.replace('R$ ', '').replace('.', '').replace(',', '.')));
    const mesesReferencia = searchResult.map(item => item.MesReferencia);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    console.log('valores', valores);
    console.log('mesesReferencia', mesesReferencia);
    const data = {
        labels: mesesReferencia,
        datasets: [
            {
                label: 'Preço (R$)',
                data: valores,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <h2>Progressão/Regressão de Preços</h2>
            <Line data={data} />
        </div>
    );
};

export default PriceProgressionChart;
