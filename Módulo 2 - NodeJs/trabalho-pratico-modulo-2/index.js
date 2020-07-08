import { promises } from "fs";

global.estadosFile = "./Estados.json";
global.cidadesFile = "./Cidades.json";
global.diretorioEstados = "./estados/"

const readFile = promises.readFile;
const writeFile = promises.writeFile;

start();

async function start() {
    //escreveJsonEstados();
    const qtdCidades = await calculaQtdCidadesPorEstado("SP");
    console.log(qtdCidades);
    await retornaCincoEstadosComMaisCidades();
    await retornaCincoEstadosComMenosCidades();
    await retornaCidadeComMaiorNomePorEstado();
    await retornaCidadeComMenorNomePorEstado();
    await retornaCidadeComMaiorNomeDeTodosEstados();
    await retornaCidadeComMenorNomeDeTodosEstados();
}

async function escreveJsonEstados() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const respCidades = await readFile(global.cidadesFile, "utf8");
        const estadosJson = JSON.parse(respEstados);
        const cidadesJson = JSON.parse(respCidades);

        for (let i = 0; i < estadosJson.length; i++) {
            let cidadesPorEstado = cidadesJson.filter(cidade => cidade.Estado === estadosJson[i].ID).map((cidade) => {
                return {
                    NomeCidade: cidade.Nome
                }
            });

            const fileName = `${global.diretorioEstados}${estadosJson[i].Sigla}.json`;
            await writeFile(fileName, JSON.stringify(cidadesPorEstado));
        }
    } catch (error) {
        console.log(error);
    }
}

async function calculaQtdCidadesPorEstado(uf) {
    try {
        const respCidadesPorEstado = await readFile(`${global.diretorioEstados}${uf}.json`, "utf8");
        const cidadesPorEstadoJson = JSON.parse(respCidadesPorEstado);

        return cidadesPorEstadoJson.length;
    } catch (error) {
        console.log(error);
    }
}

async function retornaCincoEstadosComMaisCidades() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const estadosJson = JSON.parse(respEstados);
        const topFiveEstados = [];

        for (let i = 0; i < estadosJson.length; i++) {
            const qtdCidades = await calculaQtdCidadesPorEstado(estadosJson[i].Sigla);
            estadosJson[i].QuantidadeCidades = qtdCidades;
        }

        estadosJson.sort((a, b) => b.QuantidadeCidades - a.QuantidadeCidades);

        for (let i = 0; i < 5; i++) {
            topFiveEstados.push(`${estadosJson[i].Sigla} - ${estadosJson[i].QuantidadeCidades}`);
        }

        console.log(topFiveEstados);
    } catch (error) {
        console.log(error);
    }
}

async function retornaCincoEstadosComMenosCidades() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const estadosJson = JSON.parse(respEstados);
        let minorsFiveEstados = [];
        let minorsFiveEstadosConsole = [];

        for (let i = 0; i < estadosJson.length; i++) {
            const qtdCidades = await calculaQtdCidadesPorEstado(estadosJson[i].Sigla);
            estadosJson[i].QuantidadeCidades = qtdCidades;
        }

        estadosJson.sort((a, b) => a.QuantidadeCidades - b.QuantidadeCidades);
        minorsFiveEstados = estadosJson.slice(0, 5)
            .sort((a, b) => b.QuantidadeCidades - a.QuantidadeCidades);

        for (let i = 0; i < minorsFiveEstados.length; i++) {
            minorsFiveEstadosConsole.push(`${minorsFiveEstados[i].Sigla} - ${minorsFiveEstados[i].QuantidadeCidades}`);
        }

        console.log(minorsFiveEstadosConsole);
    } catch (error) {
        console.log(error);
    }
}

async function retornaCidadeComMaiorNomePorEstado() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const estadosJson = JSON.parse(respEstados);

        let maioresNomesDeCidades = [];
        let maioresNomesDeCidadesConsole = [];

        for (let i = 0; i < estadosJson.length; i++) {
            const respCidadesPorEstado = await readFile(`${global.diretorioEstados}${estadosJson[i].Sigla}.json`, "utf8");
            const cidadesPorEstadoJson = JSON.parse(respCidadesPorEstado);

            cidadesPorEstadoJson.sort((a, b) => {
                return b.NomeCidade.length - a.NomeCidade.length || a.NomeCidade.localeCompare(b.NomeCidade);
            });

            maioresNomesDeCidades = cidadesPorEstadoJson.slice(0, 1);
            maioresNomesDeCidadesConsole.push(`${maioresNomesDeCidades[0].NomeCidade} - ${estadosJson[i].Sigla}`);
        }

        console.log(maioresNomesDeCidadesConsole);
    } catch (error) {
        console.log(error);
    }
}

async function retornaCidadeComMenorNomePorEstado() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const estadosJson = JSON.parse(respEstados);

        let menoresNomesDeCidades = [];
        let menoresNomesDeCidadesConsole = [];

        for (let i = 0; i < estadosJson.length; i++) {
            const respCidadesPorEstado = await readFile(`${global.diretorioEstados}${estadosJson[i].Sigla}.json`, "utf8");
            const cidadesPorEstadoJson = JSON.parse(respCidadesPorEstado);

            cidadesPorEstadoJson.sort((a, b) => {
                return a.NomeCidade.length - b.NomeCidade.length || a.NomeCidade.localeCompare(b.NomeCidade);
            });

            menoresNomesDeCidades = cidadesPorEstadoJson.slice(0, 1);
            menoresNomesDeCidadesConsole.push(`${menoresNomesDeCidades[0].NomeCidade} - ${estadosJson[i].Sigla}`);
        }

        console.log(menoresNomesDeCidadesConsole);
    } catch (error) {
        console.log(error);
    }
}

async function retornaCidadeComMaiorNomeDeTodosEstados() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const respCidades = await readFile(global.cidadesFile, "utf8");
        const estadosJson = JSON.parse(respEstados);
        const cidadesJson = JSON.parse(respCidades);
        let cidadeMaiorNome = [];

        cidadesJson.sort((a, b) => {
            return b.Nome.length - a.Nome.length || a.Nome.localeCompare(b.Nome);
        });
        cidadeMaiorNome = cidadesJson.slice(0, 1);
        const estadoCidade = estadosJson.filter(estado => estado.ID === cidadeMaiorNome[0].Estado)[0].Sigla;

        console.log(`${cidadeMaiorNome[0].Nome} - ${estadoCidade}`);
    } catch (error) {
        console.log(error);
    }
}

async function retornaCidadeComMenorNomeDeTodosEstados() {
    try {
        const respEstados = await readFile(global.estadosFile, "utf8");
        const respCidades = await readFile(global.cidadesFile, "utf8");
        const estadosJson = JSON.parse(respEstados);
        const cidadesJson = JSON.parse(respCidades);
        let cidadeMenorNome = [];

        cidadesJson.sort((a, b) => {
            return a.Nome.length - b.Nome.length || a.Nome.localeCompare(b.Nome);
        });
        cidadeMenorNome = cidadesJson.slice(0, 1);
        const estadoCidade = estadosJson.filter(estado => estado.ID === cidadeMenorNome[0].Estado)[0].Sigla;

        console.log(`${cidadeMenorNome[0].Nome} - ${estadoCidade}`);
    } catch (error) {
        console.log(error);
    }
}