import "./css/index.css"
import IMask from "imask"
import Swal from "sweetalert2"

//Constantes para criar as cores do cartão
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    rocketseat: ["#0D6F5D", "#C3129C"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType

//Criando constantes para mascaras CVC
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const sercurityCodeMasked = IMask(securityCode, securityCodePattern)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//No cardNumber esta sendo selecionado o número do cartão no Html e salvo na constantes
const cardNumber = document.querySelector("#card-number")
//Aqui está sendo definido o padrão da Mascara.
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  //Essa function somente funciona se tiver um retorno
  dispatch: function (appended, dynamicMasked) {
    var number = (dynamicMasked.value + appended).replace(/\D/g, "")
    return dynamicMasked.compiledMasks.find(function (m) {
      return number.match(m.regex) //=== 0 ? "number" : "1234 5678 9012 3456" //Tratamento com If ternário
    })
  },
}
//Aqui temos a referencia do input com a mascara aplicada
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
//Quando meu codigo usa o evento de click, ele dispara uma função no caso a Arrow Function, função anonima.
addButton.addEventListener("click", () => {
  alert()
})
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//Alert personalizado com sweetalert2
function alert() {
  Swal.fire({
    title: "Você quer adicionar este cartão?",
    text: "Cartão ficará salvo no site!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(0 126 164)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Quero!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "Adicionado!",
        "Seu cartão foi adicionado com sucesso.Boas Compras!",
        "success"
      )
    }
  })
}

//Constante para o nome no Cartão
const nomeCartao = document.querySelector("#card-holder")
//Vai observar o evento de input e vai disparar uma função, ou seja ao digitar o nome vai colocar no cartão.
nomeCartao.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  //If ternário retorna valores true or false,  tipo: condition ? expr1 : expr2
  ccHolder.innerText =
    nomeCartao.value.length === 0 ? "FULANO DA SILVA" : nomeCartao.value
})

sercurityCodeMasked.on("accept", () => {
  updateSecurityCode(sercurityCodeMasked.value)
})

function updateSecurityCode(code) {
  //Aqui foi anotado o enderenço onde tá o input
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  //Aqui estamos acessando uma sequencia, para chegar o tipo de cartão
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
