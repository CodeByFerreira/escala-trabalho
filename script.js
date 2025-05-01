const pessoas = [
  { nome: "Moisés", cor: "lightblue" },
  { nome: "Thiago", cor: "orange" },
  { nome: "Bruno", cor: "red" },
  { nome: "Franco", cor: "yellow" },
  { nome: "Janayna", cor: "purple" },
  { nome: "Rafael", cor: "brown" },
  { nome: "Ângelo Alberto", cor: "green" }
];

const postosCompletos = [
  "Recepção",
  "Recepção",
  "Ronda",
  "Portaria",
  "Portaria",
  "Guarita Bravo",
  "Cais Delta"
];

const folgas = {
  "2025-05-01": ["Ângelo Alberto", "Franco"],
  // Exemplo: "2025-06-12": ["Thiago"],
};

const escalaInicial = [...pessoas]; // posição inicial
let posicoes = [...escalaInicial];

const inicio = new Date("2025-05-01");
const fim = new Date("2025-12-31");

const container = document.getElementById("app");

function formatarData(data) {
  return data.toISOString().split("T")[0];
}

function gerarEscala() {
  const lista = document.createElement("div");

  let dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    const dataFormatada = formatarData(dataAtual);
    const folguistas = folgas[dataFormatada] || [];

    const ativos = posicoes.filter(p => !folguistas.includes(p.nome));
    const numAtivos = ativos.length;

    let postos = [...postosCompletos];

    if (numAtivos < 7) postos = postos.filter(p => p !== "Ronda");
    if (numAtivos < 6) postos = postos.filter(p => p !== "Guarita Bravo");
    if (numAtivos < 5) postos = postos.filter(p => p !== "Cais Delta");

    const bloco = document.createElement("div");
    bloco.innerHTML = <h3>${dataFormatada}</h3>;
    postos.forEach((posto, i) => {
      const pessoa = ativos[i % ativos.length];
      const linha = document.createElement("p");
      linha.innerHTML = <strong>${posto}:</strong> <span style="color:${pessoa.cor}">${pessoa.nome}</span>;
      bloco.appendChild(linha);
    });

    // Reorganiza a rotação (pula quem está de folga)
    const novaOrdem = [];
    for (let i = 0; i < posicoes.length; i++) {
      const pessoa = posicoes[i];
      if (!folguistas.includes(pessoa.nome)) {
        novaOrdem.push(pessoa);
      }
    }
    // Reinsere folguistas onde estavam
    folguistas.forEach(nomeFolga => {
      const pessoaFolga = pessoas.find(p => p.nome === nomeFolga);
      const posOriginal = posicoes.findIndex(p => p.nome === nomeFolga);
      novaOrdem.splice(posOriginal, 0, pessoaFolga);
    });

    posicoes = [...novaOrdem.slice(1), novaOrdem[0]]; // rotação padrão

    lista.appendChild(bloco);
    dataAtual.setDate(dataAtual.getDate() + 2); // próximo plantão
  }

  container.innerHTML = "";
  container.appendChild(lista);
}

gerarEscala();
