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
    const currentPlan = parseFloat(document.getElementById('current-plan').value.replace(/[R$\s.]/g, '').replace(',', '.'));
    const newPlan = parseFloat(document.getElementById('new-plan').value.replace(/[R$\s.]/g, '').replace(',', '.'));
    const startDate = new Date(document.getElementById('start-date').value);
    const migrationDate = new Date(document.getElementById('migration-date').value);
    const discount = parseFloat(document.getElementById('discount').value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;

    if (isNaN(currentPlan) || isNaN(newPlan)) {
        document.getElementById('result').textContent = 'Por favor, preencha todos os campos corretamente.';
        document.getElementById('result-extenso').textContent = '';
        return;
    }

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
    const
