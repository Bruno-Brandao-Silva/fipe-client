import { useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';
import axios from 'axios';
import PriceProgressionChart from './components/PriceProgressionChart';

function App() {
  const [referenceTableStart, setReferenceTableStart] = useState(null);
  const [referenceTableEnd, setReferenceTableEnd] = useState(null);
  const [selectedTypeOpt, setSelectedTypeOpt] = useState(null);
  const [brands, setBrands] = useState(null);
  const [models, setModels] = useState(null);
  const [years, setYears] = useState(null);

  const [selectedReferenceStart, setSelectedReferenceStart] = useState(null);
  const [selectedReferenceEnd, setSelectedReferenceEnd] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [searchResult, setSearchResult] = useState(null);

  const [buttonDisabled, setButtonDisabled] = useState(false);
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
          return { value: item.Value, label: item.Label.replace("32000", "Zero KM") };
        });
        setYears(data);
      })
      .catch((error) => {
        console.log('error', error);
      });

  }, [selectedModel, selectedBrand, selectedReferenceStart, selectedTypeOpt]);

  const handleConsult = async () => {
    setButtonDisabled(true);
    try {
      if (searchResult) {
        for (let i = 0; i < searchResult.length; i++) {
          if (searchResult[i][0].Marca === selectedBrand.label && searchResult[i][0].Modelo === selectedModel.label && searchResult[i][0].AnoModelo == selectedYear.value.split('-')[0]) {
            return;
          }
        }
      }
      const resultPromises = [];
      for (let i = selectedReferenceStart.value; i <= selectedReferenceEnd.value; i++) {
        resultPromises.push(
          axios.postForm('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
            codigoTabelaReferencia: i,
            codigoTipoVeiculo: selectedTypeOpt.value,
            codigoMarca: selectedBrand.value,
            codigoModelo: selectedModel.value,
            ano: selectedYear.value,
            anoModelo: selectedYear.value.split('-')[0],
            codigoTipoCombustivel: 1,
            tipoConsulta: 'tradicional'
          })
        );
      }
      const responses = await Promise.allSettled(resultPromises);
      const result = responses.reduce((accumulatedResults, { status, value }) => {
        if (status === 'fulfilled' && value && value.data) {
          if (value.data.CodigoFipe) {
            let info = value.data;
            info.Valor = parseFloat(info.Valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const codigoFipe = value.data.CodigoFipe;
            if (!accumulatedResults[codigoFipe]) {
              accumulatedResults[codigoFipe] = [];
            }
            delete value.data.CodigoFipe;
            accumulatedResults[codigoFipe].push(info);
          } else {
            console.log('error', value.data);
          }
        }
        return accumulatedResults;
      }, {});

      if (result[Object.keys(result)[0]] === 0) {
        return;
      }

      let newSearchResult = searchResult || [];
      for (let key in result) {
        newSearchResult.push(result[key]);
      }
      setSearchResult(newSearchResult);
    } catch (error) {
      console.log('error', error);
    } finally {
      setButtonDisabled(false);
    }
  };

  const handleClean = () => {
    setSelectedReferenceStart(null);
    setSelectedReferenceEnd(null);
    setSelectedTypeOpt(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSearchResult(null);
  }
  return (
    <div className='content'>
      <div className="left-side">
        <header>
          <h1>Histórico de Preços FIPE</h1>
        </header>
        <div className='search'>
          <Select
            className="select"
            value={selectedReferenceStart}
            placeholder="Data Inicial"
            onChange={setSelectedReferenceStart}
            options={referenceTableStart}
            isDisabled={!referenceTableStart}
          />
          <Select
            className="select"
            value={selectedReferenceEnd}
            placeholder="Data Final"
            onChange={setSelectedReferenceEnd}
            options={referenceTableEnd}
            isDisabled={!referenceTableEnd}
          />
          <Select
            className="select"
            value={selectedTypeOpt}
            placeholder="Tipo de Veículo"
            onChange={setSelectedTypeOpt}
            options={typeOptions}
            isDisabled={!referenceTableStart}
          />
          <Select
            className="select"
            value={selectedBrand}
            placeholder="Selecione a Marca"
            onChange={setSelectedBrand}
            options={brands}
            isDisabled={!brands}
          />
          <Select
            className="select"
            value={selectedModel}
            placeholder="Selecione o Modelo"
            onChange={setSelectedModel}
            options={models}
            isDisabled={!models}
          />
          <Select
            className="select"
            value={selectedYear}
            placeholder="Selecione o Ano/Combutível"
            onChange={setSelectedYear}
            options={years}
            isDisabled={!years}
          />
        </div>
        <div className="buttons-container">
          <button onClick={handleConsult}
            disabled={buttonDisabled || !selectedReferenceStart || !selectedReferenceEnd || !selectedTypeOpt || !selectedBrand || !selectedModel || !selectedYear}
          >Adicionar</button>
          <button onClick={handleClean}>
            Limpar
          </button>
        </div>
        <footer>
          <a href="https://github.com/Bruno-Brandao-Silva">
            @Bruno
          </a>
        </footer>
      </div>
      <div className='right-side'>
        <PriceProgressionChart searchResult={searchResult} />
      </div>
    </div>
  );
}

export default App;
