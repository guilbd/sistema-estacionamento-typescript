(function () {
    var _a;
    // crio a variavel $ para encurtar a escrita do código, já identificando que o parâmetro que quero é uma string
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    //função principal
    function patio() {
        //função para persistencia de dados. A função sempre vai retornar um array de Veiculo
        function ler() {
            //verifico se em localStorage.patio tem algum dado, se tiver eu faço o Parse do JSON, se não, retorno um array vazio
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        //array de todos os veiculos a serem salvos no array
        function salvar(veiculo) {
            //coloco o item a ser salvo em pátio, passo para string (stringfy), pois localStorage só reconhece string
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }
        //a função adicionar espera um veiculo conforme a INTERFACE VEICULO, coloco o parametro salvaVeiculo como boolean, para não salvar duplicado toda vez que der reload
        function adicionar(veiculo, salvaVeiculo) {
            var _a, _b;
            //crio a variavel que vai inserir uma nova linha na tabela da página index.html
            const row = document.createElement("tr");
            //inserção da linha
            row.innerHTML = `
      <td>${veiculo.modelo}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
      <button class="delete" data-placa="${veiculo.placa}"> X </button>
      </td>
      `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            //concateno ao pátio uma nova linha
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            //faço a veriricação através do salvaVeiculo, se for True eu pego todos os veiculos já cadastrados através do "spread" (...ler), e adiciono um novo que vem através do parâmetro da função adicionar (veiculo: Veiculo)
            if (salvaVeiculo)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { entrada, modelo } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${modelo} permaneceu por ${tempo}, deseja encerrar? `))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        //função para renderizar o HTML
        function render() {
            //primeiro capuramos as informações que vem de #patio. Como tenho certeza de que sempre vai retornar um valor pq #patio está declarado no index.html, posso utilizar a opção Force (!)
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                //vou iterar por cada item de pátio e ao final adiciono mais uma linha com o novo veiculo cadastrado
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    //chamo a função de renderizar
    patio().render();
    //ao clicar no botão cadastrar os valores digitados em modelo e placa são capturados
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        //ao clicar no botão cadastrar os valores digitados em modelo e placa são capturados
        const modelo = (_a = $("#modelo")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        //validação se os dados obrigatórios foram preenchidos
        if (!modelo || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        //ao chamar a função adicionar, é necessário colocar todos os dados que foram pedidos na interface
        patio().adicionar({ modelo, placa, entrada: new Date().toISOString() }, true);
    });
})();
