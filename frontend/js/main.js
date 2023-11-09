"use strict"

var DATA = { }; // iniciando o objeto literal vazio

const buttonClick = document.querySelector('#enviar');

const URL = 'http://localhost:9000/parceiros';

window.addEventListener("load",  () => {
    let allInputs = document.querySelectorAll('.data-js');

    allInputs.forEach(function(currentInput) {
       // currentInput evento p/ ouvir e mudança nos inputs
       currentInput.addEventListener("change", (input) => {
          getValues(input)
       })
    })
})


buttonClick.addEventListener("click",  async (event) => {
    event.preventDefault();

    const res = await fetch(URL, {
       method: "post",
       headers: {
         'Content-Type': 'application/json;charset=utf-8'
       },

       body: JSON.stringify(DATA)
     });
             
     messageToastr(res);
})

function getValues(input) {
    let name =  input.target.name;
    let value = input.target.value;

    DATA[name] = value;
}

function messageToastr(res) {
    if (res.status === 201) {
        toastr.success('Indicador cadastrado com sucesso !');
  
        document.querySelectorAll('.data-js').forEach(function(currentInput) {
            currentInput.value = '';
        })
  
    } else {
        toastr.error('Houve um erro ao tentar salvar os dados');
    }
}

