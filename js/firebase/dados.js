/**
 * Copyright 2023 Prof. Ms. Ricardo Leme All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict' //modo estrito

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} collection - Nome da collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
async function obtemDados(collection) {
    let spinner = document.getElementById('carregandoDados')
    let tabela = document.getElementById('tabelaDados')
    await firebase.database().ref(collection).orderByChild('nome').on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'fundo-verde-firebase'
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Nascimento'
        cabecalho.insertCell().textContent = 'Sexo'
        cabecalho.insertCell().textContent = 'CPF'
        cabecalho.insertCell().textContent = 'Email'
        cabecalho.insertCell().textContent = 'Telefone'
        cabecalho.insertCell().textContent = 'Envio'
        cabecalho.insertCell().textContent = 'CEP'
        cabecalho.insertCell().textContent = 'F'
        cabecalho.insertCell().textContent = 'P'
        cabecalho.insertCell().textContent = 'V'
        cabecalho.insertCell().textContent = 'B'
        cabecalho.insertCell().textContent = 'M'
        cabecalho.insertCell().innerHTML = 'Opções'

        snapshot.forEach(item => {
            // Dados do Firebase
            let db = item.ref._delegate._path.pieces_[0] //collection
            let id = item.ref._delegate._path.pieces_[1] //id do registro   
                //Criando as novas linhas na tabela
            let novaLinha = tabela.insertRow()
            novaLinha.insertCell().innerHTML = '<small>' + item.val().nome + '</small>'
            novaLinha.insertCell().textContent = new Date(item.val().nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            novaLinha.insertCell().textContent = item.val().sexo
            novaLinha.insertCell().innerHTML = '<small>' + item.val().cpf + '</small>'
            novaLinha.insertCell().innerHTML = '<small>' + item.val().email + '</small>'
            novaLinha.insertCell().innerHTML = '<small>' + item.val().telefone + '</small>'
            novaLinha.insertCell().innerHTML = '<small>' + item.val().formadeenvio + '</small>'
            novaLinha.insertCell().innerHTML = '<small>' + item.val().cep + '</small>'
            novaLinha.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(item.val().ins_0)
            novaLinha.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(item.val().ins_1)
            novaLinha.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(item.val().ins_2)
            novaLinha.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(item.val().ins_3)
            novaLinha.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(item.val().ins_4)
            novaLinha.insertCell().innerHTML = `<button class='btn btn-sm btn-danger' onclick=remover('${db}','${id}')><i class="bi bi-trash"></i></button>
      <button class='btn btn-sm btn-warning' onclick=carregaDadosAlteracao('${db}','${id}')><i class="bi bi-pencil-square"></i></button>`

        })
        let rodape = tabela.insertRow()
        rodape.className = 'fundo-verde-firebase'
        rodape.insertCell().colSpan = "13"
        rodape.insertCell().innerHTML = totalRegistros(collection)

    })
    spinner.classList.add('d-none') //oculta o carregando...
}

/**
 * obtemDados.
 * Obtem dados da collection a partir do Firebase.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {object} - Os dados do registro serão vinculados aos inputs do formulário.
 */

async function carregaDadosAlteracao(db, id) {
    await firebase.database().ref(db + '/' + id).on('value', (snapshot) => {
        document.getElementById('id').value = id
        document.getElementById('nome').value = snapshot.val().nome
        document.getElementById('nascimento').value = snapshot.val().nascimento
        document.getElementById('cpf').value = snapshot.val().cpf
        document.getElementById('email').value = snapshot.val().email
        document.getElementById('telefone').value = snapshot.val().email
        document.getElementById('cep').value = snapshot.val().cep

        if (snapshot.val().sexo === 'Masculino') {
            document.getElementById('sexoM').checked = true
        } else {
            document.getElementById('sexoF').checked = true
        }

        if (snapshot.val().envio === 'Entregar') {
            document.getElementById('envio-1').select = true
        } else {
            document.getElementById('envio-2').select = true
        }
    })

    document.getElementById('nome').focus() //Definimos o foco no campo nome
}



