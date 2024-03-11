import { useEffect, useState } from 'react'
import './App.css'
import Select from 'react-select';
import axios from 'axios';
import PriceProgressionChart from './components/PriceProgressionChart';

function App() {
  const [referenceTableStart, setReferenceTableStart] = useState(null);
  const [referenceTableEnd, setReferenceTableEnd] = useState(null);
  const [selectedTypeOpt, setSelectedTypeOpt] = useState(null);
  const [selectedReferenceStart, setSelectedReferenceStart] = useState(null);
  const [selectedReferenceEnd, setSelectedReferenceEnd] = useState(null);
  const [brands, setBrands] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [years, setYears] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const typeOptions = [
    { value: 1, label: 'Carro' },
    { value: 2, label: 'Moto' },
    { value: 3, label: 'Caminhão' },
  ];

  useEffect(() => {
    axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia')
      .then((response) => {
        let data = response.data.map((item) => {
          return { value: item.Codigo, label: item.Mes };
        });
        setReferenceTableStart(data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);
  useEffect(() => {
    if (!selectedReferenceStart) return;
    setReferenceTableEnd(referenceTableStart.filter((item) => item.value > selectedReferenceStart.value));
  }, [referenceTableStart, selectedReferenceStart]);

  useEffect(() => {
    if (!selectedTypeOpt || !selectedReferenceStart) return;

    axios.postForm('https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas', {
      codigoTabelaReferencia: selectedReferenceStart.value,
      codigoTipoVeiculo: selectedTypeOpt.value
    })
      .then((response) => {
        let data = response.data.map((item) => {
          return { value: item.Value, label: item.Label };
        });
        setBrands(data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [selectedReferenceStart, selectedTypeOpt]);

  useEffect(() => {
    if (!selectedBrand || !selectedTypeOpt || !selectedReferenceStart) return;

    axios.postForm('https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos', {
      codigoTabelaReferencia: selectedReferenceStart.value,
      codigoTipoVeiculo: selectedTypeOpt.value,
      codigoMarca: selectedBrand.value
    })
      .then((response) => {
        let data = response.data.Modelos.map((item) => {
          return { value: item.Value, label: item.Label };
        });
        setModels(data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [selectedBrand, selectedReferenceStart, selectedTypeOpt]);

  useEffect(() => {
    if (!selectedModel || !selectedTypeOpt || !selectedReferenceStart) return;

    axios.postForm('https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo', {
      codigoTabelaReferencia: selectedReferenceStart.value,
      codigoTipoVeiculo: selectedTypeOpt.value,
      codigoMarca: selectedBrand.value,
      codigoModelo: selectedModel.value
    })
      .then((response) => {
        let data = response.data.map((item) => {
          return { value: item.Value, label: item.Label };
        });
        setYears(data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [selectedModel, selectedBrand, selectedReferenceStart, selectedTypeOpt]);

  const handleConsult = async () => {
    let result = [];
    for (let i = selectedReferenceStart.value; i <= selectedReferenceEnd.value; i++) {
      let response = await axios.postForm('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
        codigoTabelaReferencia: i,
        codigoTipoVeiculo: selectedTypeOpt.value,
        codigoMarca: selectedBrand.value,
        codigoModelo: selectedModel.value,
        ano: selectedYear.value,
        anoModelo: selectedYear.value.split('-')[0],
        codigoTipoCombustivel: 1,
        tipoConsulta: 'tradicional'
      });
      if (response.data.Valor) result.push(response.data);
    }
    setSearchResult(result);
  }
  return (
    <>
      <Select
        defaultValue={selectedReferenceStart}
        onChange={setSelectedReferenceStart}
        options={referenceTableStart}
        isDisabled={!referenceTableStart}
      />
      <Select
        defaultValue={selectedReferenceEnd}
        onChange={setSelectedReferenceEnd}
        options={referenceTableEnd}
        isDisabled={!referenceTableEnd}
      />
      <Select
        defaultValue={selectedTypeOpt}
        onChange={setSelectedTypeOpt}
        options={typeOptions}
        isDisabled={!referenceTableStart}
      />
      <Select
        defaultValue={selectedBrand}
        onChange={setSelectedBrand}
        options={brands}
        isDisabled={!brands}
      />
      <Select
        defaultValue={selectedModel}
        onChange={setSelectedModel}
        options={models}
        isDisabled={!models}
      />
      <Select
        defaultValue={selectedYear}
        onChange={setSelectedYear}
        options={years}
        isDisabled={!years}
      />
      <button onClick={handleConsult}>Consultar</button>
      <div>
        {searchResult && <PriceProgressionChart searchResult={searchResult} />}
      </div>
    </>
  )
}

export default App
