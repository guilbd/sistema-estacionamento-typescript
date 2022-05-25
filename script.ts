//similar ao conceito de classe
interface Veiculo{
  modelo: string;
  placa: string;
  //entrada coloca a opção de string para poder realizar calculo com as datas
  entrada: Date | string;
}

(function () {
  // crio a variavel $ para encurtar a escrita do código, já identificando que o parâmetro que quero é uma string
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query); 

  //função para calcular o tempo que o cliente ficou no estacionamento. Uso parametro mil para trabalhar com milissegundos
  function calcTempo(mil: number){
    //operação para ter os minutos
    const min = Math.floor(mil / 60000 )
    //faço operação com "resto"para ter os segundos
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`;
  }

  //função principal
  function patio(){

    //função para persistencia de dados. A função sempre vai retornar um array de Veiculo
    function ler(): Veiculo[]{
      //verifico se em localStorage.patio tem algum dado, se tiver eu faço o Parse do JSON, se não, retorno um array vazio
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    
    //array de todos os veiculos a serem salvos no array
    function salvar(veiculo: Veiculo[]){
      //coloco o item a ser salvo em pátio, passo para string (stringfy), pois localStorage só reconhece string
      localStorage.setItem("patio", JSON.stringify(veiculo))
    }


    //a função adicionar espera um veiculo conforme a INTERFACE VEICULO, coloco o parametro salvaVeiculo como boolean, para não salvar duplicado toda vez que der reload
    function adicionar(veiculo: Veiculo, salvaVeiculo?: boolean){
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

      //procuro a classe "delete", adiciono o evento de click para remover o veiculo atraves do dataset vinculado a placa
      row.querySelector(".delete")?.addEventListener("click", function(){
        remover(this.dataset.placa)
      })

      //concateno ao pátio uma nova linha
      $("#patio")?.appendChild(row)

      //faço a veriricação através do salvaVeiculo, se for True eu pego todos os veiculos já cadastrados através do "spread" (...ler), e adiciono um novo que vem através do parâmetro da função adicionar (veiculo: Veiculo)
      if (salvaVeiculo) salvar([...ler(), veiculo])
    }

    function remover(placa: string){
      //variavel para buscar o veiculo referente a placa passada pelo parâmetro
      const { entrada, modelo} = ler().find(veiculo => veiculo.placa === placa);

      //utilizo o getTime() para poder realizar a operação aritmética
      const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

      //verificação se deseja deletar (!confirm) se ele negar mantenho o veiculo
      if(!confirm(`O veiculo ${modelo} permaneceu por ${tempo}, deseja encerrar? `)) return;

      //se ele confirmar, retiro o veiculo e salvo novamente.Trago todos os veiculos que tem a placa diferente da selecionada para exclusão
      salvar(ler().filter(veiculo => veiculo.placa !== placa));

      //renderização após a retirada do veículo
      render();
    }

    //função para renderizar o HTML
    function render(){
      //primeiro capuramos as informações que vem de #patio. Como tenho certeza de que sempre vai retornar um valor pq #patio está declarado no index.html, posso utilizar a opção Force (!)
      $("#patio")!.innerHTML = ""

      const patio = ler();

      if (patio.length) {
        //vou iterar por cada item de pátio e ao final adiciono mais uma linha com o novo veiculo cadastrado
        patio.forEach((veiculo) => adicionar(veiculo))
      }
    }

    return { ler, adicionar, remover, salvar, render}
  }

  //chamo a função de renderizar
  patio().render();
  //ao clicar no botão cadastrar os valores digitados em modelo e placa são capturados
  $("#cadastrar")?.addEventListener("click", () => {
    //ao clicar no botão cadastrar os valores digitados em modelo e placa são capturados
    const modelo = $("#modelo")?.value;
    const placa = $("#placa")?.value;
    //validação se os dados obrigatórios foram preenchidos
    if(!modelo || !placa){ 
      alert("Os campos nome e placa são obrigatórios")
      return;
    }

    //ao chamar a função adicionar, é necessário colocar todos os dados que foram pedidos na interface
    patio().adicionar({ modelo, placa, entrada: new Date().toISOString()}, true);
  })
})()