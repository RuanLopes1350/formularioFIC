import './styles/globalReset.css'
import './styles/style.css'
import { z } from 'zod';
import { userSchema, type UserData } from './validations/formSchema.ts'

const nome = document.querySelector<HTMLInputElement>('#name')!
const email = document.querySelector<HTMLInputElement>('#email')!
const generoMasculino = document.querySelector<HTMLInputElement>('#male')!
const generoFeminino = document.querySelector<HTMLInputElement>('#female')!
const curso = document.querySelector<HTMLSelectElement>('#course')!
const observacoes = document.querySelector<HTMLTextAreaElement>('#observations')!
const termos = document.querySelector<HTMLInputElement>('#terms')!
const submitButton = document.querySelector<HTMLButtonElement>('#submitButton')!
const switchTheme = document.querySelector('#switch')!

function toggleMode() {
    const html = document.documentElement;
    html.classList.toggle("dark");
}

(window as any).toogleMode = toggleMode;
(window as any).toggleMode = toggleMode;

function validarDados(dados: any): dados is UserData {
    try {
        userSchema.parse(dados);
        return true;
    } catch (erro) {
        if (erro instanceof z.ZodError) {
            const erros = erro.errors.map(err => ({
                campo: err.path.join('.'),
                mensagem: err.message
            }));

            const erroFormatado = {
                name: 'ValidationError',
                message: 'Erro de validação',
                details: erros
            };
            console.error(erroFormatado);
            alert(`Erro de validação: ${erros.map(e => e.mensagem).join('\n')}`);
            return false;
        }

        alert(`Ocorreu um erro: ${erro}`);
        return false;
    }
}

async function enviarDadosParaServer(dados: UserData) {
    try {
        // log para depuração
        console.log('Enviando dados para:', 'http://localhost:3000/users', dados);

        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            console.error(`Erro na resposta: Status ${response.status}`);
            const errorText = await response.text();
            console.error(`Resposta de erro: ${errorText}`);
            throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }

        const dadosSalvos = await response.json();
        console.log('Dados salvos com sucesso:', dadosSalvos);
        return true;
    } catch (erro) {
        console.error('Erro detalhado:', erro);
        alert(`Erro ao enviar dados: ${erro}`);
        return false;
    }
}

submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const nomeUser = nome.value.trim();
    const emailUser = email.value.trim();
    const generoUser = generoMasculino.checked ? 'masculino' : (generoFeminino.checked ? 'feminino' : '');
    const cursoUser = curso.value !== '' ? curso.value : '';
    const observacoesUser = observacoes.value.trim();
    const termosUser = termos.checked;

    const dados = {
        name: nomeUser,
        email: emailUser,
        gender: generoUser,
        course: cursoUser,
        observations: observacoesUser,
        terms: termosUser
    }

    if (!validarDados(dados)) {
        return;
    }

    console.log('Dados válidos:', dados);

    const sucesso = await enviarDadosParaServer(dados);

    if (sucesso) {
        alert('Formulário enviado com sucesso!');

        // Limpar o formulário
        nome.value = '';
        email.value = '';
        generoMasculino.checked = false;
        generoFeminino.checked = false;
        curso.value = ''; // Changed from 'null' to empty string
        observacoes.value = '';
        termos.checked = false;
    }
});

switchTheme.addEventListener('click', toggleMode);