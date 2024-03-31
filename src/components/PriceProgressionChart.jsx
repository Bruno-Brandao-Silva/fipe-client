import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const colors = [
    'rgb(54, 162, 235)', // Azul
    'rgb(255, 205, 86)', // Amarelo
    'rgb(153, 102, 255)', // Roxo
    'rgb(255, 159, 64)', // Laranja
    'rgb(231, 233, 237)', // Cinza
    'rgb(255, 77, 166)', // Rosa
    'rgb(255, 99, 132)', // Vermelho
    'rgb(75, 192, 192)', // Verde
    'rgb(33, 155, 255)', // Azul claro
    'rgb(255, 0, 255)' // Magenta
];
const PriceProgressionChart = ({ searchResult }) => {
    let data = {
        labels: [],
        datasets: [{
            label: ``,
            data: null,
            fill: false,
            borderColor: colors[0],
            pointRadius: 7,
            key: `0`
        }],
    };

    if (searchResult) {
        data.datasets = searchResult.map((sr, index) => {
            const valores = sr.map(item => item.Valor);
            const mesesReferencia = sr.map(item => item.MesReferencia);
            data.labels = mesesReferencia;

            return {
                label: `${sr[0].Marca} ${sr[0].Modelo} ${sr[0].AnoModelo}`,
                data: valores,
                fill: false,
                borderColor: colors[index],
                pointRadius: 7,
                key: `${sr[0].Marca}-${sr[0].Modelo}-${sr[0].AnoModelo}`
            };
        });
    }

    return (
        <Line data={data} />
    );
};

export default PriceProgressionChart;
