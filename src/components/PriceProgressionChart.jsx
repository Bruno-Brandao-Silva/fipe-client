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
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    let data;
    if (searchResult) {
        const valores = searchResult.map(item => parseFloat(item.Valor.replace('R$ ', '').replace('.', '').replace(',', '.')));
        const mesesReferencia = searchResult.map(item => item.MesReferencia);
        data = {
            labels: mesesReferencia,
            datasets: [
                {
                    label: 'Preço (R$)',
                    data: valores,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 7,
                },
            ],
        };
    } else {
        data = {
            labels: [],
            datasets: [
                {
                    label: 'Preço (R$)',
                    data: [],
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
            <h2>Histórico de Preços FIPE</h2>
            <Line data={data} />
        </>
    );
};

export default PriceProgressionChart;
