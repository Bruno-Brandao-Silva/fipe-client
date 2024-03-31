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
        let datasets = [];
        searchResult.forEach((sr) => {
            const valores = sr.map(item => item.Valor);
            const mesesReferencia = sr.map(item => item.MesReferencia);
            data.labels = mesesReferencia;
            datasets.push({
                label: sr[0].Marca + ' ' + sr[0].Modelo + ' ' + sr[0].AnoModelo,
                data: valores,
                fill: false,
                borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
                tension: 0.1,
                pointRadius: 7,
            });
        });
        data.datasets = datasets;
    }
    return (
        <>
            <Line data={data} />
        </>
    );
};

export default PriceProgressionChart;
