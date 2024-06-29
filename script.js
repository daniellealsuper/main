// script.js
document.getElementById('current-plan').addEventListener('input', formatCurrency);
document.getElementById('new-plan').addEventListener('input', formatCurrency);
document.getElementById('discount').addEventListener('input', formatCurrency);

function formatCurrency(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = (value / 100).toFixed(2); // Divide por 100 e fixa em 2 casas decimais
    value = value.replace('.', ','); // Substitui ponto por vírgula
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos a cada 3 dígitos
    input.value = `R$ ${value}`;
}

function calculateUpsell() {
    const currentPlanValue = document.getElementById('current-plan').value.replace(/[R$\s.]/g, '').replace(',', '.');
    const newPlanValue = document.getElementById('new-plan').value.replace(/[R$\s.]/g, '').replace(',', '.');
    const discountValue = document.getElementById('discount').value.replace(/[R$\s.]/g, '').replace(',', '.');

    const currentPlan = parseFloat(currentPlanValue);
    const newPlan = parseFloat(newPlanValue);
    const startDate = new Date(document.getElementById('start-date').value);
    const migrationDate = new Date(document.getElementById('migration-date').value);
    const discount = parseFloat(discountValue) || 0;

    if (isNaN(currentPlan) || isNaN(newPlan)) {
        document.getElementById('result').textContent = 'Por favor, preencha todos os campos corretamente.';
        document.getElementById('result-extenso').textContent = '';
        return;
    }

    const startMonth = startDate.getMonth();
    const migrationMonth = migrationDate.getMonth();
    const monthsUsed = migrationMonth - startMonth;
    const monthsRemaining = 12 - monthsUsed;

    const currentMonthly = currentPlan / 12;
    const newMonthly = newPlan / 12;

    const amountUsed = currentMonthly * monthsUsed;
    const amountRemaining = currentPlan - amountUsed;

    const newPlanProportional = newMonthly * monthsRemaining;
    
    let difference = newPlanProportional - amountRemaining - discount;

    const formattedDifference = difference.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    document.getElementById('result').textContent = `Valor a ser cobrado para migração: R$ ${formattedDifference}`;
    document.getElementById('result-extenso').textContent = `Valor por extenso: ${capitalizeWords(numeroParaExtenso(difference.toFixed(2)))}`;

    document.getElementById('discount').value = '';

    document.getElementById('result').classList.add('updated');
    document.getElementById('result-extenso').classList.add('updated');

    setTimeout(() => {
        document.getElementById('result').classList.remove('updated');
        document.getElementById('result-extenso').classList.remove('updated');
    }, 3000);
}

function numeroParaExtenso(valor) {
    const unidades = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove'];
    const dezenas = ['','dez','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
    const centenas = ['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
    const especiais = ['dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];

    const partes = valor.split('.');
    const reais = parseInt(partes[0], 10);
    const centavos = parseInt(partes[1] || '0', 10);

    const extensoReais = extenso(reais);
    const extensoCentavos = extenso(centavos);

    let resultado = extensoReais + (reais === 1 ? ' real' : ' reais');

    if (centavos > 0) {
        resultado += ' e ' + extensoCentavos + (centavos === 1 ? ' centavo' : ' centavos');
    }

    return resultado;
}

function extenso(numero) {
    if (numero < 10) return unidades[numero];
    if (numero < 20) return especiais[numero - 10];
    if (numero < 100) {
        return dezenas[Math.floor(numero / 10)] + (numero % 10 === 0 ? '' : ' e ' + unidades[numero % 10]);
    }
    if (numero < 1000) {
        return centenas[Math.floor(numero / 100)] + (numero % 100 === 0 ? '' : ' e ' + extenso(numero % 100));
    }
    return '';
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
