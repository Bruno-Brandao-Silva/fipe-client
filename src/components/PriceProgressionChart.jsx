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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PriceProgressionChart = ({ searchResult }) => {
    let data = {
        labels: [],
        datasets: [
            {
                label: '',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: 7,
            },
        ],
    };

    if (searchResult) {
        const valores = searchResult.map(item => parseFloat(item.Valor.replace('R$ ', '').replace('.', '').replace(',', '.')));
        const mesesReferencia = searchResult.map(item => item.MesReferencia);
        data = {
            labels: mesesReferencia,
            datasets: [
                {
                    label: searchResult[0].Marca + ' ' + searchResult[0].Modelo + ' ' + searchResult[0].AnoModelo,
                    data: valores,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 7,
                },
            ],
        };
    }

    return (
        <>
            <Line data={data} />
        </>
    );
};

export default PriceProgressionChart;
