// Função para formatar o valor como R$
function formatCurrency(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = (value / 100).toFixed(2); // Divide por 100 e fixa em 2 casas decimais
    value = value.replace('.', ','); // Substitui ponto por vírgula
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos a cada 3 dígitos
    value = `R$ ${value}`; // Adiciona o símbolo de R$
    input.value = value;
}

// Adiciona os listeners para os campos de valor
document.getElementById('current-plan').addEventListener('input', formatCurrency);
document.getElementById('new-plan').addEventListener('input', formatCurrency);
document.getElementById('discount').addEventListener('input', formatCurrency);

// Função principal de cálculo
function calculateUpsell() {
    // Captura e formata os valores dos planos e desconto
    const currentPlan = parseFloat(document.getElementById('current-plan').value.replace(/[R$\s.]/g, '').replace(',', '.'));
    const newPlan = parseFloat(document.getElementById('new-plan').value.replace(/[R$\s.]/g, '').replace(',', '.'));
    const startDate = new Date(document.getElementById('start-date').value);
    const migrationDate = new Date(document.getElementById('migration-date').value);
    const discount = parseFloat(document.getElementById('discount').value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;

    // Validações
    if (isNaN(currentPlan) || isNaN(newPlan)) {
        document.getElementById('result').textContent = 'Por favor, preencha todos os campos corretamente.';
        document.getElementById('result-extenso').textContent = '';
        document.getElementById('detalhes-calculo').textContent = '';
        return;
    }

    if (startDate > migrationDate) {
        document.getElementById('result').textContent = 'A data de contratação do plano Atual não pode ser maior que a data de migração para o novo plano.';
        document.getElementById('result-extenso').textContent = '';
        document.getElementById('detalhes-calculo').textContent = '';
        return;
    }

    // Cálculo da data de renovação
    const renewalDate = new Date(startDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    // Cálculo dos meses utilizados e restantes
    const startMonth = startDate.getMonth();
    const migrationMonth = migrationDate.getMonth();
    const monthsUsed = migrationMonth - startMonth;
    const monthsRemaining = 12 - monthsUsed;

    // Cálculo dos valores mensais
    const currentMonthly = currentPlan / 12;
    const newMonthly = newPlan / 12;

    // Cálculo dos valores proporcionais
    const amountUsed = currentMonthly * monthsUsed;
    const amountRemaining = currentPlan - amountUsed;
    const newPlanProportional = newMonthly * monthsRemaining;

    // Cálculo da diferença
    let difference = newPlanProportional - amountRemaining - discount;

    // Formatação e exibição do resultado
    const formattedDifference = difference.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    document.getElementById('result').textContent = `Valor da diferença a ser cobrada para migração de plano: R$ ${formattedDifference}`;
    document.getElementById('result-extenso').textContent = `Valor por extenso: ${capitalizeWords(numeroParaExtenso(difference.toFixed(2)))}`;

    // Exibe os detalhes do cálculo
    exibirDetalhesCalculo(currentPlan, newPlan, monthsUsed, monthsRemaining, currentMonthly, newMonthly, amountUsed, amountRemaining, newPlanProportional, discount, difference);

    // Limpa o campo de desconto e adiciona efeito visual
    document.getElementById('discount').value = '';
    document.getElementById('result').classList.add('updated');
    document.getElementById('result-extenso').classList.add('updated');

    setTimeout(() => {
        document.getElementById('result').classList.remove('updated');
        document.getElementById('result-extenso').classList.remove('updated');
    }, 3000);
}

// Função para exibir os detalhes do cálculo
function exibirDetalhesCalculo(currentPlan, newPlan, monthsUsed, monthsRemaining, currentMonthly, newMonthly, amountUsed, amountRemaining, newPlanProportional, discount, difference) {
    const detalhes = `
        <h3>Detalhes do Cálculo:</h3>
        <p><strong>Valor Total do Plano Atual:</strong> R$ ${currentPlan.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Valor Total do Novo Plano:</strong> R$ ${newPlan.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Meses Utilizados do Plano Atual:</strong> ${monthsUsed} meses</p>
        <p><strong>Meses Restantes do Plano Atual:</strong> ${monthsRemaining} meses</p>
        <p><strong>Valor Mensal do Plano Atual:</strong> R$ ${currentMonthly.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Valor Mensal do Novo Plano:</strong> R$ ${newMonthly.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Valor Utilizado do Plano Atual:</strong> R$ ${amountUsed.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Valor Restante do Plano Atual:</strong> R$ ${amountRemaining.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Valor Proporcional do Novo Plano:</strong> R$ ${newPlanProportional.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Desconto Aplicado:</strong> R$ ${discount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
        <p><strong>Diferença Calculada:</strong> R$ ${difference.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
    `;

    document.getElementById('detalhes-calculo').innerHTML = detalhes;
}

// Função para converter número para extenso
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

// Função auxiliar para converter números em extenso
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

// Função para capitalizar palavras
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
