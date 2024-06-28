// script.js
function calculateUpsell() {
    const currentPlan = parseFloat(document.getElementById('current-plan').value);
    const newPlan = parseFloat(document.getElementById('new-plan').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const migrationDate = new Date(document.getElementById('migration-date').value);
    const discount = parseFloat(document.getElementById('discount').value);
    const renewalDate = new Date(startDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

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

    // Atualiza o resultado na página
    document.getElementById('result').textContent = `Valor a ser cobrado para migração: R$${difference.toFixed(2)}`;
    document.getElementById('result-extenso').textContent = `Valor por extenso: ${numeroParaExtenso(difference.toFixed(2))}`;

    // Limpa o campo de desconto após o cálculo
    document.getElementById('discount').value = '';

    // Adiciona uma classe para destacar o resultado atualizado
    document.getElementById('result').classList.add('updated');
    document.getElementById('result-extenso').classList.add('updated');

    // Remove a classe após um breve período para remover o destaque
    setTimeout(() => {
        document.getElementById('result').classList.remove('updated');
        document.getElementById('result-extenso').classList.remove('updated');
    }, 3000); // Remove a classe após 3 segundos (3000 milissegundos)
}

function numeroParaExtenso(valor) {
    const unidades = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove'];
    const dezenas = ['','dez','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
    const centenas = ['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
    const especiais = ['dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];

    const partes = valor.split('.');
    const reais = parseInt(partes[0], 10);
    const centavos = parseInt(partes[1] || '0', 10);

    const extensoReais = convertToWords(reais) + ' reais';
    const extensoCentavos = centavos > 0 ? ' e ' + convertToWords(centavos) + ' centavos' : '';

    return extensoReais + extensoCentavos;
}

function convertToWords(number) {
    if (number === 0) return 'zero';

    const partes = [];
    let unidade, dezena, centena, milhar;

    if (number >= 1000) {
        milhar = Math.floor(number / 1000);
        partes.push(milhar === 1 ? 'mil' : unidades[milhar] + ' mil');
        number %= 1000;
    }

    if (number >= 100) {
        centena = Math.floor(number / 100);
        partes.push(centena === 1 && number % 100 === 0 ? 'cem' : centenas[centena]);
        number %= 100;
    }

    if (number >= 20) {
        dezena = Math.floor(number / 10);
        partes.push(dezenas[dezena]);
        number %= 10;
    } else if (number >= 10) {
        partes.push(especiais[number - 10]);
        number = 0;
    }

    if (number > 0) {
        partes.push(unidades[number]);
    }

    return partes.join(' e ');
}