/**
 * incluir.
 * Inclui os dados do formulário na collection do Firebase.
 * @param {object} event - Evento do objeto clicado
 * @param {string} collection - Nome da collection no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
    event.preventDefault() // evita que o formulário seja recarregado
        //Verifica os campos obrigatórios
    if (document.getElementById('nome').value === '') { alerta('⚠️É obrigatório informar o nome!', 'warning') } 
    else if (document.getElementById('nascimento').value === '') { alerta('⚠️É obrigatório informar o nascimento!', 'warning') } 
    else if (document.getElementById('cpf').value === '') { alerta('⚠️É obrigatório informar o CPF!', 'warning') } 
    else if (document.getElementById('email').value === '') { alerta('⚠️É obrigatório informar o email!', 'warning') } 
    else if (document.getElementById('telefone').value === '') { alerta('⚠️É obrigatório informar o telefone!', 'warning') } 
    else if (document.getElementById('formadeenvio').value === 'Selecione...') { alerta('⚠️É obrigatório informar uma forma de envio!', 'warning') } 
    else if (document.getElementById('cep').value === '') { alerta('⚠️É obrigatório informar o CEP!', 'warning') } 
    else if (document.getElementById('ins_0').value === 0 && document.getElementById('ins_1').value === 0 && document.getElementById('ins_2').value === 0 && document.getElementById('ins_3').value === 0 && document.getElementById('ins_4').value === 0) { alerta('⚠️Deve-se indicar pelo menos 1 instrumento a se comprar!', 'warning') } 
    else if (document.getElementById('id').value !== '') { alterar(event, collection) } 
    else { incluir(event, collection) }
}


async function incluir(event, collection) {
    let usuarioAtual = firebase.auth().currentUser
    let botaoSalvar = document.getElementById('btnSalvar')
    botaoSalvar.innerText = 'Aguarde...'
    event.preventDefault()
        //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    //Enviando os dados dos campos para o Firebase
    return await firebase.database().ref(collection).push({
            nome: values.nome.toUpperCase(),
            email: values.email.toLowerCase(),
            sexo: values.sexo,
            telefone: values.telefone,
            formadeenvio: values.formadeenvio,
            nascimento: values.nascimento,
            cpf: values.cpf,
            cep: values.cep,
            ins_0: values.ins_0,
            ins_1: values.ins_1,
            ins_2: values.ins_2,
            ins_3: values.ins_3,
            ins_4: values.ins_4,
            usuarioInclusao: {
                uid: usuarioAtual.uid,
                nome: usuarioAtual.displayName,
                urlImagem: usuarioAtual.photoURL,
                email: usuarioAtual.email,
                dataInclusao: new Date()
            }
        })
        .then(() => {
            alerta(`✅ Registro incluído com sucesso!`, 'success')
            document.getElementById('formCadastro').reset() //limpa o form
                //Limpamos o avatar do cliente
            botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
        })
        .catch(error => {
            alerta('❌ Falha ao incluir: ' + error.message, 'danger')
        })

}

async function alterar(event, collection) {
    let usuarioAtual = firebase.auth().currentUser
    let botaoSalvar = document.getElementById('btnSalvar')
    botaoSalvar.innerText = 'Aguarde...'
    event.preventDefault()
        //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    //Enviando os dados dos campos para o Firebase
    return await firebase.database().ref().child(collection + '/' + values.id).update({
            nome: values.nome.toUpperCase(),
            email: values.email.toLowerCase(),
            sexo: values.sexo,
            telefone: values.telefone,
            formadeenvio: values.formadeenvio,
            nascimento: values.nascimento,
            cpf: values.cpf,
            cep: values.cep,
            ins_0: values.ins_0,
            ins_1: values.ins_1,
            ins_2: values.ins_2,
            ins_3: values.ins_3,
            ins_4: values.ins_4,
            usuarioAlteracao: {
                uid: usuarioAtual.uid,
                nome: usuarioAtual.displayName,
                urlImagem: usuarioAtual.photoURL,
                email: usuarioAtual.email,
                dataAlteracao: new Date()
            }
        })
        .then(() => {
            alerta('✅ Registro alterado com sucesso!', 'success')
            document.getElementById('formCadastro').reset()
            document.getElementById('id').value = ''
            botaoSalvar.innerHTML = '<i class="bi bi-save-fill"></i> Salvar'
        })
        .catch(error => {
            console.error(error.code)
            console.error(error.message)
            alerta('❌ Falha ao alterar: ' + error.message, 'danger')
        })
}

/**
 * remover.
 * Remove os dados da collection a partir do id passado.
 * @param {string} db - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */
async function remover(db, id) {
    if (window.confirm("⚠️Confirma a exclusão do registro?")) {
        let dadoExclusao = await firebase.database().ref().child(db + '/' + id)
        dadoExclusao.remove()
            .then(() => {
                alerta('✅ Registro removido com sucesso!', 'success')
            })
            .catch(error => {
                console.error(error.code)
                console.error(error.message)
                alerta('❌ Falha ao excluir: ' + error.message, 'danger')
            })
    }
}


/**
 * totalRegistros
 * Retornar a contagem do total de registros da collection informada
 * @param {string} collection - Nome da collection no Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snap) => {
        if (snap.numChildren() === 0) {
            retorno = '⚠️ Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total: <span class="badge fundo-laranja-escuro"> ${snap.numChildren()} </span>`
        }
    })
    return retorno
}

/**
 * Formata o valor do campo de CPF com pontos e traço enquanto o usuário digita os dados.
 *
 * @param {object} campo - O campo de entrada do CPF.
 */
function formatarCPF(campo) {
    // Remove caracteres não numéricos
    var cpf = campo.value.replace(/\D/g, '');

    // Adiciona pontos e traço conforme o usuário digita
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    // Atualiza o valor do campo
    campo.value = cpf;
}

function formatarTelefone(campo) {
    // Remove caracteres não numéricos
    var telefone = campo.value.replace(/\D/g, '');

    // Verifica se é um número de telefone fixo ou celular
    if (telefone.length === 10) {
        // Formatação para número de telefone fixo: (XX)XXXX-XXXX
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1)$2-$3');
    } else if (telefone.length === 11) {
        // Formatação para número de celular: (XX)9XXXX-XXXX
        telefone = telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1)$2$3-$4');
    }

    // Atualiza o valor do campo
    campo.value = telefone;
}

function formatarCEP(campo3) {
    // Remove caracteres não numéricos
    var CEP = campo3.value.replace(/\D/g, '');

    // Adiciona pontos e traço conforme o usuário digita
    CEP = CEP.replace(/(\d{3})(\d)/, '$1$2');
    CEP = CEP.replace(/(\d{5})(\d)/, '$1-$2');


    // Atualiza o valor do campo
    campo3.value = CEP;

}