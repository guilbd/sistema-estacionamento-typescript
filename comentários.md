**Iniciando projeto com typescript**

```
tsc --init
```

irá criar o arquivo tsconfig.json

criar o arquivo em estrutura html:

```
index.html
```

criar o arquivo para conter o arquivo com as funções do script:

```
scripts.ts
```

executar o comando tsc no terminal para compilar o arquivo script.ts em script.js

```
tsc
```

adicionar a tag script no arquivo index.html:

```
<script src="script.js"></script>
```
No arquivo script.ts começo criando uma variável para facilitar a escrita do código:
```
const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
```
Identifico que quero capturar um elemento do tipo **input** através do **HMTLInputElement** e coloco a opção de ser nulo.
os parametros tem que ser tipados para o typescript identificar o tipo do parametro, ex.: query: string

Coloco uma ação de escutar o botão **cadastrar**, capturando os dados de modelo e placa:
```
$("#cadastrar")?.addEventListener("click", () => {
    const modelo = $("#modelo")?.value;
    const placa = $("#placa")?.value;
```

e faço a verificação se os campos estão preenchidos:
```
if(!modelo || !placa){
      alert("Os campos nome e placa são obrigatórios")
      return;
    }
```