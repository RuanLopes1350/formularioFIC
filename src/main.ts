import './styles/globalReset.css'
import './styles/style.css'
import './validations/formSchema.ts'
import { z } from 'zod';
import { userSchema } from './validations/formSchema.ts'

const nome = document.querySelector<HTMLInputElement>('#name')!
const email = document.querySelector<HTMLInputElement>('#email')!
const generoMasculino = document.querySelector<HTMLInputElement>('#male')!
const generoFeminino = document.querySelector<HTMLInputElement>('#female')!
const curso = document.querySelector<HTMLSelectElement>('#course')!
const observacoes = document.querySelector<HTMLTextAreaElement>('#observations')!
const termos = document.querySelector<HTMLInputElement>('#terms')!
const submitButton = document.querySelector<HTMLButtonElement>('#submitButton')!

function validarDados(nome: string, email: string) {
    try {
        const nomeValido = userSchema.shape.name?.parse(nome);
        const emailValido = userSchema.shape.email?.parse(email);

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
            alert(`Erro de validação: ${JSON.stringify(erroFormatado.details.map(e => e.mensagem).join(', '))}`);
            return false;
        }

        alert(`Ocorreu um erro: ${erro}`);
        return false;
    }
}

async function enviarDadosParaServer(dados: any) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }

        const dadosSalvos = await response.json();
        console.log('Dados salvos com sucesso:', dadosSalvos);
        return true;
    } catch (erro) {
        console.error('Erro ao enviar dados:', erro);
        alert(`Erro ao enviar dados: ${erro}`);
        return false;
    }
}

submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const nomeUser = nome.value;
    const emailUser = email.value;
    const generoUser = generoMasculino.checked ? 'masculino' : (generoFeminino.checked ? 'feminino' : '');
    const cursoUser = curso.value;
    const observacoesUser = observacoes.value;
    const termosUser = termos.checked;

    if (!nomeUser || !emailUser || !generoUser || !termosUser) {
        alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
        return;
    }

    if (!validarDados(nomeUser, emailUser)) {
        return;
    }

    const dados = {
        nome: nomeUser,
        email: emailUser,
        genero: generoUser,
        curso: cursoUser,
        observacoes: observacoesUser,
        termos: termosUser
    }
    console.log(dados);

    const sucesso = await enviarDadosParaServer(dados);

    if (sucesso) {
        alert('Formulário enviado com sucesso!');

        nome.value = '';
        email.value = '';
        generoMasculino.checked = false;
        generoFeminino.checked = false;
        curso.value = '';
        observacoes.value = '';
        termos.checked = false;

    }
})